import { getCursor, getSelection, last, decodeEntities, isEnd, startsWith, transFormArray, extend, slice, sliceMerge, parseTag } from "./utils.js"
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
    return baseChildren(createParserContext(template), []);
}



function baseChildren(context, ancestors) {
    const parent = last(ancestors);
    const nodes = [];
    while (!isEnd(context, ancestors)) {
        const s = context.source;
        let node = void 0;
        if (startsWith(s, "<")) {
            if (s.length === 1) {
                break;
            } else if (s[1] === "!") {
                if (startsWith(s, "<!--")) {
                    console.log("comment");
                }
            } else if (s[1] === "/") {

            } else if (/[a-z]/i.test(s[1])) {
                node = parseElement(context, ancestors)
                break;
            }
        }
        if (!node) {
            node = parseText(context, ancestors);
        }
        nodes.push(...transFormArray(node))
    }
    return nodes;
}

function advanceBy(context, num) {
    const sliceValue = context.source.slice(0, num)
    context.source = context.source.slice(num)
    for (let i = 0; i < sliceValue.length; i++) {
        if (i && sliceValue[i] === "\n") {
            context.line++
        }
    }
    context.offset += num
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


function parseElement(context, ancestors) {
    const parent = last(ancestors)
    const tag = /^<\/?([a-z][^\t\r\n\f />]*)/i.exec(context.source)
    const tagName = tag[1];
    const node = ancestorsPush(context, ancestors, tagName)
    advanceBy(context, tagName.length + 1);
    const parseTagPo = parseTag(context)
    const endIndex = parseTagPo[1]
    let tagContext = context.source.slice(0, endIndex?.index + endIndex[0].length);
    let isSingleLabel = false
    while (true && tagContext) {
        let wFlag = false
        if (tagContext[tagContext.length - 1] === ">") {
            isSingleLabel = tagContext[tagContext.length - 2] === "/"
            wFlag = true
        }
        if (!wFlag || isSingleLabel)
            tagContext = tagContext.slice(0, -2)
        if (wFlag) {
            break
        }
    }
    node.props.source = valideStrIndex0IsS(tagContext) ? tagContext.slice(1) : tagContext
    parseAttrs(context, ancestors)
    advanceBy(context, tagContext.length + (isSingleLabel ? 2 : 1));
    node.loc.start.end = getCursor(context)
    if (isSingleLabel) {
        console.log("单标签");
    }
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
    console.log(context);
    console.log(parseAttrs$(context, props.source));
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
            const ec = /(?!(=("|'|`)[^=]\s))=("|'|`)(.*?)("|'|`)\s/ms.exec(str);
            if (ec) {
                if (ec.index > startIndex && startIndex) {
                    //TODO
                } else {
                    endIndex = ec.index + ec[0].length
                }
            } else {
                endIndex = str.length
            }
            attrs.push({
                source: slice(str, 0, endIndex),
                loc: {
                    start: {
                        offset: offset,
                        line
                    },
                }
            })
            for (let w of slice(str, 0, endIndex)) {
                if (w === "\n") {
                    line++
                }
            }
            offset += endIndex
            attrs.at(-1).loc.end = {
                offset: offset,
                line
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
