import { Signal } from "@preact/signals-core";
import { useSyncExternalStore } from "react";
import { model } from "./model";

/**
 * Custom hook for connecting signals to React
 */
const useSignalValue = <T>(signal: Signal<T>) => {
  return useSyncExternalStore(
    signal.subscribe.bind(signal),
    signal.peek.bind(signal)
  );
};

/**
 * The main purpose of this file is to
 * bridge the business logic and the React view
 *
 * Access to business logic is facilitated
 * by providing custom hooks with appropriate
 * interfaces - taking care not to expose
 * implementation details of the business
 * logic itself or libraries used
 *
 * It can also be used for 3rd party library hooks,
 * so that you avoid coupling your component directly.
 * Instead you can provide a nice interface and map
 * the custom hooks into it
 */

export const useElapsedSeconds = () => {
  return useSignalValue(model.elapsedSeconds);
};

export const useIsRunning = () => {
  return useSignalValue(model.isRunning);
};

export const useStartTimer = () => {
  return model.startTimer;
};

export const useStopTimer = () => {
  return model.stopTimer;
};
