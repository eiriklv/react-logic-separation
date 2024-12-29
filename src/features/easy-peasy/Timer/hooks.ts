import { createTypedHooks } from "easy-peasy";
import { TimerModel } from "./model";

const { useStoreState, useStoreActions } = createTypedHooks<TimerModel>();

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
  return useStoreState((state) => state.elapsedSeconds);
};

export const useIsRunning = () => {
  return useStoreState((state) => state.isRunning);
};

export const useStartTimer = () => {
  return useStoreActions((actions) => actions).startTimer;
};

export const useStopTimer = () => {
  return useStoreActions((actions) => actions).stopTimer;
};
