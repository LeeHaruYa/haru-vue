"use strict";
var VueReactivity = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/reactivity/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    effect: () => effect,
    reactive: () => reactive
  });

  // packages/reactivity/src/effect.ts
  var activeEffect = null;
  var depsMap = /* @__PURE__ */ new WeakMap();
  var ReactiveEffect = class {
    constructor(fn) {
      this.fn = fn;
      this.active = true;
      this.parent = null;
      this.deps = [];
    }
    run() {
      if (!this.active) {
        this.fn();
      } else {
        try {
          this.parent = activeEffect;
          activeEffect = this;
          cleanEffect(this);
          this.fn();
        } finally {
          activeEffect = this.parent;
          this.parent = null;
        }
      }
    }
    stop() {
      if (this.active) {
        this.active = false;
        cleanEffect(this);
      }
    }
  };
  function cleanEffect(reactiveEffect) {
    let deps = reactiveEffect.deps;
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(reactiveEffect);
    }
    reactiveEffect.deps.length = 0;
  }
  function track(target, key) {
    if (activeEffect) {
      let targetMap = depsMap.get(target);
      if (!targetMap) {
        depsMap.set(target, targetMap = /* @__PURE__ */ new Map());
      }
      let deps = targetMap.get(key);
      if (!deps) {
        targetMap.set(key, deps = /* @__PURE__ */ new Set());
      }
      trackEffect(deps);
      deps.add(activeEffect);
    }
  }
  function trigger(target, key) {
    let targetMap = depsMap.get(target);
    if (targetMap) {
      let deps = targetMap.get(key);
      if (deps) {
        triggerEffects(deps);
      }
    }
  }
  function triggerEffects(effects) {
    if (effects) {
      effects = new Set(effects);
      effects.forEach((effect2) => {
        if (effect2 !== activeEffect) {
          effect2.run();
        }
      });
    }
  }
  function trackEffect(deps) {
    if (!activeEffect) {
      return;
    }
    const shouldTrack = !deps.has(activeEffect);
    if (shouldTrack) {
      activeEffect.deps.push(deps);
    }
  }
  function effect(fn, options = {}) {
    const _effect = new ReactiveEffect(fn);
    _effect.run();
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
  }

  // packages/shared/src/index.ts
  function isObject(val) {
    return val !== null && typeof val === "object";
  }

  // packages/reactivity/src/baseHandler.ts
  function isReactive(value) {
    return value && value["__v_isReactive" /* IS_REACTIVE */];
  }
  var baseHandler = {
    get: function(target, key, receiver) {
      if (key === "__v_isReactive" /* IS_REACTIVE */) {
        return true;
      }
      const res = Reflect.get(target, key, receiver);
      track(target, key);
      if (isObject(res)) {
        return reactive(res);
      }
      return res;
    },
    set: function(target, key, value, receiver) {
      let oldValue = target[key];
      if (oldValue !== value) {
        const res = Reflect.set(target, key, value, receiver);
        trigger(target, key);
        return res;
      }
    }
  };

  // packages/reactivity/src/reactive.ts
  var reactiveMap = /* @__PURE__ */ new WeakMap();
  function reactive(target) {
    if (!isObject(target)) {
      return;
    }
    if (isReactive(target)) {
      return target;
    }
    const existingProxy = reactiveMap.get(target);
    if (existingProxy) {
      return existingProxy;
    }
    const proxy = new Proxy(target, baseHandler);
    reactiveMap.set(target, proxy);
    return proxy;
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=reactivity.global.js.map
