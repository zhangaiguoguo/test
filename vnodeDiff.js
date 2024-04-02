(function (global, factory) {
  "use strict";
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = typeof global === "object" && global.document ?
      factory(global, true) :
      function (w) {
        return factory(w);
      }(module.exports)
  } else {
    window.vnodeHooks = factory(global);
  }
}(typeof window !== "undefined" ? window : this, function (window, noGlobal) {
  const extend = Object.assign

  const toStringCall = Object.prototype.toString

  function toRawType(target) {
    return toStringCall.call(target).slice(8, -1)
  }

  function hasExist(target, flag = false) {
    return target != null && !!(flag ? target !== "" : ~~1 << 1)
  }

  function has(target, key) {
    return hasExist(target) && (key in target)
  }

  function has2(target, key) {
    return hasExist(target) && target.hasOwnProperty(key);
  }

  function has3(target, key) {
    return hasExist(target) && Reflect.hasOwnProperty(target, key)
  }

  function createSymbol(name, value, flag = false) {
    return [flag ? Symbol.for(name) : Symbol(name), value]
  }

  function createObjArray(obj, key) {
    if (!isArray(obj[key])) {
      obj[key] = []
    }
    return obj[key]
  }

  const def = (obj, key, value) => {
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: false,
      value,
      writable: true
    });
  };

  function synthesisArray(target) {
    return isArray(target) ? target : [target]
  }
  const TEXT_NODE = Node.TEXT_NODE
  const ELEMENT_NODE = Node.ELEMENT_NODE
  const COMMENT_NODE = Node.COMMENT_NODE
  const TEXTREF = createSymbol('text', TEXT_NODE)
  const TEXTREF2 = TEXTREF[0]
  const ELEMENTREF = createSymbol('element', ELEMENT_NODE)
  const ELEMENTREF2 = ELEMENTREF[0]
  const COMMENTREF = createSymbol('comment', COMMENT_NODE)
  const COMMENTREF2 = COMMENTREF[0]
  const ELEMENTTYPE = createSymbol('elementType', null)
  const ELEMENTTYPE2 = ELEMENTTYPE[0]

  function nodeTypeSymbolFind(target, done = false) {
    let flag = 1
    const result = [TEXTREF, ELEMENTREF, COMMENTREF].find((node) => (node[0].description === target && (flag = done ? 1 : 2)) || (node[1] === target && (flag = done ? 2 : 1)))
    return result ? result[flag - 1] : null
  }

  function createvNodeBloak(callback) {
    const _callback = callback || (v => v)
    return _callback({
      type: null,
      el: null,
      content: null,
      [ELEMENTREF3]: null,
      key: null,
      tag: null,
      attrs: null,
      children: null,
      parentNode: null
    })
  }

  function nodeType(node) {

  }

  function createVnodeArg2(target) {
    return toRawType(target) === "Object"
  }

  function createVnode(tag, props, children) {
    if (!tag) return null
    const nodeBloak = [...arguments]
    if (arguments.length === 2) {
      const _args = [{}, props]
      if (createVnodeArg2(props)) {
        _args.splice(0, 2, ...[props, null])
        if (has(props, 'children')) {
          _args[1] = props.children
          delete props.children
        }
      }
      nodeBloak.splice(1, 1, ..._args)
    }
    return createvNodeBloak((bloak) => {
      bloak.tag = nodeBloak[0]
      bloak.attrs = nodeBloak[1]
      bloak.type = ELEMENT_NODE
      bloak[ELEMENTREF3] = nodeTypeSymbolFind(bloak.type)
      bloak.children = nodeBloak[2]
      return bloak
    })
  }

  function createVnodeText(text) {
    return createvNodeBloak((bloak) => {
      bloak.tag = "#text"
      bloak.type = TEXT_NODE
      bloak[ELEMENTREF3] = nodeTypeSymbolFind(bloak.type)
      bloak.content = text
      return bloak
    })
  }

  function createVnodeComment(text) {
    return createvNodeBloak((bloak) => {
      bloak.tag = "#comment"
      bloak.type = COMMENT_NODE
      bloak[ELEMENTREF3] = nodeTypeSymbolFind(bloak.type)
      bloak.content = text
      return bloak
    })
  }

  function parseNodeTree(el) {
    return parseNodeTree2(el, null)
  }

  function isArray(target) {
    return Array.isArray(target)
  }

  function nodeTypeHandler(node, hooks, args = []) {
    switch (node.nodeType) {
      case TEXT_NODE:
        hooks.textHook(node, ...args)
        break
      case ELEMENT_NODE:
        hooks.elementHook(node, ...args)
        break
      case COMMENT_NODE:
        hooks.commentHook(node, ...args)
        break
    }
  }

  function parseNodeAttrs(node) {
    let attrs = null
    const _attrs = node.attributes;
    if (_attrs) {
      attrs = {}
      for (let atr of _attrs) {
        attrs[atr.nodeName] = atr.nodeValue
      }
    }
    return attrs
  }

  function parseNodeTree2(node) {
    let currentNode = null
    nodeTypeHandler(node, {
      elementHook() {
        currentNode = createVnode(node.nodeName.toLocaleLowerCase(), parseNodeAttrs(node), [...node.childNodes].map((cNode) => parseNodeTree2(cNode)))
      },
      textHook() {
        currentNode = createVnodeText(node.nodeValue)
      },
      commentHook() {
        currentNode = createVnodeComment(node.nodeValue)
      },
    })
    return currentNode
  }

  function nodeAttrKeySpecialHandler(name) {
    switch (name) {
      case 'className':
        return 'class'
      default:
        return name
    }
  }

  function setNodeAttrs(node, attrs) {
    if (node) {
      for (let atr in attrs) {
        node.setAttribute(nodeAttrKeySpecialHandler(atr), attrs[atr])
      }
    }
  }

  function createRNode(node) {
    let rNode = null
    if (node) {
      const NODETYPE = typeof node === 'string' ? TEXTREF[0] : node[ELEMENTREF3];
      switch (NODETYPE) {
        case ELEMENTREF[0]:
          rNode = document.createElement(node.tag)
          setNodeAttrs(rNode, node.attrs)
          break
        case TEXTREF[0]:
          rNode = document.createTextNode(node.content)
          break
        case COMMENTREF[0]:
          rNode = document.createComment(node.content)
          break
      }
    }
    rNode && def(rNode, '__node__', node)
    return rNode
  }

  function transFormArray(target) {
    return Array.isArray(target) ? target : [target]
  }

  function vNodeCompareDiff(vnode, rnode, diffManager) {
    const vnodes = transFormArray(vnode)
    const rnodes = transFormArray(rnode).filter(Boolean)
    vNodeCompareDiffRun(vnodes, rnodes, diffManager.root, diffManager);
    return rnodes
  }

  const ELEMENTREF3 = 'elementType'

  function getNodeRefType(node) {
    return node[ELEMENTREF3]
  }

  function setNodeValue(node, value) {
    if (node.nodeValue) {
      node.nodeValue = value
    }
  }

  function nodeTypeTEXTCOMMENTValidate(vnode, rnode) {
    if (vnode.content != rnode.content) {
      setNodeValue(rnode.el, vnode.content)
    }
  }

  const _keys = Object.keys

  function keys(target) {
    return _keys(target)
  }

  const INIT_NODE_PERM = () => 0b0000000
  const NODE_ATTR_SET = 0b0000001
  const NODE_ATTR_ADD = 0b0000010
  const NODE_ATTR_DEL = 0b0000100
  const NODE_ATTR_LENGTH = 0b0001000

  const DIFFCHILDRENLENGTH = 0b000001;
  const DIFFCHILDRENTREE = 0b000010;
  const DIFFNODEATTRLENGTH = 0b000100;
  const DIFFNODEATTRS = 0b001000;
  const DIFFNODETAG = 0b0100000;
  const DIFFTAGTYPE = 0b1000000;
  const DIFFNODEKEY = 0b10000000
  const KEY_PERM_KEY = "KEY_PERM";
  const KEY_PERM_N1_PERM = 0b000001;
  const KEY_PERM_N2_PERM = 0b000010;
  const KEY_PERM_N_PERM = 0b0000100;

  function diffKey$(n1, n2) {
    const diffKeyState = this.diffKeyState
    var sub = diffKeyState.find((item) => (item.n1 === n1 && item.n2 === n2) || (item.n1 === n2 && item.n2 === n1));
    if (sub) {
      return sub[KEY_PERM_KEY];
    }
    var KEY_PERM = 0b000000;

    if (!n1 || !n2) return KEY_PERM

    if (n1[KEY] !== null && n1[KEY] !== void 0) {
      KEY_PERM = KEY_PERM | KEY_PERM_N1_PERM;
    }
    if (n2[KEY] !== null && n2[KEY] !== void 0) {
      KEY_PERM = KEY_PERM | KEY_PERM_N2_PERM;
    }

    if (isCurrentScopeExist(KEY_PERM, KEY_PERM_N1_PERM) && isCurrentScopeExist(KEY_PERM, KEY_PERM_N2_PERM) && n1[KEY] === n2[KEY]) {
      KEY_PERM = KEY_PERM | KEY_PERM_N_PERM;
    }
    this.diffKeyState.push({ n1, n2, [KEY_PERM_KEY]: KEY_PERM });
    return KEY_PERM;
  }

  function isCurrentScopeExist(cexits, current) {
    return (cexits & current) === current
  }

  class DirrStore {
    didUseState = []
    useState = []
    diffKeyState = []
    static perms = [0b111111, 0b111101, 0b111111]
    counts = []
    didUseState2 = []
    diff3Status = []
    diff4Status = []
    push2(n1, n2, count, index) {
      this.useState.push({ n1, n2, count, index });
    }
    push(...args) {
      transFormArray(args).flat().forEach((node) => {
        this.didUseState.push(node)
      })
    }
    find(n1, n2) {
      return this.counts.find((ii) => (ii.n1 === n1 && ii.n2 === n2) || (ii.n1 === n2 && ii.n2 === n1))
    }
    diff(n1, n2, perm = DirrStore.perms[2]) {
      let count = 0
      if (!n2) return count
      if ((n1[KEY] !== null && n2[KEY] === null) || (n1[KEY] === null && n2[KEY] !== null)) return count
      const cCount = this.find(n1, n2)
      if (cCount) {
        return cCount.count
      }
      let CURRENT_NODE_PERM = INIT_NODE_PERM()
      var tf1 = getNodeRefType(n1), tf2 = getNodeRefType(n2), tf = tf1 === tf2;
      if ((perm & DIFFTAGTYPE) === DIFFTAGTYPE && tf) {
        count += DIFFTAGTYPE
      } else if (!tf) {
        return count
      }
      if (n1[KEY] !== null && n1[KEY] === n2[KEY]) {
        count += DIFFNODEKEY
      }
      if (tf1 !== ELEMENTREF2) {
        if (n1.content === n2.content) count += DIFFCHILDRENTREE
      }
      if ((perm & DIFFNODETAG) === DIFFNODETAG && n1.tag === n2.tag) {
        count += DIFFNODETAG
      }
      if ((perm & DIFFNODEATTRS) === DIFFNODEATTRS && n2.attrs && n1.attrs) {
        const ks = []
        for (let k in n1.attrs) {
          if ((k) in n2.attrs) {
            count++
          }
          if (n1.attrs[k] === n2.attrs[k]) {
            count++
          } else {
            CURRENT_NODE_PERM = CURRENT_NODE_PERM | NODE_ATTR_SET
          }
          ks.push(k)
        }
        const ks2 = keys(n2.attrs)
        if (((perm & DIFFNODEATTRLENGTH) === DIFFNODEATTRLENGTH) && ks.length === ks2.length) {
          count++
        } else {
          if (ks.length !== ks2.length) {
            CURRENT_NODE_PERM = CURRENT_NODE_PERM | NODE_ATTR_LENGTH
          }
        }
      }
      if (n1.children && n2.children) {
        if ((perm & DIFFCHILDRENLENGTH) === DIFFCHILDRENLENGTH && n1.children.length === n2.children.length) {
          count++
        }
        if ((perm & DIFFCHILDRENTREE) === DIFFCHILDRENTREE) {
          for (let i = 0; i < n1.children.length; i++) {
            count += this.diff(n1.children[i], n2.children[i], DirrStore.perms[1])
          }
        }
      }
      this.counts.push({
        n1, n2, count, CURRENT_NODE_PERM
      })
      return count
    }
    diffKey = diffKey$
    diff2(un) {
      const KEY_PERM = this.diffKey(un.n1, un.n2)
      const KEY_PERM_FLAG = isCurrentScopeExist(KEY_PERM, KEY_PERM_N_PERM)
      for (let i = 0; i < this.didUseState.length; i++) {
        const dn = this.didUseState[i]
        if (dn === un.n2) {
          this.didUseState.splice(i, 1);
          i--
          continue
        }
        if (
          KEY_PERM_FLAG
          ||
          this.didUseState2.some((ii) => ii.n1 === dn && ii.n2 === un && ii.count === un.count)
          ||
          dn === un.n2
          ||
          ((isCurrentScopeExist(KEY_PERM, KEY_PERM_N1_PERM) || dn[KEY] !== null) && un.n1[KEY] !== dn[KEY])
        ) continue
        const cCount = this._diff(un.n1, dn, un.count)
        if (cCount !== false) {
          const n2 = un.n2
          if (n2) {
            this.didUseState[i] = n2
          } else {
            this.didUseState.splice(i, 1)
            i--
          }
          un.count = cCount
          un.n2 = dn
        } else {
          this.didUseState2.push({
            n1: un, n2: dn, count: dn.count
          })
        }
      }
    }
    _diff(n1, n2, _count = 0) {
      const count = this.diff(n1, n2)
      if (count > _count || (count === _count && n1.tag === n2.tag)) {
        return count
      }
      return false
    }
    diff4StatusSome(n1, n2) {
      return this.diff4Status.some((ii) => (ii.n1 === n1 && ii.n2 === n2) || (ii.n1 === n2 && ii.n2 === n1))
    }
    diff3StatusSome(n1, n2) {
      return this.diff3Status.some((ii) => (ii.n1 === n1 && ii.n2 === n2) || (ii.n1 === n2 && ii.n2 === n1))
    }
    diff4(n, usen) {
      const KEY_PERM = this.diffKey(n.n1, n.n2)
      if (isCurrentScopeExist(KEY_PERM, KEY_PERM_N_PERM)) return
      const usens = transFormArray(usen)
      let index = null
      for (let i = this.useState.length - 1; i >= 0; i--) {
        const cn = this.useState[i];
        if (!cn.n2 || cn === n || this.diff4StatusSome(cn, n) || getNodeRefType(cn.n2) !== getNodeRefType(n.n1)) continue
        const CN_KEY_PERM = this.diffKey(cn.n1, cn.n2)
        if (
          isCurrentScopeExist(CN_KEY_PERM, KEY_PERM_N_PERM)
          ||
          (isCurrentScopeExist(KEY_PERM, KEY_PERM_N1_PERM) && !isCurrentScopeExist(CN_KEY_PERM, KEY_PERM_N2_PERM))
          ||
          (isCurrentScopeExist(CN_KEY_PERM, KEY_PERM_N2_PERM) && !isCurrentScopeExist(KEY_PERM, KEY_PERM_N1_PERM))
        ) continue
        if (isCurrentScopeExist(KEY_PERM, KEY_PERM_N1_PERM) && isCurrentScopeExist(CN_KEY_PERM, KEY_PERM_N2_PERM) && n.n1[KEY] !== cn.n2[KEY]) {
          continue
        }
        const count = this.diff(cn.n2, n.n1)
        if (index ? index[1] < count : true && (count > cn.count || (count === cn.count && cn.n2.tag === n.n1.tag))) {
          if (usens.some((nn) => nn === cn)) continue
          index = [i, count]
        }
      }
      if (index !== null) {
        const cn = this.useState[index[0]];
        const cn2 = cn.n2
        cn.n2 = null;
        cn.count = 0
        n.count = index[1]
        n.n2 = cn2
        this.diff4Status.push({
          n1: cn,
          n2: n
        })
        if (cn2) {
          this.diff4(cn, n)
        }
        return true
      } else {
        n.count = 0
        this.diff2(n)
      }
    }
    diff3(n, usens) {
      usens = transFormArray(usens)
      let flag = false
      let index = null
      for (let i = this.useState.length - 1; i >= 0; i--) {
        const cn = this.useState[i];
        if (cn.n2 && cn.n2 === n) {
          flag = true
          continue
        }
        if (this.diff3StatusSome(cn, n)) continue
        const KEY_PERM = this.diffKey(cn.n1, cn.n2)
        if (
          getNodeRefType(cn.n1) !== getNodeRefType(n)
          ||
          isCurrentScopeExist(KEY_PERM, KEY_PERM_N_PERM)
          ||
          (n[KEY] !== null && cn.n1[KEY] === null)
          ||
          (cn.n1[KEY] !== null && n[KEY] === null)
        ) continue
        if (n[KEY] !== null && cn.n1[KEY] !== null && cn.n1[KEY] !== n[KEY]) {
          continue
        }
        const count = this.diff(cn.n1, n)
        if ((index ? index[1] < count : true) && (count > cn.count || (count === cn.count && cn.n1.tag === n.tag))) {
          if (usens.some((nn) => nn === cn)) continue
          index = [i, count]
        }
      }
      if (index !== null) {
        const cn = this.useState[index[0]];
        const cn2 = cn.n2
        cn.n2 = n;
        cn.count = index[1]
        this.diff3Status.push({
          n1: cn,
          n2: n
        })
        if (cn2) {
          this.diff3(cn2, cn)
        }
        return true
      } else if (!flag) {
        this.didUseState.push(n)
      }
    }
    clear() {
      this.useState = []
      this.didUseState = []
      this.didUseState2 = []
      this.counts = []
      this.diffKeyState = []
      this.diff4Status = []
    }
  }

  const diffFiberAsyncRun = (typeof requestAnimationFrame === 'function' ? () => ({
    then(fn) {
      return requestAnimationFrame(fn)
    }
  }) : () => Promise.resolve())

  class DiffFiber {
    root = void 0
    constructor(root) {
      this.root = root
    }
    count = 0

    nodes = []

    tasks = []

    cTasks = null

    status = true

    push(task) {
      this.tasks.push(task)
    }

    clear() {
      this.count++
      this.tasks = []
    }

    remove(task) {
      var sub = this.tasks.indexOf(task)
      if (sub !== -1) {
        this.tasks.splice(sub, 1)
        return true
      }
      return false
    }

    pop() {
      return this.tasks.pop()
    }

    stop() {
      this.status = false
    }

    start() {
      this.status = true
    }

    _runTask() {
      if (!this.tasks.length) return
      var startTime = Date.now()
      const task = this.tasks.at(-1)
      if (task) {
        this.pop()
        if (task.type) {
          this.removeSomeRunDiff(task.type, this.tasks.length - 1)
        }
        task.run()
      }
      const endTime = Date.now() - startTime
      this.runTask(endTime >= 16)
    }

    runTask(isAsync) {
      isAsync = isAsync === void 0 ? false : isAsync
      if (!this.tasks.length) return
      const oldCount = this.count
      if (isAsync) {
        diffFiberAsyncRun().then(() => {
          if (oldCount !== this.count || !this.status) {
            return
          }
          this._runTask()
        })
      } else {
        this._runTask()
      }
    }

    removeSomeRunDiff(type, index) {
      index--
      while (index >= 0 && this.tasks.length) {
        if (this.tasks[index].type === type) {
          this.tasks.splice(index, 1)
        }
        index--
      }
    }

    runDiff2(vnode, isAsync) {
      this.count++
      this.push({
        type: "ROOT",
        run: () => {
          this.nodes = vNodeCompareDiff(vnode, this.nodes, this)
        }
      })
      const startTime = Date.now()
      this.runTask(isAsync)
      console.log("耗时:", Date.now() - startTime);
    }

    runDiff(vnode, isAsync) {
      this.start()
      this.clear()
      this.runDiff2(vnode, isAsync)
    }

  }

  const VNODE_CREATE_CHILDREN = 0b00001

  function vnodeSpecialLabelRun(n) {
    if (n.tag === "script") {
      const textContent = new VNode(n.content);
      textContent.append(n.el)
    } else
      n.el.textContent = n.content
  }

  class VNode {
    constructor(vnode, VNODE_OPERATE_PERM) {
      vnode = typeof vnode === 'string' ? createVnodeText(vnode) : vnode
      this._vnode = vnode
      this.run(VNODE_OPERATE_PERM)
    }
    run(VNODE_OPERATE_PERM) {
      extend(this, createvNodeBloak((vbloak) => {
        return Object.assign(vbloak, this._vnode, { children: null, attrs: extend({}, this._vnode.attrs) })
      }))
      this.el = createRNode(this)
      setNodeAttrs(this.el, this.attrs)
      if ((VNODE_OPERATE_PERM & VNODE_CREATE_CHILDREN) === VNODE_CREATE_CHILDREN) {
        if (isSpecialLabel(this.tag)) {
          vnodeSpecialLabelRun(this)
        }
      }
    }
    append(parentNode) {
      parentNode && parentNode.appendChild(this.el)
    }
    remove() {
      if (!this.el) return
      this.el.remove()
    }
  }

  const VNODE_OPERATE_PERM = 0b00001

  function vNodeCompareDiffRun(vnode, rnode, parent, diffManager) {
    if (!vnode) return rnode
    if (!rnode.length && vnode.length) {
      for (let i = 0; i < vnode.length; i++) {
        if (vnode[i] === null) continue
        const node = new VNode(vnode[i], VNODE_OPERATE_PERM)
        if (parent) {
          node.append(parent)
        }
        rnode.splice(i, 1, node)
        if (!isSpecialLabel(node.tag) && vnode[i].children && vnode[i].children.length) {
          node.children = []
          const children = transFormArray(vnode[i].children)
          vNodeCompareDiffRun(children, node.children, node.el, diffManager)
        }
      }
    } else if (!vnode.length && rnode.length) {
      for (let i = 0; i < rnode.length; i++) {
        rnode[i].remove()
        rnode.splice(i, 1)
        i--
      }
    } else {
      const diffStore = new DirrStore()
      let index = 0;
      if (rnode.length > vnode.length) {
        diffStore.push(rnode.slice(vnode.length).filter(Boolean))
      }
      let keyStartIndex = 0
      const useNodeKeys = []
      const dUseNodeKeys = []
      for (index; index < vnode.length; index++) {
        let n1 = vnode[index];
        let n2 = rnode[index];
        if (n2 && ((n1[KEY] === null && n2[KEY] !== null) || useNodeKeys.some((kn2) => kn2 === n2))) {
          diffStore.diff3(n2)
          n2 = null
        }
        var count;
        if (n1[KEY] !== null && (!n2 || n2[KEY] !== n1[KEY])) {
          const on2 = n2
          n2 = null
          {
            for (let i = 0; i < dUseNodeKeys.length; i++) {
              const node2 = dUseNodeKeys[i];
              if (node2[KEY] === n1[KEY]) {
                n2 = node2
                dUseNodeKeys.splice(i, 1)
                break
              }
            }
          }
          while (keyStartIndex < rnode.length && !n2) {
            const keyN2 = rnode[keyStartIndex]
            if (keyN2[KEY] !== null && keyN2[KEY] === n1[KEY]) {
              n2 = keyN2
              keyStartIndex++
              break
            } else {
              if (keyN2[KEY] !== null) {
                dUseNodeKeys.push(keyN2)
              }
            }
            keyStartIndex++
          }
          if (n1) {
            useNodeKeys.push(n2)
          }
          if (on2 && n2 !== on2) {
            diffStore.diff3(on2)
          }
        }
        if (!n2) {
        } else {
          count = diffStore.diff(n1, n2)
          if (n2 && (n1.tag !== n2.tag || getNodeRefType(n1) !== getNodeRefType(n2))) {
            diffStore.diff3(n2)
            n2 = null
          }
        }
        diffStore.push2(n1, n2, count)
        var ncn = diffStore.useState.at(-1)
        diffStore.diff2(ncn);
        if (!ncn.n2 && !n2) {
          diffStore.diff4(ncn)
        }
      }
      runDiffStore(diffStore, vnode, rnode, parent, diffManager)
    }
    return rnode
  }

  function runDiffStore(diffStore, n1, n2, parent, diffManager) {
    const didUseState = diffStore.didUseState
    for (let i = 0; i < didUseState.length; i++) {
      if (didUseState[i] && didUseState[i].el) {
        removeNode(didUseState[i])
        n2.splice(n2.findIndex((nn) => nn === didUseState[i]), 1)
      }
    }
    const useState = diffStore.useState
    const nodes = []
    for (let ni = useState.length - 1; ni >= 0; ni--) {
      const nin = useState[ni];
      let cn = nin.n2
      let nn1 = nin.n1
      var CURRENT_NODE_PERM = null
      if (getNodeRefType(nn1) === ELEMENTREF2) {
        const sub = diffStore.find(cn, nn1)
        if (sub) {
          CURRENT_NODE_PERM = sub.CURRENT_NODE_PERM
        }
      }
      {
        var nn2 = n2[ni];
        var last = nodes[0]
        if (cn && nn1.tag === "script" && nn1.content !== cn.content) {
          cn.remove()
          cn = null
        }
        if (cn) {
          var ocn = null
          if (nn1.tag !== cn.tag) {
            var cnc = cn.children
            ocn = cn
            cn = new VNode(nn1, VNODE_OPERATE_PERM)
            cn.children = cnc
          }
          if (nn2 !== cn) {
            if (last) {
              insertBefore(cn, last)
            } else if (nn2) {
              insertBefore(cn, nn2)
            } else if (!nn2) {
              if (parent.lastElementChild !== cn.el)
                cn.append(parent)
            }
          } else {
            if (!cn.el.parentNode || !cn.el.parentNode.parentNode) {
              cn.append(parent)
            }
          }
          if (ocn) {
            removeNode(ocn)
          }
        } else {
          cn = new VNode(nn1, VNODE_OPERATE_PERM)
          if (last) {
            insertBefore(cn, last)
          } else {
            cn.append(parent)
          }
        }
        var nodeType = getNodeRefType(cn)
        if (nodeType === TEXTREF2 || nodeType === COMMENTREF2 || isSpecialLabel(cn.tag)) {
          if (cn.content !== nn1.content) {
            if (cn.tag === "script") {
            } else {
              cn.el.textContent = nn1.content
            }
            cn.content = nn1.content
          }
        } else {
          let newChildren = cn.children || [];
          diffManager.push({
            run: () => {
              cn.children = vNodeCompareDiffRun(nn1.children, newChildren, cn.el, diffManager)
            }
          })
          diffManager.runTask()
        }
      }
      if (!ocn) {
        if (CURRENT_NODE_PERM > 0) {
          setAttribute2(nn1, cn, CURRENT_NODE_PERM)
        }
      }
      cn.el.__node__ = (cn._vnode = nn1)
      cn.key = nn1.key
      nodes.unshift(cn)
    }
    n2.splice(0, n2.length, ...nodes)
    nodes.splice(0, nodes.length)
    diffStore.clear()
  }

  function setAttribute2(n1, n2, CURRENT_NODE_PERM) {
    let attrs = n1.attrs, attrs2 = n2.attrs;
    var el = n1.el || n2.el
    var NODE_ATTR_LENGTH2 = attrs2 && (CURRENT_NODE_PERM & NODE_ATTR_LENGTH) === NODE_ATTR_LENGTH
    var attrs2Ks = keys(attrs2)
    if (attrs) {
      if ((CURRENT_NODE_PERM & NODE_ATTR_SET) === NODE_ATTR_SET || NODE_ATTR_LENGTH2) {
        for (var k in attrs) {
          if (!attrs2 || attrs2[k] !== attrs[k]) {
            attrs2[k] = attrs[k]
            el.setAttribute(k, attrs2[k])
          }
          if (attrs2Ks) {
            var ki = attrs2Ks.indexOf(k)
            if (ki !== -1) {
              attrs2Ks.splice(ki, 1)
            }
          }
        }
      }
    }
    if (attrs2Ks && attrs2Ks.length) {
      for (let k = 0; k < attrs2Ks.length; k++) {
        el.removeAttribute(attrs2Ks[k])
        delete attrs2[attrs2Ks[k]]
      }
    }
  }

  function insertBefore(n1, n2) {
    if (n1 && n2 && n2.el.previousElementSibling !== n1.el) {
      const parentNode = n2.el.parentNode;
      parentNode.insertBefore(n1.el, n2.el)
    }
  }

  function replaceNode(n1, n2) {
    n1.el.parentNode.replaceChild(n2.el, n1.el)
  }

  function removeNode(node) {
    if (node) {
      const el = node.el instanceof Node ? node.el : node;
      el.remove()
    }
  }

  function isSpecialLabel(tag) {
    return tag === "script" || tag === "style"
  }

  const KEY = "key"

  return {
    h: createVnode,
    createVnodeText,
    createVnodeComment,
    parseNodeTree,
    render: (dom, _vnode) => {
      let diffFiber = null
      function render(vnode, isAsync) {
        if (!diffFiber) {
          diffFiber = new DiffFiber(dom)
        }
        diffFiber.runDiff(vnode, isAsync)
        return diffFiber
      }
      _vnode && render(_vnode)
      return render
    },
    transform(node) {
      let attrs$;
      const flag = node.type !== "DOCTYPE" && node.type !== "CDATA"
      if (flag) {
        const attrs = node.props && node.props.attrs;
        var node2 = node.type === ELEMENT_NODE ? createVnode(node.tag, null, isSpecialLabel(node.tag) ? node.nodeValue : null) : node.type === TEXT_NODE ? createVnodeText(node.nodeValue) : createVnodeComment(node.nodeValue);
        const events = {}
        if (attrs) {
          attrs$ = {}
          for (let w in attrs) {
            const attr = attrs[w]
            if (attr.nodeName.startsWith("#")) {
              continue
            }
            if (attr.nodeName.startsWith("@")) {
              events[attr.nodeName.substr(1)] = attr.nodeValue
              continue
            }
            if (KEY === attr.nodeName) {
              node2[KEY] = attr.nodeValue
            } else
              attrs$[attr.nodeName] = attr.nodeValue
          }
          node2.attrs = attrs$
          node2.evts = events
        }
        if (isSpecialLabel(node2.tag)) {
          node2.content = node2.children
          node2.children = null
        }
        return node2
      }
      return createVnodeComment(node.nodeValue)
    }
  }

}))