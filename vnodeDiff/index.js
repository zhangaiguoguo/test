import { COMMENT, COMMENT_NODE, COMPONENT_NODE, ELEMENT_NODE, ELEMENT_TYPE, FRAGMENT_NODE, TEXT, TEXT_NODE, extend, has, isArray, isObject, isVnode, is_v_node_ref, validateVnodeTypeShageFlag } from "./utils.js"

const defaultNode = {
  [is_v_node_ref]: true,
  [ELEMENT_TYPE]: null,
  el: null,
  props: null,
  children: null,
  shageFlag: null,
}

function cloneNode() {
  return extend({}, defaultNode)
}

function createVnode(type, props, children) {
  const l = arguments.length
  if (l === 2) {
    if(isVnode(props)){
      
    }
  } else if (l === 3) {
    if (!isObject(type) && !isArray(children)) {
      children = [children]
    }
  }
  const node = cloneNode()
  node.type = type
  const shageFlag = has(props, 'shageFlag') ? props.shageFlag : validateVnodeTypeShageFlag(type)
  if (shageFlag & TEXT_NODE) {
    console.log("text");
  } else if (shageFlag & COMMENT_NODE) {
    console.log("comment");
  } else if (shageFlag & FRAGMENT_NODE) {
    console.log("fragment");
  } else if (shageFlag & COMPONENT_NODE) {
    console.log("component");
  }
  return node
}

function createVnodeText(nodeValue) {
  const node = cloneNode()
  node.type = nodeValue
  node[ELEMENT_TYPE] = TEXT
  node.shageFlag = TEXT_NODE
  return node
}

function createVnodeComment(nodeValue) {
  const node = cloneNode()
  node.type = nodeValue
  node[ELEMENT_TYPE] = COMMENT
  node.shageFlag = COMMENT_NODE
  return node
}

function createVnodeFragment(fragments) {

}

function createVnodeComponent(type, props, slots) {

}

export {
  createVnode as h, createVnode
}