import {
  createEffect,
  createRoot,
  createMemo,
  createSignal,
  untrack,
} from "@solidjs/signals";
import { useSyncExternalStore } from "react";

export type ReadOnlySignal<T> = {
  get(): T;
  peek(): T;
  subscribe(callback: () => void): () => void;
};

export type Signal<T> = ReadOnlySignal<T> & {
  set(value: T): void;
  set(update: (prev: T) => T): void;
};

function createSignalPeeker<T>(get: ReadOnlySignal<T>["get"]) {
  return () => untrack(() => get());
}

function createSignalSubscriber<T>(
  get: ReadOnlySignal<T>["get"],
): (callback: () => void) => () => void {
  return (callback: () => void) => {
    let isInitial = true;

    let dispose: () => void = () => {
      console.warn(
        "attempting to dispose subscriber before disposer has been assigned",
      );
    };

    createRoot((disposer) => {
      dispose = disposer;
      createEffect(
        () => get(),
        () => {
          /**
           * Effects are always called on creation,
           * but in this case we only want to
           * trigger the callback on changes
           */
          if (isInitial) {
            isInitial = false;
            return;
          }

          callback();
        },
      );
    });

    return dispose;
  };
}

export function signal<T>(initializer: T): Signal<T> {
  const [get, set] = createSignal<T>(() => initializer);
  const peek = createSignalPeeker(get);
  const subscribe = createSignalSubscriber(get);
  const signal: Signal<T> = {
    get,
    set,
    peek,
    subscribe,
  };
  return signal;
}

export function computed<T>(delegate: () => T): ReadOnlySignal<T> {
  const get = createMemo(delegate);
  const peek = createSignalPeeker(get);
  const subscribe = createSignalSubscriber(get);
  const readOnlySignal: ReadOnlySignal<T> = {
    get,
    peek,
    subscribe,
  };
  return readOnlySignal;
}

export function effect<T>(
  dependencies: () => T,
  effectFn: (deps: T) => (() => void) | void,
): () => void {
  let disposeEffect: () => void = () => {
    console.warn(
      "attempting to dispose effect before disposer has been assigned",
    );
  };
  createRoot((disposer) => {
    disposeEffect = disposer;
    createEffect(dependencies, effectFn);
  });
  return disposeEffect;
}

/**
 * Custom hook for connecting solid signals to React
 */
export const useSignalValue = <T>(signal: ReadOnlySignal<T>) => {
  return useSyncExternalStore(signal.subscribe, signal.peek);
};
