import { createTimerModel } from "../../models/timer-model";

/**
 * This file contains the interface of the
 * dependencies for the unit, in addition
 * to the defaults for those dependencies
 */

export type TimerViewModelDependencies = {
  createTimerModel: typeof createTimerModel;
};

const defaultDependencies: TimerViewModelDependencies = {
  createTimerModel,
};

export default defaultDependencies;
