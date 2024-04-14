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

const NODE = typeof Node ? Node : {
  TEXT_NODE: 3,
  ELEMENT_NODE: 1,
  COMMENT_NODE: 8,
  FRAGMENT_NODE: 21,
}

export const TEXT_NODE = NODE.TEXT_NODE

export const ELEMENT_NODE = NODE.ELEMENT_NODE

export const COMMENT_NODE = NODE.COMMENT_NODE

export const FRAGMENT_NODE = NODE.IFRAGMENT_NODE || 21

function toSymbol(val) {
  return Symbol(val)
}

export const COMMENT = toSymbol("comment")

export const ELEMENT = toSymbol("element")

export const TEXT = toSymbol("text")

export const FRAGMENT = toSymbol("fragment")

export const ELEMENT_TYPE = "elementType"

export function getNodeType(node) {
  return node && node[ELEMENT_TYPE]
}

export const isTextContentNode = (n) => {
  const type = getNodeType
  return type === TEXT || type === COMMENT
}

export function isFragment(target) {
  return getNodeType(target) === FRAGMENT
}

export function isDiffFragmentFlag(n1, n2) {
  const flag = isFragment(n1)
  const flag2 = isFragment(n2)
  return ((flag && !flag2) || (!flag && flag2))
}


export const KEY_PERM_KEY = "KEY_PERM";
export const KEY_PERM_N1_PERM = 0b000001;
export const KEY_PERM_N2_PERM = 0b000010;
export const KEY_PERM_N_PERM = 0b0000100;

export function diffKey$(n1, n2) {
  const diffKeyState = this.diffKeyState;
  var sub = diffKeyState.find(
    (item) =>
      (item.n1 === n1 && item.n2 === n2) || (item.n1 === n2 && item.n2 === n1)
  );
  if (sub) {
    return sub[KEY_PERM_KEY];
  }
  var KEY_PERM = 0b000000;

  if (n1[KEY] !== null && n1[KEY] !== void 0) {
    KEY_PERM = KEY_PERM | KEY_PERM_N1_PERM;
  }

  if (!n2) return KEY_PERM;

  if (n2 && n2[KEY] !== null && n2[KEY] !== void 0) {
    KEY_PERM = KEY_PERM | KEY_PERM_N2_PERM;
  }

  if (
    isCurrentScopeExist(KEY_PERM, KEY_PERM_N1_PERM) &&
    isCurrentScopeExist(KEY_PERM, KEY_PERM_N2_PERM) &&
    n1[KEY] === n2[KEY]
  ) {
    KEY_PERM = KEY_PERM | KEY_PERM_N_PERM;
  }
  this.diffKeyState.push({ n1, n2, [KEY_PERM_KEY]: KEY_PERM });
  return KEY_PERM;
}


export function isSpecialLabel(tag) {
  return tag === "script" || tag === "style";
}

export function isCurrentScopeExist(cexits, current) {
  return (cexits & current) === current;
}

export function isSameNodeType(n1,n2){
  return getNodeType(n1) === getNodeType(n2)
}