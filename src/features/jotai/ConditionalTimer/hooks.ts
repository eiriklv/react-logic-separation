import { useAtomValue } from "jotai";
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

export const useElapsedSeconds = () => {
  return useAtomValue(model.elapsedSeconds);
};

export const useIsOkay = () => {
  return useAtomValue(model.isOkay);
};

export const useIsSafe = () => {
  return useAtomValue(model.isSafe);
};

export const useIsCool = () => {
  return useAtomValue(model.isCool);
};

export const useIsRunning = () => {
  return useAtomValue(model.isRunning);
};

export const useToggleOkay = () => {
  return model.toggleOkay;
};

export const useToggleSafe = () => {
  return model.toggleSafe;
};

export const useToggleCool = () => {
  return model.toggleCool;
};

export const useResetTimer = () => {
  return model.resetTimer;
};
