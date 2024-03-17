(function (global, factory) {
  "use strict";
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = typeof global === "object" && global.document ?
      factory(global, true) :
      function (w) {
        return factory(w);
      }(module.exports)
  } else {
    window.pinia = factory(global);
  }
}(typeof window !== "undefined" ? window : this, function (window, noGlobal) {

  let reactiveHooks = null
  const stores = {}

  function validateIsInit() {
    if (isInit) {
      return isInit
    }
    console.warn("[error] pinia is not initialized")
  }

  function validateIsInstallReactiveHooks() {
    if (reactiveHooks) {
      return true
    }
    console.warn("[error] Reactive hook function not installed")
  }

  let isInit = false

  function createPinia() {
    isInit = true
    return {
      install() {

      }
    }
  }

  function isFunction() {
    return typeof arguments[0] === "function"
  }

  function transFormFunction() {
    return isFunction(arguments[0]) ? arguments[0] : () => arguments[0]
  }

  function useStore(key) {
    return stores[key]
  }


  function installStore(key, target) {
    validateIsInstallReactiveHooks()
    const targetType = typeof target === 'function' ? 1 : 2

    if (targetType === 1) {

    } else if (targetType === 2) {
      const state = reactiveHooks.reactive(transFormFunction(target.state)())
      console.log(state);
    }
  }

  function defineStore(key, target) {
    if (!validateIsInit()) {
      return
    }
    installStore(key, target)
    return useStore(key)
  }

  // console.log('13271388538'.match(/^([1-9]{3})([1-9]{4})([1-9]{4})$/).slice(1).join("-"));


  function installReactiveHooks(hooks) {
    reactiveHooks = hooks || {};
  }

  return {
    createPinia,
    defineStore,
    installReactiveHooks
  }

}))