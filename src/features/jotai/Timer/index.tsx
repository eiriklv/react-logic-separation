import { model, store } from "./model";
import { Timer } from "./Timer";
import { noop } from "./utils";

// mount effects
store.sub(model.incrementTimerWhileRunning, noop);

export function TimerFeature() {
  return <Timer />;
}
