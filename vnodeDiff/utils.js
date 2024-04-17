export const is = Object.is

export const KEY = 'key'

export const extend = Object.assign;


const toStringCall = Object.prototype.toString;

export function toRawType(target) {
  return toStringCall.call(target).slice(8, -1);
}

export function hasExist(target, flag = false) {
  return target != null && !!(flag ? target !== "" : ~~1 << 1);
}

export function has(target, key) {
  return hasExist(target) && key in target;
}

export function has2(target, key) {
  return hasExist(target) && target.hasOwnProperty(key);
}

export function has3(target, key) {
  return hasExist(target) && Reflect.hasOwnProperty(target, key);
}

export function createObjArray(obj, key) {
  if (!isArray(obj[key])) {
    obj[key] = [];
  }
  return obj[key];
}

export const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value,
    writable: true,
  });
};

export function transFormArray(target) {
  return Array.isArray(target) ? target : [target];
}

const NODECOUNT = 1

const NODE = {
  TEXT_NODE: NODECOUNT << 1,
  ELEMENT_NODE: NODECOUNT << 2,
  COMMENT_NODE: NODECOUNT << 3,
  FRAGMENT_NODE: NODECOUNT << 4,
  COMPONENT_NODE: NODECOUNT << 5,
}

export const TEXT_NODE = NODE.TEXT_NODE

export const ELEMENT_NODE = NODE.ELEMENT_NODE

export const COMMENT_NODE = NODE.COMMENT_NODE

export const FRAGMENT_NODE = NODE.IFRAGMENT_NODE || 21

export const COMPONENT_NODE = NODE.COMPONENT_NODE || 42

function toSymbol(val) {
  return Symbol(val)
}

export const COMMENT = toSymbol("comment")

export const ELEMENT = toSymbol("element")

export const TEXT = toSymbol("text")

export const FRAGMENT = toSymbol("fragment")

export const COMPONENT = toSymbol("component")

export const ELEMENT_TYPE = "elementType"

export const is_v_node_ref = "__is_v_node"

export function getNodeType(node) {
  return node && node[ELEMENT_TYPE]
}

export function isFragment(target) {
  return getNodeType(target) === FRAGMENT
}

export function clearArrayValue(target) {
  target.splice(0, target.length)
}

export function isObject(target) {
  return toRawType(target) === "Object"
}

export const isArray = Array.isArray

export function validateVnodeTypeShageFlag(type) {
  if (typeof type === "object" && type) {
    return COMPONENT_NODE
  }
  if (/[^a-z-]/ig.test(type)) {
    return TEXT_NODE
  }
  if (type === null) {
    return FRAGMENT_NODE
  }
  return ELEMENT_NODE
}

export function isVnode(node){
  return node && !!node[is_v_node_ref]
}