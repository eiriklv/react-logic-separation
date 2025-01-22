import { computed, effect, signal, Signal } from "@preact/signals-core";
import * as arrayDiff from "fast-array-diff";

export function mapSignalArray<T, U>(
  currentInput: Signal<T[]>,
  setupFn: (item: T) => U,
  compareFn?: (a: T, b: T) => boolean,
): Signal<U[]> {
  // Make a noop
  const noop: () => U = (() => {}) as () => U;

  // keep reference to previous value of array for diffing
  const previousInput = previous(currentInput, []);

  // store effect disposal function for each of the elements
  const output: Signal<U[]> = signal([]);

  effect(() => {
    // listen to original array for changes
    const outputValue = output.peek();
    const currentInputValue = currentInput.value;
    const previousInputValue = previousInput.peek();

    // get a diff patch of the changes
    const diffPatch = arrayDiff.getPatch(
      previousInputValue,
      currentInputValue,
      compareFn,
    );

    // figure our which of the effect to dispose
    diffPatch
      .filter((patch) => patch.type === "remove")
      .map((patch) => patch.oldPos)
      .map((index) => outputValue[index])
      .forEach((val) => (typeof val === "function" ? val() : noop()));

    // map the diff patch info the correct format
    const mappedDiffPatch = diffPatch.map((patch) => {
      switch (patch.type) {
        case "add":
          return { ...patch, items: patch.items.map((item) => setupFn(item)) };
        case "remove":
          return { ...patch, items: patch.items.map(noop) };
      }
    });

    // apply the patch
    output.value = arrayDiff.applyPatch(outputValue, mappedDiffPatch);
  });

  return output;
}

export function arrayEffect<T>(
  currentInput: Signal<T[]>,
  effectFn: (item: T) => (() => void) | void,
) {
  // keep reference to previous value of array for diffing
  const previousInput = previous(currentInput, []);

  // store effect disposal function for each of the elements
  let disposals: ((() => void) | void)[] = [];

  const disposeEffect = effect(() => {
    // listen to original array for changes
    const currentInputValue = currentInput.value;
    const previousInputValue = previousInput.peek();

    // get a diff patch of the changes
    const diffPatch = arrayDiff.getPatch(previousInputValue, currentInputValue);

    // figure our which of the effect to dispose
    const disposalsToRun = diffPatch
      .filter((patch) => patch.type === "remove")
      .map((patch) => patch.oldPos)
      .map((index) => disposals[index]);

    // dispose the applicable effects
    disposalsToRun.forEach((dispose) => dispose?.());

    // map the diff patch info the correct format
    const mappedDiffPatch = diffPatch.map((patch) => {
      switch (patch.type) {
        case "add":
          return { ...patch, items: patch.items.map((item) => effectFn(item)) };
        case "remove":
          return { ...patch, items: patch.items.map(() => {}) };
      }
    });

    // apply the patch
    disposals = arrayDiff.applyPatch(disposals, mappedDiffPatch);
  });

  return () => {
    disposeEffect();
    disposals.forEach((dispose) => dispose?.());
  };
}

// NOTE: Inspired by https://www.pzuraq.com/blog/on-signal-relays
export function relay<T>(
  initialState: T,
  setup: (set: (newValue: T) => void, get: () => T) => (() => void) | void,
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
    };
  });

  const readOnlyDebouncedSignal = computed(() => debouncedSignal.value);

  return readOnlyDebouncedSignal;
}

export function previous<T>(
  inputSignal: Signal<T>,
  initialValue: T = inputSignal.value,
) {
  const previousSignal = relay(initialValue, (set) => {
    const currentValue = inputSignal.value;

    return () => {
      set(currentValue);
    };
  });

  const readOnlyPreviousSignal = computed(() => previousSignal.value);

  return readOnlyPreviousSignal;
}

export function derived<T>(getPromise: () => Promise<T>) {
  const data = signal<T | undefined>(undefined);
  const isLoading = signal<boolean>(true);
  const error = signal<unknown>(undefined);

  effect(() => {
    let isCancelled = false;

    // Get the promise (this is where we create the dependency on whatever is in the delegate)
    const promise = getPromise();

    promise
      .then((result) => {
        if (isCancelled) {
          return;
        }
        isLoading.value = false;
        error.value = undefined;
        data.value = result;
      })
      .catch((error) => {
        if (isCancelled) {
          return;
        }
        isLoading.value = false;
        error.value = error;
        data.value = undefined;
      });

    return () => {
      isCancelled = true;
      isLoading.value = true;

      // NOTE: Might not want to do this
      error.value = undefined;
      data.value = undefined;
    };
  });

  return { data, isLoading, error };
}

type QueryConfig<T> = {
  queryKey: string[];
  queryFn: () => Promise<T>;
};

/**
 * NOTE: This is fake for now
 * (does not do any caching, but emulates a simple query interface)
 */
export function query<T>(getQueryConfig: () => QueryConfig<T>) {
  const queryConfig = getQueryConfig();
  return derived(() => queryConfig.queryFn());
}

export function resource() {
  // TODO
}

export function reaction() {
  // TODO
}
