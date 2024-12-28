import { model } from "./model";
import { Todos } from "./Todos";

// Trigger init of the store
model.initializeTodos();

export function TodosFeature() {
  return <Todos />;
}
