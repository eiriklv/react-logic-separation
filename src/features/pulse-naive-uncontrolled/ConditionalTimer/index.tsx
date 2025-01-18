import { Render } from "@cognite/pulse/react-views";
import { ConditionalTimer } from "./ConditionalTimer";

export function ConditionalTimerFeature() {
  return <Render element={ConditionalTimer()} />;
}
