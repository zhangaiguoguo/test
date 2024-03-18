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
                for (let i = ancestors.length - 1; i > 0; i--) {
                    if (startsWithEndTagOpen(s, ancestors[i].tag)) {
                        return true;
                    }
                }
            }
            break;
    }
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