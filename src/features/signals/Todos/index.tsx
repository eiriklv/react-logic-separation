import { store } from "./model";
import { StoreProvider } from "./StoreProvider";
import { Todos } from "./Todos";

// Trigger init of the store
store.initializeTodos();

export function TodosFeature() {
  return (
    <StoreProvider store={store}>
      <Todos />
    </StoreProvider>
  );
}
