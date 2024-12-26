import { autoSaveTodosOnChangeAtom, initializeTodosAtom, store } from "./model";
import { Todos } from "./Todos";
import { noop } from "./utils";
import { Provider as StoreProvider } from "jotai";

// Mount effects
store.sub(autoSaveTodosOnChangeAtom, noop);

// Trigger init of the store
store.set(initializeTodosAtom);

export function TodosFeature() {
  return (
    <StoreProvider store={store}>
      <Todos />
    </StoreProvider>
  );
}
