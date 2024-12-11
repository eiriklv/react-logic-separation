import { StoreProvider } from "easy-peasy";
import { store } from "./model";
import { Todos } from "./Todos";

// Trigger init of the store
store.getActions().initializeTodos();

export function TodosFeature() {
  return (
    <StoreProvider store={store}>
      <Todos />
    </StoreProvider>
  );
}
