import { Accessor, createEffect, createRoot, untrack } from "@solidjs/signals";
import { useMemo, useSyncExternalStore } from "react";

function createSignalSubscriber<T>(
  signal: Accessor<T>,
): (callback: () => void) => () => void {
  return (callback: () => void) => {
    let isInitial = true;

    let dispose: () => void = () => {
      console.warn("attempting to disposed before disposer has been assigned");
    };

    createRoot((disposer) => {
      dispose = disposer;
      createEffect(
        () => signal(),
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

function createSignalPeeker<T>(signal: Accessor<T>) {
  return () => untrack(() => signal());
}

/**
 * Custom hook for connecting solid signals to React
 */
export const useSignalValue = <T>(signal: Accessor<T>) => {
  const subscribe = useMemo(() => createSignalSubscriber(signal), [signal]);
  const peek = useMemo(() => createSignalPeeker(signal), [signal]);

  return useSyncExternalStore(subscribe, peek);
};
