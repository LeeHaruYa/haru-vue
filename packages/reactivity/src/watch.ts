
import { isFunction } from "@haru-vue/shared";
import { isReactive } from "./baseHandler";
import { activeEffect, ReactiveEffect, trackEffects, triggerEffects } from "./effect";

// watch (()=> {},(old, value, newValue)=> {})
function traversal(context) {

}
export function watch(context, fn) {
    let getter
    if (isReactive(context)) {
        getter = traversal(context)
    } else if (isFunction(context)) {
        getter = context
    }
    let oldValue
    let cleanup;
    const onCleanup = (fn) => {
        cleanup = fn;
    }
    const setter = () => {
        cleanup &&  cleanup();
        let newValue = effect.run()
        fn(oldValue,newValue, onCleanup)
        oldValue = newValue;
    }

    const effect = new ReactiveEffect(getter, setter)
    // 默认调用run方法会执行get函数，此时source作为了第一次的老值
    oldValue = effect.run(); // 默认执行get方

}