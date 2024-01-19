import { renderScheduler, isFunction, isObject, $memo, isArray } from "./index"
import { Component } from "react"
const renderMaps = new Map()
let renderMapId = -1;
const componentPT = Component.prototype

function isExtendRC(target) {
    let currentTarget = target
    if (target && target.prototype) {
        // if (target.prototype.__proto__ ===componentPT) {
        //     return !0
        // }
        // return isExtendRC({ prototype: target.prototype.__proto__ })
        while (currentTarget) {
            if(!currentTarget.prototype){
                break
            }
            if (currentTarget.prototype && currentTarget.prototype.__proto__ === componentPT) {
                return !0
            }
            currentTarget = { prototype: currentTarget.prototype.__proto__ }
        }
    }
    return !1
}

export function renderMemo(renderHandler) {
    const id = ++renderMapId
    return renderScheduler(renderHandler, function (currentNode, nodesTree, subsTree) {
        !renderMaps.has(id) && renderMaps.set(id, [])
        if (nodesTree.length && subsTree.length) {
            if (currentNode && isFunction(currentNode.type)) {
                let subNode = currentNode
                const flag = !isExtendRC(subNode.type)
                if (flag) {
                    let sub = renderMaps.get(id).findIndex(i => {
                        return !i.ck.some((ki, ii) => ki !== subsTree[ii]) && i.cs.some((si, ii) => si !== nodesTree[ii])
                    })
                    if (sub === -1) {
                        sub = renderMaps.get(id).push({
                            type: $memo(currentNode.type),
                            os: null, ok: null, cs: null, ck: null,
                            isi: subsTree.at(-1),
                            iss: isArray(nodesTree.at(-2)) ? nodesTree.at(-2).length : nodesTree.at(-2).props.children.length
                        }) - 1
                    }
                    const currentMsg = renderMaps.get(id)[sub]
                    currentMsg.os = currentMsg.cs;
                    currentMsg.ok = currentMsg.ck;
                    currentMsg.ck = subsTree
                    currentMsg.cs = nodesTree
                    currentNode.type = currentMsg.type
                }
            }
        }
        return currentNode
    })
}