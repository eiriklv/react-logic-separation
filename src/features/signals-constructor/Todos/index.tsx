import { model } from "./model";
import { Todos } from "./Todos";

// Trigger init of the store (can be done outside of React)
model.initializeTodos();

export function TodosFeature() {
  return <Todos />;
}
