import { useMemo } from "react";
import { useSignalValue } from "../../../../../lib/use-signal-value";
import defaultDependencies, {
  TimerViewModelDependencies,
} from "./Timer.view-model.dependencies";

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

type Props = {
  dependencies?: TimerViewModelDependencies;
};

export const useTimerViewModel = ({
  dependencies = defaultDependencies,
}: Props = {}) => {
  const { createTimerModel } = dependencies;

  const timerModel = useMemo(() => createTimerModel(), [createTimerModel]);

  return {
    elapsedSeconds: useSignalValue(timerModel.elapsedSeconds),
    isRunning: useSignalValue(timerModel.isRunning),
    startTimer: timerModel.startTimer,
    stopTimer: timerModel.stopTimer,
  };
};
