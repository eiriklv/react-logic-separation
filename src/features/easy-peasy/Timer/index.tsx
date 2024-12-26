import { StoreProvider } from "easy-peasy";
import { store } from "./model";
import { Timer } from "./Timer";

export function TimerFeature() {
  return (
    <StoreProvider store={store}>
      <Timer />
    </StoreProvider>
  );
}
