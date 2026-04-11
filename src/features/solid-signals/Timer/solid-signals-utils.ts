import { Accessor, createEffect, createRoot, untrack } from "@solidjs/signals";
import { useSyncExternalStore } from "react";

/**
 * Custom hook for connecting solid signals to React
 */
export const useSignalValue = <T>(signal: Accessor<T>) => {
  const subscribe = (callback: () => void) => {
    let dispose: () => void = () => {
      console.warn('attempting to disposed before disposer has been assigned');
    };
    
    createRoot((disposer) => {
      dispose = disposer;
      createEffect(() => signal(), () => callback());
    })

    return dispose;
  }

  const peek = () => untrack(() => signal())

  return useSyncExternalStore(
    subscribe,
    peek,
  );
};
