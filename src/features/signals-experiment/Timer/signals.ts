import { effect, signal, Signal } from "@preact/signals-core";

export function relay<T>(
  initialState: T,
  setup: (set: (newValue: T) => void, get: () => T) => () => void
): Signal<T> {
  const stateSignal = signal(initialState);
  const get = () => stateSignal.peek();
  const set = (newValue: T) => (stateSignal.value = newValue);
  effect(() => setup(set, get));
  return stateSignal;
}
