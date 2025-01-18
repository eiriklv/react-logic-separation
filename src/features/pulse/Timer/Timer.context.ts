import { createContext } from "@cognite/pulse";

import { model as timerModel } from "./model";

export interface TimerContextInterface {
  timerModel: typeof timerModel;
}

const defaultValue: TimerContextInterface = {
  timerModel,
};

export const timerContext = createContext(defaultValue);
