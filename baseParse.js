import { getCursor, getSelection, last, decodeEntities, isEnd, startsWith, transFormArray, extend, isEndTag, warnLog, warnLog2, warnNotStartTag, warnLog3, warnNotEndTag, attrWarnLog, attrWarnLog2 } from "./utils.js"
function createParserContext(
    content,
    rawOptions,
) {
    const options = Object.assign({}, {});
    for (const key in rawOptions) {
        // @ts-ignore
        options[key] = rawOptions[key];
    }
    return {
        options,
        column: 1,
        line: 1,
        offset: 0,
        originalSource: content,
        source: content,
    };
}

const defaultBaseParseOptions = {
    isShowParseTime: false
}

export function baseParse(template, options = defaultBaseParseOptions) {
    const startTime = Date.now()
    const result = parseChildren(createParserContext(template), [])
    options.isShowParseTime ? console.log("编译耗时：", Date.now() - startTime) : null
    return result;
}

function parseChildren(context, ancestors) {
    const nodes = [];
    let flag
    while (context.source && (flag = !isEnd(context, ancestors))) {
        let parent = last(ancestors);
        const s = context.source;
        let node = null;
        if (startsWith(s, "<")) {
            if (s.length === 1) {
                warnLog(context)
            } else if (s[1] === "!") {
                let flag2 = false
                if (startsWith(s, "<!--")) {
                    flag2 = !!(node = parseComment(context, ancestors))
                } else if (startsWith(s, "<!DOCTYPE")) {
                    flag2 = !!(node = parseDocType(context, ancestors))
                } else if (startsWith(s, '<![CDATA[')) {
                    flag2 = !!(node = parseCDATA(context, ancestors))
                }
                if (!flag2) {
                    console.error("error comment")
                    break
                }
            } else if (s[1] === "/") {
                if (isEndTag(context.source)) {
                    flag = false
                } else {
                    console.error("error /", ancestors);
                }
                break
            } else if (/[a-z]/i.test(s[1])) {
                node = parseElement(context, ancestors, nodes)
            } else if (startsWith(s, '<?')) {
                node = parseBogusComment(context, ancestors)
            }
        }
        if (node === null) {
            parent = last(ancestors);
            node = parseText(context, ancestors);
            if (node && node.nodeValue.trim()) {
                //TODO
            } else node = null
        }
        if (node) {
            nodes.push(...transFormArray(node).filter(Boolean))
        }
    }
    if (flag === false && context.source) {
        const ecEnd = /(<\/)[^\t\r\n\f<]*(>)/.exec(context.source);
        if (!ancestors.length) {
            warnNotStartTag(context, ecEnd)
            const sliceNum = ecEnd.index + ecEnd[0].length
            context.source = context.source.slice(sliceNum)
            context.offset += sliceNum
        } else {
            const endStart = getCursor(context)
            const currentNode = ancestors.at(-1)
            const ecEndTag = ecEnd[0].slice(2, -1)
            advanceBy(context, ecEnd[0].length);
            const endEnd = getCursor(context)
            if (ecEndTag !== currentNode.tag) {
                warnLog2(context, {
                    start: endStart,
                    end: endEnd
                }, currentNode)
            }
            if (currentNode) {
                currentNode.loc.end = {
                    start: endStart,
                    end: endEnd
                }
                ancestors.pop()
            }
        }
    } else {
        if (!context.source && ancestors.length) {
            for (let i = 0; i < ancestors.length; i++) {
                warnNotEndTag(context, ancestors[i])
            }
        }
    }
    return nodes;
}

function advanceBy(context, num) {
    const sliceValue = context.source.slice(0, num)
    context.source = context.source.slice(num)
    for (let i = 0; i < sliceValue.length; i++) {
        if (sliceValue[i] === "\n") {
            context.line++
            context.column = 0
        }
        context.column++
    }
    context.offset += num
}

function parseBogusComment(context, ancestors) {
    const bogusExec = /(\s?\?>)/sg.exec(context.source);
    if (bogusExec) {
        const source = context.source.slice(0, bogusExec.index + bogusExec[0].length)
        const node = {
            loc: {
                start: getCursor(context)
            },
            type: 8,
            nodeValue: source
        }
        advanceBy(context, source.length);
        node.loc.end = getCursor(context)
        return node
    } else {
        // TODO:
    }
}

function parseCDATA(context, ancestors) {
    const findCDATAEnd = /(]]>)/sg.exec(context.source);
    if (findCDATAEnd) {
        const source = context.source.slice(0, findCDATAEnd.index + findCDATAEnd[0].length)
        const CDATANode = {
            loc: {
                start: getCursor(context)
            },
            type: 'CDATA',
            source: source
        }
        advanceBy(context, source.length);
        CDATANode.loc.end = getCursor(context)
        return CDATANode
    } else {
        // TODO:
    }
}

function parseDocType(context, ancestors) {
    const findDocEnd = /(\shtml\s?[^<>]*>)/m.exec(context.source);
    if (findDocEnd) {
        const source = context.source.slice(0, findDocEnd.index + findDocEnd[0].length)
        const docNode = {
            loc: {
                start: getCursor(context)
            },
            type: 'DOCTYPE',
            source: source
        }
        advanceBy(context, source.length);
        docNode.loc.end = getCursor(context)
        return docNode
    } else {
        // TODO:
    }
}

function parseComment(context, ancestors) {
    const findCommentEnd = /(-->)/g.exec(context.source);
    if (findCommentEnd) {
        const nodeValue = context.source.slice(0, findCommentEnd.index + findCommentEnd[0].length)
        const commentNode = {
            loc: {
                start: getCursor(context)
            },
            type: 8,
            nodeValue: nodeValue.slice(4, -3),
        }
        advanceBy(context, nodeValue.length);
        commentNode.loc.end = getCursor(context)
        return commentNode
    } else {
        // TODO:
    }
}

function parseElementFilter(content, ancestors, tagName, tagExec) {
    const parent = last(ancestors)
    if (parent) {
        if (parent.tag === "p" && tagName === "div") {
            warnLog3(content, parent, tagExec, tagName)
        }
    }
}

function parseElement(context, ancestors, nodes) {
    const tag = /^<\/?([a-z][^\t\r\n\f />]*)/i.exec(context.source)
    const tagName = tag[1];
    parseElementFilter(context, ancestors, tagName, tag)
    const parent = last(ancestors)
    const node = ancestorsPush(context, ancestors, tagName)
    advanceBy(context, tagName.length + 1);
    const parseAttreResult = parseAttrs(context, ancestors, nodes)
    let endIndex = /(\/?>)/.exec(context.source);
    if (!endIndex) {
        endIndex = context.length
    } else {
        endIndex = endIndex?.index + endIndex[0].length
    }
    let tagContext = context.source.slice(0, endIndex);
    let isSingleLabel = false
    if (tagContext[tagContext.length - 1] === ">") {
        isSingleLabel = tagContext[tagContext.length - 2] === "/"
    }
    tagContext = tagContext.slice(0, isSingleLabel ? -2 : -1)
    advanceBy(context, tagContext.length + (isSingleLabel ? 2 : 1));
    node.loc.start.end = getCursor(context)
    if (isSingleLabel) {
        ancestors.pop()
    } else {
        specialLabelProcessing(context, ancestors)
    }
    if (context.source && !isSingleLabel) {
        node.children = parseChildren(context, ancestors)
    }
    return parseAttreResult ? null : node
}

function specialLabelProcessing(context, ancestors) {
    const node = last(ancestors)
    const s = context.source
    if (node.tag === "style") {
        let match = null
        const matchExec = /(<\/style>)/mg
        while ((match = matchExec.exec(s)) && s) {
            const cs = s.slice(0, match.index)
            let csLength = cs.length - 1
            let flag = true
            while (csLength) {
                if (cs[csLength] === "*" && cs[csLength + 1] === "/") {
                    break
                }
                if (cs[csLength] === "*" && cs[csLength - 1] === "/") {
                    flag = false
                    break
                }
                csLength--
            }
            if (flag) {
                node.nodeValue = cs
                advanceBy(context, cs.length)
                break
            }
        }
    } else if (node.tag === "script") {
        const matchExec = /(<\/script>)/mg
        let match = matchExec.exec(s)
        if (match) {
            const cs = s.slice(0, match.index)
            node.nodeValue = cs;
            advanceBy(context, cs.length)
        }
    }
}

function valideStrIndex0IsS(str) {
    if (!str) {
        return false
    }
    return str[0] === " "
}

const conditionKeys = ['if', "else-if", "else"]

function parseAttrs(context, ancestors, nodes) {
    const currentNode = last(ancestors)
    const [source, attrs, flag] = parseAttrs$(context, currentNode, nodes)
    currentNode.props.source = source
    currentNode.props.attrs = attrs
    return flag
}

function isTagStartEndLabel(context) {
    let len = 0
    while (len < context.source.length) {
        const current = context.source[len]
        if (current !== " ") {
            return (current === "/" || current === ">")
        }
        len++
    }
}

function parseAttrs$(context, node, nodes) {
    let attrs = []
    const offset = context.offset
    let isConditionNode = false
    while (!isTagStartEndLabel(context) && context.source) {
        const s = context.source
        let index = s.indexOf("="), index2 = /(\/?>)/ms.exec(s), index3 = s.indexOf(" ");
        let match = null
        let endIndex = index
        const flag = index3 === 0 || (index3 > -1 && index3 < index && index2.index > index3) || (index2 && index3 > -1 && index === -1 && index3 < index2.index);
        const flag2 = !flag && (index2 && index > index2.index)
        const flag3 = flag && (index3 > -1 && index3 < index2.index);
        if (s[index3] === " " && (flag || (flag2 && flag3))) {
            const index3exex = /[^\t\r\n\f\s]+/.exec(s)
            if (index3exex && index3exex.index < index3) {
                index3 = index3exex.index + index3exex[0].length
            }
        }
        if (flag) {
            match = s.slice(0, index3)
            endIndex = index3
            if (!/[^\t\r\n\f\s]+/.test(match)) {
                const sexec = /[^\t\r\n\f\s]/.exec(s)
                if (sexec) {
                    endIndex = sexec.index || endIndex
                }
                advanceBy(context, endIndex)
                continue
            }
        } else if (flag2) {
            if (flag3) {
                endIndex = index3
            } else {
                endIndex = index2.index
            }
            match = s.slice(0, endIndex)
        } else {
            const symbol = s[index + 1]
            if (isSpecialSymbols(symbol)) {
                endIndex = s.indexOf(symbol, index + 2) + 1
            } else {
                endIndex = /([\s\/\>]{1})/ms.exec(s)?.index || s.length;
            }
            match = s.slice(0, endIndex)
        }
        const currentAttr = useParseAttr(context, match, attrs, node, nodes)
        if (typeof currentAttr === "object" && currentAttr !== null) {
            attrs.push(currentAttr)
        } else if (currentAttr === 1) {
            isConditionNode = true
        }
        if (s[endIndex] === " ") {
            advanceBy(context, 1)
        }
        // break
    }
    return [context.originalSource.slice(offset, context.offset), attrs, isConditionNode]
}

function isSpecialSymbols(v) {
    return v === "'" || v === '"' || v === "`"
}

function useParseAttr(context, value, attrs, node, nodes) {
    let splitIndex = value.indexOf("=");
    if (splitIndex === -1) {
        splitIndex = value.length
    }
    const nodeName = value.slice(0, splitIndex)
    let nodeValue = value.slice(splitIndex + 1)
    if (nodeValue) {
        if (isSpecialSymbols(nodeValue[0])) {
            nodeValue = nodeValue.slice(1, -1)
        }
    }
    const attr = {
        nodeName, nodeValue, type: 2,
        source: value,
        loc: { start: getCursor(context) }
    }
    advanceBy(context, value.length)
    attr.loc.end = getCursor(context)
    const flag1 = conditionKeys.indexOf(nodeName) !== -1
    const prevAttr = attrs.find((i) => flag1 ? conditionKeys.indexOf(i.nodeName) !== -1 : i.nodeName === nodeName)
    if (prevAttr) {
        attrWarnLog(context, attr, prevAttr, nodeName, node)
    }
    if (flag1) {
        let flag = true
        node.conditionValue = attr
        if (nodeName === conditionKeys[0]) {
            node.condition = [node]
            return null
        } else {
            let index = nodes.length - 1;
            while (index >= 0) {
                const prevNode = nodes[index]
                if (!prevNode.conditionValue || (prevNode.conditionValue.nodeName !== conditionKeys[1] && prevNode.conditionValue.nodeName !== conditionKeys[0])) {
                    attrWarnLog2(context, attr, prevAttr, nodeName, node)
                    flag = false
                    break
                }
                if (prevNode.conditionValue.nodeName === conditionKeys[0]) {
                    prevNode.condition.push(node)
                    break
                }
                index--
            }
        }
        if (flag) {
            return 1
        }
    } else if (nodeName === "for") {
        if (parseNodeAttrFor(nodeValue, node)) return null
    }
    return attr
}

function parseNodeAttrFor(nodeValue, node) {
    const ctxContent = /^(.+)\s(in|of)\s(.+)$/.exec(nodeValue);
    if (ctxContent) {
        node.forCtx = {
            label: ctxContent[2],
            variable: ctxContent[1],
            content: last(ctxContent)
        }
        return true
    }
}

function parseText(context, ancestors) {
    const s = context.source;
    const endTokens = ["\u003c"];
    let endIndex = context.source.length;
    for (let i = 0; i < endTokens.length; i++) {
        const index = context.source.indexOf(endTokens[i], 1);
        if (index !== -1 && endIndex > index) {
            endIndex = index;
        }
    }
    const locStart = getCursor(context)
    const textContent = parseTextData(context, endIndex);
    return {
        loc: getSelection(context, locStart, getCursor(context)),
        type: 3,
        nodeValue: textContent,
    };
}

function parseTextData(
    context,
    length,
) {
    const rawText = context.source.slice(0, length);
    advanceBy(context, length);
    if (
        rawText.indexOf("&") === -1
    ) {
        return rawText;
    } else {
        // DATA or RCDATA containing "&"". Entity decoding required.
        return decodeEntities(rawText);
    }
}


function generateElement(options = {}) {
    return extend({
        loc: {},
        type: 1,
        props: {

        },
        children: []
    }, options)
}

function ancestorsPush(context, ancestors, tagName) {
    return ancestors[ancestors.push(generateElement({
        tag: tagName,
        loc: {
            start: {
                start: getCursor(context),
                end: null
            },
            end: {

            }
        }
    })) - 1]
}

export function transform$(baseNodes, fn) {
    const nodes = transFormArray(baseNodes)
    const cNodes = []

    for (let i = 0; i < nodes.length; i++) {
        const node = fn(nodes[i])
        if (nodes[i].children && nodes[i].children.length) {
            if (nodes[i].tag !== "style" && nodes[i].tag !== "script") {
                node.children = transform$(nodes[i].children, fn)
            }
        }
        cNodes.push(node)
    }
    return cNodes
}

export function transform(baseNodes, transform) {
    if (!transform) return
    return transform$(baseNodes, transform)
}