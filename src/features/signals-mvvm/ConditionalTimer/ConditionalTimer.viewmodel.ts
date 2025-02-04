import { useSignalValue } from "../../../lib/use-signal-value";
import { conditionalTimerModel } from "./models/conditional-timer-model";

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

export const useConditionalTimerViewModel = () => {
  return {
    elapsedSeconds: useSignalValue(conditionalTimerModel.elapsedSeconds),
    isOkay: useSignalValue(conditionalTimerModel.isOkay),
    isSafe: useSignalValue(conditionalTimerModel.isSafe),
    isCool: useSignalValue(conditionalTimerModel.isCool),
    isRunning: useSignalValue(conditionalTimerModel.isRunning),
    toggleOkay: conditionalTimerModel.toggleOkay,
    toggleSafe: conditionalTimerModel.toggleSafe,
    toggleCool: conditionalTimerModel.toggleCool,
    resetTimer: conditionalTimerModel.resetTimer,
  };
};
