import { useEffect, useState } from "react";
import { model } from "./model";
import { autorun } from "mobx";

/**
 * Create hook to connect mobx observables to React
 */
export const useObservableValue = <T, U>(model: U, key: keyof U) => {
  const [value, setValue] = useState(model[key]);

  useEffect(() => {
    autorun(() => {
      setValue(model[key]);
    });
  }, [model, key]);

  return value as T;
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
  return useObservableValue<typeof model.elapsedSeconds, typeof model>(
    model,
    "elapsedSeconds",
  );
};

export const useIsOkay = () => {
  return useObservableValue<typeof model.isOkay, typeof model>(model, "isOkay");
};

export const useIsSafe = () => {
  return useObservableValue<typeof model.isSafe, typeof model>(model, "isSafe");
};

export const useIsCool = () => {
  return useObservableValue<typeof model.isCool, typeof model>(model, "isCool");
};

export const useIsRunning = () => {
  return useObservableValue<typeof model.isRunning, typeof model>(
    model,
    "isRunning",
  );
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
