const ELEMENT_NODE = 1
const TEXT_NODE = 2
const COMMENT_NODE = 3
const FRAGMENT_NODE = 4
const COMPONENT_NODE = 5
const KEY = "key"
const ELEMENT_TYPE_KEY = "elementType"
const SHAPEFLAG_KEY = "shapeFlag"
const __is_v_node = "__is_v_node"
const extend = Object.assign;

const toStringCall = Object.prototype.toString

export function isFragment(node) {
    return getNodeShapeFlag(node) === FRAGMENT_NODE
}

export function getNodeShapeFlag(node) {
    return node && node[SHAPEFLAG_KEY]
}

export function toRawType(target) {
    return toStringCall.call(target).slice(8, -1)
}

export function isObject(target) {
    return toRawType(target) === "Object"
}

export function isVnode(node) {
    return node && node[__is_v_node] === true
}

export function isobject(target) {
    return typeof target === "object" && target !== null
}

const isArray = Array.isArray

export function isFunction(target) {
    return typeof target === 'function'
}

export function transformArray(target) {
    const _target = isFunction(target) ? target : () => target
    return isArray(target) ? target : [_target()]
}

export function has(target, key) {
    return target && (key in target || target.hasOwnProperty(key))
}

export default function isNumber(target){
    return typeof target === 'number'
}

export function parseNodeShapeFlag(type) {
    if (isobject(type)) {
        return COMPONENT_NODE
    }
    if (/[^a-z-]/ig.test(type)) {
        return TEXT_NODE
    }
    return ELEMENT_NODE
}

export {
    ELEMENT_NODE, TEXT_NODE, COMMENT_NODE, FRAGMENT_NODE, KEY, ELEMENT_TYPE_KEY, SHAPEFLAG_KEY, extend, __is_v_node, isArray
};


