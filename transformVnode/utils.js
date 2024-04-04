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