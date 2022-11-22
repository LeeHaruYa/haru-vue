import { isObject } from "@haru-vue/shared";
import { isReactive, baseHandler } from './baseHandler'

export const reactiveMap = new WeakMap();
export function reactive(target) {
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
  const proxy = new Proxy(target, baseHandler as object);
  reactiveMap.set(target, proxy);
  return proxy;
}
