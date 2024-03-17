function parseTag(template) {
  const ec = /\/?>/mg;
  let currentStr;
  let prevA;
  let a;
  const results = []
  while ((a = ec.exec(template))) {
    const s = template.slice(0, a.index + a[0].length)
    let index = s.length - 1;
    const result = []
    let line = 1
    let offset = 1
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
          result.pop();
        } else {
          result.push({
            value: s[index],
            offset: offset,
            line
          })
        }
      }
      offset++
      index--
    }
    prevA = a;
    if (result.length === 0) {
      currentStr = s
      break
    }
    results.push(result);
  }
  return [currentStr, prevA, results]
}

function validateBH(str) {
  return /[^\s]+=(").*(")/.test(str)
}