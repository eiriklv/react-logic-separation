import { computed, effect, signal, Signal } from "@preact/signals-core";

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

export function query() {
  // TODO
}