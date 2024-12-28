import { Provider as StoreProvider } from "jotai";

import { incrementTimerWhileRunningAtom, store } from "./model";
import { Timer } from "./Timer";
import { noop } from "./utils";

// mount effects
store.sub(incrementTimerWhileRunningAtom, noop);

export function TimerFeature() {
  return (
    <StoreProvider store={store}>
      <Timer />
    </StoreProvider>
  );
}
