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
          while (len >= 0) {
            if (result[len].value === s[index]) {
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
        } else {
          result.push({
            value: s[index],
            offset: offset,
            line,
            isUse: false
          })
        }
      }
      offset--
      index--
    }
    prevA = a;
    if (result.filter((i) => !i.isUse).length === 0) {
      currentStr = s
      break
    }
    results.push(result);
  }
  return [currentStr, prevA, results]
}

const template = `
      <div a="'<di'''v<'/>></div>'${"``"}" a="111'nihao'我不好">
        <div>
        <div class="11">
          <p>p</p>  
        </div>
        你好
      <div/>
    `;
// console.log(parseTag(template));