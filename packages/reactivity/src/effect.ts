export let activeEffect = null as any; 
export let depsMap = new WeakMap(); // 依赖Map

export class ReactiveEffect {
  public active = true; // 只运行一次
  public parent = null;
  public deps = []; // 依赖 deps
  constructor(public fn: Function, public scheduler?) { }
  run() {
    if (!this.active) {
      return this.fn();
    } else {
      try {
        this.parent = activeEffect
        activeEffect = this;
        cleanEffect(this);
        return this.fn();
      } finally {
        // 取消当前正在运行的effect
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
}

export function cleanEffect(reactiveEffect) {
  let deps = reactiveEffect.deps;
  for (let i = 0; i < deps.length; i++) {
    deps[i].delete(reactiveEffect)
  }
  reactiveEffect.deps.length = 0;
}
export function track(target, key) {
  if (activeEffect) {
    let targetMap = depsMap.get(target)
    if (!targetMap) {
      depsMap.set(target, targetMap = new Map())
    }
    let deps = targetMap.get(key)
    if (!deps) {
      targetMap.set(key, deps = new Set())
    }
    trackEffects(deps)
    deps.add(activeEffect);
  }
}

export function trigger(target, key) {
  let targetMap = depsMap.get(target)
  if (targetMap) {
    let deps = targetMap.get(key)
    if (deps) {
      triggerEffects(deps)
    }
  }
}

export function triggerEffects(effects) {
  if (effects) {
    effects = new Set(effects)
    effects.forEach(effect => {
      if (effect !== activeEffect) { // 保证要执行的effect不是当前的effect
          if(effect.scheduler){
              effect.scheduler(); // 可以提供一个调度函数，用户实现自己的逻辑
          }else{
              effect.run(); // 数据变化了，找到对应的effect 重新执行
          }
      }
  });
  }
}

export function trackEffects(deps) {
  if (!activeEffect) {
    return
  }
  const shouldTrack = !deps.has(activeEffect);
  if (shouldTrack) {
    deps.add(activeEffect);
    activeEffect.deps.push(deps);
  }
}
export function effect(fn, options = {} as any) {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  _effect.run();
  const runner = _effect.run.bind(_effect) as any;
  runner.effect = _effect; // 暴露effect的实例
  return runner// 用户可以手动调用runner重新执行
}
