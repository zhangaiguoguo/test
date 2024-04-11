import isNumber, { ELEMENT_NODE, SHAPEFLAG_KEY, __is_v_node, has, isObject, isVnode, parseNodeShapeFlag, transformArray } from "./utils.js"

function patchPropsKey(props) {
    if (has(props, 'key')) {
        const key = props.key
        return key
    }
    return null
}

function patchPropsShapeFlag(props) {
    if (has(props, SHAPEFLAG_KEY)) {
        const shapeFlag = props[SHAPEFLAG_KEY]
        delete props[SHAPEFLAG_KEY]
        return shapeFlag
    }
    return null
}

function warn(...args) {
    console.warn(`[warn]`, ...args)
}

function validatePropsKey(key, type) {
    if (isNaN(key) && isNumber(key)) {
        warn(`Identifying the key of node (`, type, `) as `, key, ` can lead to inaccurate calculations`)
    }
}

function createVnode(type, props, children) {
    const l = arguments.length
    if (l === 2) {
        if (isObject(props) && !isVnode(props)) {
            children = null
        } else {
            children = [props]
            props = null
        }
    } else if (l === 1) {
        children = null
        props = null
    }
    if (l === 3 && isObject(children)) {

    } else if (children) {
        children = transformArray(children).map((child) => isVnode(child) ? child : createVnode(child))
    }
    const key = patchPropsKey(props)
    validatePropsKey(key, type)
    const shapeFlag = patchPropsShapeFlag(props) || parseNodeShapeFlag(type)
    return {
        [SHAPEFLAG_KEY]: shapeFlag,
        [__is_v_node]: true,
        type: type,
        children: children,
        props: props,
        key,
        el: null,
        ref: null,
        patchFlag: null
    }
}

function patch(newNode, oldNode, parentNode, root) {

}

function updateRender(node, vnode, root) {

    if (node === null || node.length === 0 && (vnode && vnode.length)) {
        for (let i = 0; i < vnode.length; i++) {
            
        }
    }

    return []
}

export function createRender(root) {

    let node = null
    return (vnode) => {

        node = updateRender(node, vnode, root);
        return node
    }
}

export function h(type, props, children) {
    return createVnode(...arguments)
}