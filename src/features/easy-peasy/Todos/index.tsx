import { StoreProvider } from "easy-peasy";
import { store } from "./model";
import { Todos } from "./Todos";

// Trigger init of the store (can be done outside of React)
store.getActions().initializeTodos();

export function TodosFeature() {
  return (
    <StoreProvider store={store}>
      <Todos />
    </StoreProvider>
  );
}
