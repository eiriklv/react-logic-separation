import { createContext } from "@cognite/pulse";

import { model as todosModel } from "./model";

export interface TodosContextInterface {
  todosModel: typeof todosModel;
}

const defaultValue: TodosContextInterface = {
  todosModel,
};

export const todosContext = createContext(defaultValue);
