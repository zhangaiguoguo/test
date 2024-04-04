import { baseParse } from '../baseParse.js'
import { isFunction, keys } from './utils.js';
var NODE =
  typeof Node === "function"
    ? Node
    : {
      TEXT_NODE: 3,
      ELEMENT_NODE: 1,
      COMMENT_NODE: 8,
    };

function _s(...args) {
  return JSON.stringify(...args);
}

const transformOptions = {
  TEXTREF: ["{{", "}}"],
  EVENTREF: "@",
};

function patchTextContent(nodeValue) {
  var startr = transformOptions.TEXTREF[0],
    endr = transformOptions.TEXTREF[1];
  if (!(nodeValue.indexOf(startr) > -1 && nodeValue.indexOf(endr) > -1)) {
    return `"${nodeValue}"`;
  }
  var content = nodeValue
    .split(new RegExp(`(${startr})|(${endr})`, "g"))
    .filter(Boolean);
  var nContent = `[`;
  var flag = true;
  for (let i = 0; i < content.length; i++) {
    const c = content[i];
    if (
      c !== startr &&
      content[i - 1] === startr &&
      content[i + 1] === endr
    ) {
      nContent = nContent.slice(0, -5);
      nContent += `${c},`;
      flag = false;
      continue;
    }
    if (flag) {
      nContent += `'${c}',`;
    }
    flag = true;
  }
  nContent += "''].join('')";
  return nContent;
}

function patchParseEvent(key, content) {
  var { EVENTREF } = transformOptions;
  const _key = key.slice(EVENTREF.length)
  const ev = /(\(.*?\))/gms.test(content) ? content : `${content}($event)`
  return [_key, ev]
}

function patchParseVnodeAttrs(node) {
  if (node.props && node.props.attrs) {
    var attrs = {};
    var evts = {};
    var { EVENTREF } = transformOptions;
    for (var attr of node.props.attrs) {
      const attrName = attr.nodeName,
        attrValue = attr.nodeValue;
      if (attrName.slice(0, EVENTREF.length) === EVENTREF) {
        let [eventKey, eventFn] = patchParseEvent(attrName, attrValue)
        evts[eventKey] = eventFn
        continue;
      }
      attrs[attrName] = attrValue;
    }
    return { attrs, evts };
  }
}

function patchEventString(evts) {
  let str = "{"
  for (let w in evts) {
    str += (`${w}:($event) => (${evts[w]})`)
  }
  str += "}"
  return str
}

function transformParseVnode(vnode, st = 1) {
  if (!vnode) return vnode;
  var hs = "";
  var sts = "\t".repeat(st);
  for (var i = 0; i < vnode.length; i++) {
    const node = vnode[i];
    hs += "\n" + sts;
    switch (node.type) {
      case NODE.ELEMENT_NODE:
        var { attrs, evts } = patchParseVnodeAttrs(node);
        const evtStr = patchEventString(evts)
        hs += `(function(){
                  const node = createVnode('${node.tag}',${_s(
          attrs
        )}, ${transformParseVnode(node.children, st + 1)})
                  var currentRef = "${st}-${i + 1}"
                  if(${keys(evts).length} > 0){
                    if(evtMps[currentRef]){
                      node.evts = evtMps[currentRef]
                    }else{
                      node.evts = ${evtStr}
                      evtMps[currentRef] = node.evts
                    }
                  }
                  return node
        })(),`;
        break;
      case NODE.TEXT_NODE:
        hs += `createVnodeText(${patchTextContent(node.nodeValue)}),`;
        break;
      case NODE.COMMENT_NODE:
        hs += `createVnodeComment(node.nodeValue),`;
        break;
    }
    if (i < vnode.length - 1) hs += sts;
    else hs += "\n" + sts;
  }
  return `[${hs}]`;
}

function warn(...msg) {
  return console.warn('[warn]', ...msg);
}

function transfrom$$(template) {
  const parseNodes = baseParse(template || "");
  return new Function(
    "vnodeHooks,logHooks",
    `
      var {warn} = logHooks
      var evtMps = {}
      var { createVnode,createVnodeText,createVnodeComment } = vnodeHooks
      return (ctx)=>{
        try{
          with(ctx){
            return (${transformParseVnode(parseNodes, 4)})
          }
        }catch(err){
          warn(new SyntaxError(err.message))
        }
      }

    `
  )(patchvNodeHooks, {
    warn
  });
}

const extend = Object.assign

const patchvNodeHooks = extend({

}, vnodeHooks)

function bind(fn, ctx) {
  return fn.bind(ctx)
}

function initCtxData(options, ctx) {
  const { data, methods, computed, watch } = options;
  const _dataHandle = isFunction(data) ? data : () => data;
  const state = {
    data: reactiveHooks.reactive(_dataHandle.apply(ctx)),
    methods: {},
    computed: reactiveHooks.reactive({}),
    watch: {}
  }
  if (methods) {
    for (let w in methods) {
      state.methods[w] = bind(methods[w], ctx)
    }
  }
  if (computed) {
    for (let w in computed) {
      const c = isFunction(computed[w]) ? {
        get: computed[w]
      } : computed[w];
      c.get = c.get.bind(ctx)
      c.set && (c.set = c.set.bind(ctx))
      state.computed[w] = reactiveHooks.computed(c)
    }
  }
  if (watch) {
    for (let w in watch) {
      state.watch[w] = useWatch(w, watch[w], ctx)
    }
  }
  return state
}

function useWatch(sorcur, options, ctx) {
  const _options = isFunction(options) ? { handler: options } : options
  return () => {
    let stop = null
    ctx.scopes.run(() => {
      stop = reactiveHooks.watch(new Function('ctx', `return ()=>{
        with (ctx){
          return ${sorcur}
        }
      }`)(ctx), _options.handler.bind(ctx), _options)
    })
    return stop
  }
}

function runWatch(watchs) {
  if (!watchs) return
  for (let k in watchs) {
    watchs[k] = watchs[k]()
  }
}

function setCtxState(ctx) {
  const state = initCtxData(ctx.options, ctx)
  ctx.state = state
  for (let k in state) {
    if (k === "data" || k === "computed") {
      for (let i in state[k]) {
        Object.defineProperty(ctx, i, {
          get() {
            return state[k][i]
          },
          set(v) {
            state[k][i] = v
          }
        })
      }
    }
    if (k === "methods") {
      for (let i in state[k]) {
        ctx[i] = state[k][i]
      }
    }
  }
  runWatch(state.watch)
}

function createCtx(options, hooks) {
  const ctx = new Proxy(extend({
    options: options,
    scopes: new reactiveHooks.EffectScope()
  }, hooks || {}), {
    get(target, key, reactive) {
      return Reflect.get(target, key, reactive)
    },
    defineProperty(target, key, attribute) {
      return Reflect.defineProperty(target, key, attribute)
    }
  })
  setCtxState(ctx)
  return ctx
}

function unMounted(el) {
  if (!el) return
  for (let cEl of [...el.childNodes]) {
    cEl.remove()
  }
}

function useRender(options, ctx) {
  const renderVnodeStructure = transfrom$$(options.template);
  let renderHandle = null
  return [() => {
    if (!renderHandle) {
      renderHandle = vnodeHooks.rendering(ctx.$el)
    }
    if (ctx.diffFiber) ctx.diffFiber.stop()
    ctx.diffFiber = renderHandle(renderVnodeStructure(ctx))
  }]
}

const instances = new WeakMap()

console.log(instances);

export function createApp(options) {
  if (!options) return
  var { el } = options
  let isInitRendering = false
  const ctx = createCtx(options, {
    destroyed() {
      if (ctx.$el) {
        unMounted($el)
        ctx.scopes.stop()
      }
    },
    mount(el) {
      const o$el = ctx.$el
      const n$el = el instanceof HTMLElement ? el : document.querySelector(el);
      if (!n$el) {
        return warn(el, "is not a valid element")
      }
      if (o$el !== n$el) {
        unMounted(o$el)
        ctx.$el = n$el
        ctx.updated()
      }
      return this
    },
    updated() {
      if (!renderHandle) {
        warn("Not mounted on real elements")
        return
      }
      if (isInitRendering) {
        return renderHandle()
      }
      isInitRendering = true
      ctx.scopes.run(() => {
        reactiveHooks.watchEffect(() => {
          renderHandle()
        },{
          onTrigger(){
            
          }
        })
      })
    },
  })
  let [renderHandle] = useRender(options, ctx);
  if (el) {
    ctx.mount(el)
  }

  return ctx
}