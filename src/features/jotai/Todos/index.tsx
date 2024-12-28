import { model, store } from "./model";
import { Todos } from "./Todos";
import { noop } from "./utils";

// Mount effects
store.sub(model.autoSaveTodosOnChange, noop);

// Trigger init of the store
store.set(model.initializeTodos);

export function TodosFeature() {
  return <Todos />;
}
