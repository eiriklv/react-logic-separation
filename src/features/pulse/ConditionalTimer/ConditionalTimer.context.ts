import { createContext } from "@cognite/pulse";

import { model as conditionalTimerModel } from "./model";

export interface ConditionalTimerContextInterface {
  conditionalTimerModel: typeof conditionalTimerModel;
}

const defaultValue: ConditionalTimerContextInterface = {
  conditionalTimerModel,
};

export const conditionalTimerContext = createContext(defaultValue);
