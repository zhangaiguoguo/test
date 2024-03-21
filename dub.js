import { getCursor, getSelection, last, decodeEntities, isEnd, startsWith, transFormArray, extend, slice, sliceMerge, parseTag, isEndTag, warnLog, warnLog2, warnNotStartTag, reverseOrderLoopFindTarget, warnLog3, warnNotEndTag } from "./utils.js"
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

export function baseParse(template, options) {
    return parseChildren(createParserContext(template), []);
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
                node = parseElement(context, ancestors)
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
            if (parent) {
                parent.children.push(node)
            } else {
                nodes.push(...transFormArray(node).filter(Boolean))
            }
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
        if (context.source) {
            const pNodes = parseChildren(context, ancestors)
            if (ancestors.length === 0) {
                nodes.push(...pNodes)
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

function parseElement(context, ancestors) {
    const parent = last(ancestors)
    const tag = /^<\/?([a-z][^\t\r\n\f />]*)/i.exec(context.source)
    const tagName = tag[1];
    parseElementFilter(context, ancestors, tagName, tag)
    const node = ancestorsPush(context, ancestors, tagName)
    advanceBy(context, tagName.length + 1);
    const parseTagPo = parseTag(context)
    const endIndex = parseTagPo[1]
    let tagContext = context.source.slice(0, endIndex?.index + endIndex[0].length);
    let isSingleLabel = false
    if (tagContext[tagContext.length - 1] === ">") {
        isSingleLabel = tagContext[tagContext.length - 2] === "/"
    }
    tagContext = tagContext.slice(0, isSingleLabel ? -2 : -1)
    node.props.source = valideStrIndex0IsS(tagContext) ? tagContext.slice(1) : tagContext
    parseAttrs(context, ancestors)
    advanceBy(context, tagContext.length + (isSingleLabel ? 2 : 1));
    node.loc.start.end = getCursor(context)
    if (isSingleLabel) {
        ancestors.pop()
    }
    if (parent) {
        parent.children.push(node);
        return
    }
    return node
}

function valideStrIndex0IsS(str) {
    if (!str) {
        return false
    }
    return str[0] === " "
}


function parseAttrs(context, ancestors) {
    const currentNode = last(ancestors)
    const props = currentNode.props
    ancestors.at(-1).props.attrs = parseAttrs$(context, props.source);
}

function parseAttrs$(context, str) {
    if (str) {
        let attrs = []
        let limitation = 0
        let offset = context.offset
        let line = context.line
        while (str) {
            if (limitation > 100000) break
            let startIndex = str.indexOf(" ")
            let endIndex = startIndex
            startIndex = startIndex === -1 ? 0 : startIndex
            const ec = /(?!(=("|'|`)))=("|'|`)(.*?)("|'|`)\s/ms.exec(str);
            console.log(ec,str);
            if (ec) {
                if (ec.index > startIndex && startIndex) {
                    //TODO
                } else {
                    endIndex = ec.index + ec[0].length
                }
            } else {
                endIndex = str.length
            }
            const attrValue = slice(str, 0, endIndex);
            let splitIndex = attrValue.indexOf("=")
            attrs.push({
                attrKey: splitIndex === -1 ? attrValue : attrValue.slice(0, splitIndex),
                attrValue: splitIndex === -1 ? "" : attrValue.slice(splitIndex + 2, reverseOrderLoopFindTarget(attrValue, attrValue[splitIndex + 1]) + 1),
                source: attrValue,
                loc: {
                    start: {
                        offset: offset,
                        line, column: offset - context.offset
                    },
                }
            })
            for (let w of attrValue) {
                if (w === "\n") {
                    line++
                }
            }
            offset += endIndex
            attrs.at(-1).loc.end = {
                offset: offset,
                line, column: offset - context.offset
            }
            str = slice(str, endIndex).trim()
            limitation++
        }
        return attrs
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
