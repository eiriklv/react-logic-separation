import { Signal } from "@preact/signals-core";
import { useSyncExternalStore } from "react";

/**
 * Custom hook for connecting signals to React
 */
export const useSignalValue = <T>(signal: Signal<T>) => {
  return useSyncExternalStore(
    signal.subscribe.bind(signal),
    signal.peek.bind(signal),
  );
};
