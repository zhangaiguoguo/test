const toStringCall = Object.prototype.toString

export function toRawType(target) {
  return toStringCall.call(target).slice(8, -1)
}

export function isFunction(target) {
  return typeof target === 'function'
}

export function keys(target) {
  return Object.keys(target)
}

export function isArray(target) {
  return Array.isArray(target)
}

export function isString(target) {
  return typeof target === 'string'
}

export function isObject(target) {
  return toRawType(target) === 'Object'
}

export function transformArray(target) {
  return isArray(target) ? target : [target]
}

export function has(target, key) {
  if (typeof target !== "object" || target === null) {
    return false
  }
  return key in target || target.hasOwnProperty(key)
}

export function indexOf(target, key) {
  return target.indexOf(key) > -1
}



function getSequence(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  console.time("sequenceCount");
  let result = [];
  let maxLen = 0;
  let curResult = null;
  const _ = (i) => {
    if (maxLen < result[i].length) {
      maxLen = result[i].length;
      curResult = result[i];
    }
  };
  for (let i = 0; i < arr.length; i++) {
    if (result.length) {
      let cur = null;
      let li = result.length;
      while ((li--) > 0) {
        if (result[li].at(-1) < arr[i] && (cur ? result[li].length > cur.length : true)) {
          cur = result[li];
        }
        _(li);
      }
      if (cur) {
        cur.push(arr[i]);
      } else {
        cur = result.at(-1).slice(0, -1);
        for (let h = cur.length - 1; h >= 0; h--) {
          if (cur[h] < arr[i]) {
            break;
          } else {
            cur.splice(h, 1);
          }
        }
        cur.push(arr[i]);
        result.push(cur);
        _(result.length - 1);
      }
    } else {
      result.push([arr[i]]);
    }
  }
  console.timeEnd("sequenceCount");
  return curResult;
}

// console.log(getSequence([1, 3, 2, 2, 4, 5, 6, 7, 8, 2]));



export function sort(arr) {
  if (arr.length === 1) {
    return arr;
  }
  let minIndex = null;
  for (let i = 0; i < arr.length; i++) {
    if (i) {
      if (arr[i - 1] > arr[i]) {
        let index =
          minIndex !== null && arr[minIndex] >= arr[i] ? minIndex : i - 1;
        while (
          index >=
          (minIndex !== null && arr[minIndex] <= arr[i] ? minIndex : 0)
        ) {
          if (arr[index] <= arr[i]) {
            minIndex = index;
            const cv = arr[i];
            arr.splice(i, 1);
            arr.splice(index + 1, 0, cv);
            break;
          }
          index--;
        }
        if (index === -1) {
          const cv = arr[i];
          arr.splice(i, 1);
          arr.splice(0, 0, cv);
          minIndex = 0
        }
        continue;
      }
    }
  }
  return arr;
}
// console.log(
//   sort([
//     100, 68, 50, 54, 1, 3, 4, 2, 1, 43, 100, 3, 4, 2, 1, 23, 4, 4, 5, 6, 78,
//     8,
//   ])
// );