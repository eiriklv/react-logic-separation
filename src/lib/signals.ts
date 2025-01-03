import { computed, effect, signal, Signal } from "@preact/signals-core";

export function relay<T>(
  initialState: T,
  setup: (set: (newValue: T) => void, get: () => T) => (() => void) | void
): Signal<T> {
  const stateSignal = signal(initialState);
  const get = () => stateSignal.peek();
  const set = (newValue: T) => (stateSignal.value = newValue);
  effect(() => setup(set, get));
  return stateSignal;
}

export function debounced<T>(inputSignal: Signal<T>, debounceTimeInMs: number) {
  const debouncedSignal = relay(inputSignal.value, (set) => {
    const valueToDebounce = inputSignal.value;

    const debounceTimeout = setTimeout(() => {
      set(valueToDebounce);
    }, debounceTimeInMs);

    return () => {
      clearTimeout(debounceTimeout);
    }
  });

  const readOnlyDebouncedSignal = computed(() => debouncedSignal.value);

  return readOnlyDebouncedSignal;
}

export function previous<T>(inputSignal: Signal<T>) {
  const previousSignal = relay(inputSignal.value, (set) => {
    const currentValue = inputSignal.value;

    return () => {
      set(currentValue);
    }
  });

  const readOnlyPreviousSignal = computed(() => previousSignal.value);

  return readOnlyPreviousSignal;
}

export function reaction() {
  // TODO
}

export function derived() {
  // TODO
}

export function resource() {
  // TODO
}

export function query() {
  // TODO
}