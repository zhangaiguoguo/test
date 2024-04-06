export function getCursor(context) {
    const { column, line, offset } = context;
    return { column, line, offset };
}

export function getSelection(
    context,
    start,
    end,
) {
    end = end || getCursor(context);
    return {
        start,
        end,
        source: context.originalSource.slice(start.offset, end.offset),
    };
}

export function getSelectionLine(content) {

}

export function last(list) {
    return list[list.length - 1];
}

const decodeRE = /&(gt|lt|amp|apos|quot);/g;
const decodeMap = {
    gt: ">",
    lt: "<",
    amp: "&",
    apos: "'",
    quot: "\"",
};

export function decodeEntities(rawText) {
    return rawText.replace(decodeRE, (_, p1) => decodeMap[p1]);
}

export function startsWithEndTagOpen(source, tag) {
    return (
        startsWith(source, "</") &&
        source.substr(2, tag.length).toLowerCase() === tag.toLowerCase() &&
        /[\t\r\n\f />]/.test(source[2 + tag.length] || ">")
    );
}

export function startsWith(source, searchString) {
    return source.startsWith(searchString);
}

export function isEnd(context, ancestors) {
    const s = context.source;
    switch (1) {
        case 1:
            if (startsWith(s, "</")) {
                for (let i = ancestors.length - 1; i >= 0; i--) {
                    if (startsWithEndTagOpen(s, ancestors[i].tag)) {
                        return true;
                    }
                }
            }
            break;
    }
}

export function isEndTag(str) {
    return startsWith(str, "</") && /(<\/)[^\t\r\n\f]*(>)/.exec(str)
}

export function transFormArray(target) {
    return Array.isArray(target) ? target : [target]
}

export const extend = Object.assign

export function slice(str, ...args) {
    if (!str) {
        return ""
    }
    return str.slice(...args)
}

export function sliceMerge(str, startIndex, endIndex) {
    if (!str) {
        return ""
    }
    return str.slice(0, startIndex) + str.slice(endIndex)
}


export function parseTag(context) {
    const ec = /\/?>/mg;
    let currentStr;
    let prevA;
    let a;
    let template = context.source
    const results = []
    while ((a = ec.exec(template))) {
        // console.log(a);
        const s = template.slice(0, a.index + a[0].length)
        // console.log(s);
        let index = s.length - 1;
        const result = []
        let line = 1
        let offset = s.length
        while (index) {
            if (s[index] === "\n") {
                line++;
            }
            if (s[index] === '"' || s[index] === "'" || s[index] === '`') {
                if (s[index - 1] === "=") {
                    if (result.length === 0) {
                        result.push(null)
                        break
                    }
                    let len = result.length - 1
                    let flag = false
                    while (len >= 0) {
                        if (result[len].value === s[index] && !result[len].isUse) {
                            flag = true
                            result[len].isUse = true
                            const cOffset = result[len].offset
                            for (let r = 0; r < result.length; r++) {
                                if (result[r].offset > offset && result[r].offset < cOffset) {
                                    result.splice(r, 1);
                                    r--
                                    continue
                                }
                            }
                            break
                        }
                        len--;
                    }
                    if (!flag) {
                        result.splice(0, result.length, null)
                        break
                    }
                } else {
                    result.push({
                        value: s[index],
                        offset: offset + context.offset,
                        line: line + context.line,
                        isUse: false
                    })
                }
            }
            offset--
            index--
        }
        // console.log(result, result.filter((i) => i?.isUse).length);
        prevA = a;
        results.push(result);
        if (result[0] !== null && result.filter((i) => !i?.isUse).length === 0) {
            currentStr = s
            break
        }
    }
    return [currentStr, prevA, results]
}


export function reverseOrderLoopFindTarget(str, target, targetNum = 1) {
    let index = str.length - 1;
    while (index && targetNum) {
        if (str[index] === target) {
            targetNum--
        }
        index--
    }
    return index
}

export const TIPWARNNLINE = 10

export function attrWarnLog(context, current, preCurrent, value, node) {
    const os = context.originalSource
    const a = os.slice(0, current.loc.end.offset)
    const subIndex = [getStrLastN(a, a.length - 1, 0)]
    const subValue = [a.slice(subIndex[0])]
    const endTipString = subValue[0] + '\n| ' + tipIconRepeat(current.loc.start.column - 1)
    const error = new SyntaxError(`<${node.tag}> tag attribute (${value.trim()}) already exists\n\t (at ${current.loc.start.line}:${current.loc.start.column})\n ` + a.slice(0, subIndex[0]) + endTipString)
    jsConsole.warn(error)
}

export function attrWarnLog2(context, current, preCurrent, value, node) {
    const os = context.originalSource
    const a = os.slice(0, current.loc.end.offset)
    const subIndex = [getStrLastN(a, a.length - 1, 0)]
    const subValue = [a.slice(subIndex[0])]
    const endTipString = subValue[0] + '\n| ' + tipIconRepeat(current.loc.start.column - 1)
    const error = new SyntaxError(`<${node.tag}> tag attribute (${value.trim()}) is invalid because it does not have (if)\n\t (at ${current.loc.start.line}:${current.loc.start.column})\n ` + a.slice(0, subIndex[0]) + endTipString)
    jsConsole.warn(error)
}

export function warnLog(context) {
    const s = context.source
    const os = context.originalSource;
    const tips = os.slice(0, context.offset + s.length)
    let nl = 0
    let si = os.length - 1
    let lastNl = 0
    while (si && nl < TIPWARNNLINE) {
        if (os[si] === "\n") {
            if (nl === 0) {
                lastNl = getStrlen(tips.slice(si - 1))
            }
            nl++
        }
        si--
    }
    const syntaxError = new SyntaxError("Unexpected EOF in tag (<) -> (&lt;)\n| " + tips.slice(si).replace(/[\n]+/g, "\n|\t") + "\n  " + ('^').repeat(lastNl))
    jsConsole.warn(syntaxError)
}

export function warnLog2(context, loc, node) {
    const os = context.originalSource
    const cTag = os.slice(loc.start.offset, loc.end.offset);
    const value = os.slice(node.loc.start.end.offset, loc.end.offset);
    const startTip = os.slice(node.loc.start.start.offset, node.loc.start.end.offset)
    const endTip = value.slice(getStrLastN(value, loc.end.offset, 0) + 2)
    const result = [startTip + "\n" + ('^'.repeat(getStrlen(startTip))), endTip + "\n" + tipIconRepeat(context.column - 1)]
    const error = new SyntaxError("Invalid end tag \n| " + (result[0] + value.slice(0, value.length - endTip.length) + result[1]).replace(/[\n]+/g, "\n| "))
    jsConsole.warn(error)
}

export function warnNotStartTag(context, curNode) {
    const column = curNode[0].length + curNode.index
    const os = context.originalSource
    const sos = os.slice(getStrLastN(os, context.offset, 0), context.offset + column)
    const v = os.slice(getStrLastN(os, os.length - 1, TIPWARNNLINE), context.offset)
    jsConsole.warn(new SyntaxError("Invalid end tag \n| " + v.replace(/[\n]+/g, "\n| ") + curNode[0] + "\n" + ("^").repeat(getStrlen(sos))))
}

export function getStrLastN(str, startIndex = str.length - 1, lineNum = 2) {
    while (startIndex && lineNum >= 0) {
        if (str[startIndex] === "\n") {
            lineNum--
        }
        startIndex--
    }
    return startIndex
}

export function warnNotEndTag(context, node) {
    const os = context.originalSource
    const { start, end } = node.loc
    const tipValue = os.slice(start.start.offset - start.start.column)
    const index = parseStrNextN(tipValue, 0, 1)
    jsConsole.warn(new SyntaxError("Element is missing end tag.\n " + strNtransfromN2(tipValue.slice(0, index) + tipIconRepeat(start.start.column + node.tag.length) + "\n" + tipValue.slice(index))))
}

export function parseStrNextN(str, startIndex, lineNum = 2) {
    while (startIndex < str.length && lineNum >= 0) {
        if (str[startIndex] === "\n") {
            lineNum--
        }
        startIndex++
    }
    return startIndex
}

export function getStrlen(str) {
    var len = 0;
    stringSubCodeIndex(str, (v) => {
        len += v
    })
    return len
}

function stringSubCodeIndex(str, callback) {
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        //单字节加1 
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            callback(1)
        }
        else {
            callback(2)
        }
    }
}

export function warnLog3(context, parent, exec, tagName) {
    const os = context.originalSource;
    const currentLoc = getCursor(context)
    const startValue = os.slice(0, currentLoc.offset)
    const nIndex = getStrLastN(startValue, startValue.length - 1, 6)
    const { start, end } = parent.loc
    const startValue2 = os.slice(start.end.offset, currentLoc.offset + exec[0].length)
    jsConsole.warn(new SyntaxError(`End tag mismatch (${parent.tag} > ${tagName}) \n| ` + strNtransfromN2(startValue.slice(nIndex, start.end.offset) + "\n" + tipIconRepeat(start.end.column - 1)) + strNtransfromN2(startValue2 + "\n " + tipIconRepeat(currentLoc.column - 2 + exec[0].length))))
}

function tipIconRepeat(num) {
    return '^'.repeat(num)
}

function strNtransfromN2(str) {
    return str.replace(/[\n]+/g, "\n| ")
}

export const jsConsole = {
    warn(...args) {
        console.warn('[warn]', ...args)
    }
}

export function getCurrentTime() {
    if (!Date.now) {
        Date.now = () => (new Date()).getTime()
    }
    return Date.now()
}