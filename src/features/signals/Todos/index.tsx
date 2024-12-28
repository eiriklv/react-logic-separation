import { store } from "./model";
import { Todos } from "./Todos";

// Trigger init of the store
store.initializeTodos();

export function TodosFeature() {
  return <Todos />;
}
