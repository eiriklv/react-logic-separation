import { createContext } from "@cognite/pulse";

import { model as todosModel } from "./model";
import { TodoItem } from "./components/TodoItem";

export interface TodosContextInterface {
  todosModel: typeof todosModel;
  TodoItem: typeof TodoItem;
}

const defaultValue: TodosContextInterface = {
  todosModel,
  TodoItem,
};

export const todosContext = createContext(defaultValue);
