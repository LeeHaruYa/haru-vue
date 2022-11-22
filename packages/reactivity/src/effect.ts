export let activeFn = null;

export class ReactiveEffect {
  public active = null;
  public parent = null;
  public deps = [];
  constructor(public fn: Function) {}
  run() {
    this.fn(); // 执行了一次
  }
}

export function effect(fn) {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
}
