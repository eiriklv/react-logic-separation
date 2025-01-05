import { createTypedHooks } from "easy-peasy";
import { ConditionalTimerModel } from "./model";
import { useCallback } from "react";

const { useStoreState, useStoreActions } =
  createTypedHooks<ConditionalTimerModel>();

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

export const useIsOkay = () => {
  return useStoreState((state) => state.isOkay);
};

export const useIsSafe = () => {
  return useStoreState((state) => state.isSafe);
};

export const useIsCool = () => {
  return useStoreState((state) => state.isCool);
};

export const useIsRunning = () => {
  return useStoreState((state) => state.isRunning);
};

export const useToggleOkay = () => {
  const { toggleOkay } = useStoreActions((actions) => actions);
  return useCallback(async () => toggleOkay(), [toggleOkay]);
};

export const useToggleSafe = () => {
  const { toggleSafe } = useStoreActions((actions) => actions);
  return useCallback(async () => toggleSafe(), [toggleSafe]);
};

export const useToggleCool = () => {
  const { toggleCool } = useStoreActions((actions) => actions);
  return useCallback(async () => toggleCool(), [toggleCool]);
};

export const useResetTimer = () => {
  const { resetTimer } = useStoreActions((actions) => actions);
  return useCallback(async () => resetTimer(), [resetTimer]);
};
