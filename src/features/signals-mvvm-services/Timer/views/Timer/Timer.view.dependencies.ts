import { useTimerViewModel } from "./Timer.view-model";

/**
 * This file contains the interface of the
 * dependencies for the unit, in addition
 * to the defaults for those dependencies
 */

export type TimerDependencies = {
  useTimerViewModel: typeof useTimerViewModel;
};

const defaultDependencies: TimerDependencies = {
  useTimerViewModel,
};

export default defaultDependencies;
