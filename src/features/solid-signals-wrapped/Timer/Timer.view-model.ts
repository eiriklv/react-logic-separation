import { useSignalValue } from "../../../lib/solid-signals-wrapper";
import { model } from "./model";

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

export const useTimerViewModel = () => {
  return {
    elapsedSeconds: useSignalValue(model.elapsedSeconds),
    isRunning: useSignalValue(model.isRunning),
    startTimer: model.startTimer,
    stopTimer: model.stopTimer,
  };
};
