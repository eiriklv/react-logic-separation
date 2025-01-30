import { todosModel } from "./models/todos-model";
import { Todos } from "./Todos";

// Trigger init of the store (can be done outside of React)
todosModel.initializeTodos();

export function TodosFeature() {
  return <Todos />;
}
