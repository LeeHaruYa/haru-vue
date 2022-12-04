import { isObject } from "@haru-vue/shared/src";
import { track, trigger } from "./effect";
import { reactive } from './reactive'

export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive'
}

export function isReactive(value) {
    return value && value[ReactiveFlags.IS_REACTIVE]
}

export const baseHandler = {
    get: function (target, key, receiver) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return true
        }
        const res = Reflect.get(target, key, receiver);
        track(target, key); // 收集
        if (isObject(res)) {
            return reactive(res)
        }
        return res;
    },
    set: function (target, key, value, receiver) {
        let oldValue = target[key];
        if (oldValue !== value) {
            const res = Reflect.set(target, key, value, receiver);
            trigger(target, key); // 触发
            return res;
        }
    },
}