import { isObject } from "@haru-vue/shared";
import { activeFn } from "./effect";

export const enum ReactiveFlags {
  SKIP = "__v_skip",
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
  IS_SHALLOW = "__v_isShallow",
  RAW = "__v_raw",
}
export const reactiveMap = new WeakMap();
export function reactive(target) {
  if (!isObject(target)) {
    return;
  }
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target;
  }
  const existingProxy = reactiveMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const proxy = new Proxy(target, {
    get: function (target, key, receiver) {
      const res = Reflect.get(target, key, receiver);
      console.log( `active` activeFn);
      console.log(`获取${key as string}的值是${target[key]}`);
      return res;
    },
    set: function (target, key, value, receiver) {
      console.log(`设置${key as string}的值是${value}`);
      return Reflect.set(target, key, value, receiver);
    },
  });
  reactiveMap.set(target, proxy);
  return proxy;
}
