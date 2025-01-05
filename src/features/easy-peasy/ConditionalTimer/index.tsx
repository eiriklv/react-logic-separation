import { StoreProvider } from "easy-peasy";
import { store } from "./model";
import { ConditionalTimer } from "./ConditionalTimer";

export function ConditionalTimerFeature() {
  return (
    <StoreProvider store={store}>
      <ConditionalTimer />
    </StoreProvider>
  );
}
