import { useContext } from "react";
import { ConditionalTimerContext } from "./ConditionalTimer.context";

export function ConditionalTimer() {
  // Get injected dependencies from context
  const {
    useElapsedSeconds,
    useIsOkay,
    useIsSafe,
    useIsCool,
    useIsRunning,
    useToggleOkay,
    useToggleSafe,
    useToggleCool,
    useResetTimer,
  } = useContext(ConditionalTimerContext);

  // Use injected dependencies (domain state/actions, components, etc)
  const elapsedSeconds = useElapsedSeconds();
  const isOkay = useIsOkay();
  const isSafe = useIsSafe();
  const isCool = useIsCool();
  const isRunning = useIsRunning();
  const toggleOkay = useToggleOkay();
  const toggleSafe = useToggleSafe();
  const toggleCool = useToggleCool();
  const resetTimer = useResetTimer();

  return (
    <div>
      <pre>mobx</pre>
      <h3>Conditional Timer</h3>
      <h4>Status: {isRunning ? "running" : "stopped"}</h4>
      <div>{elapsedSeconds}</div>
      <button onClick={resetTimer}>Reset</button>
      <div>
        <label>
          Okay
          <input
            name="okay"
            type="checkbox"
            checked={isOkay}
            onChange={toggleOkay}
          />
        </label>
        <label>
          Safe
          <input
            name="safe"
            type="checkbox"
            checked={isSafe}
            onChange={toggleSafe}
          />
        </label>
        <label>
          Cool
          <input
            name="cool"
            type="checkbox"
            checked={isCool}
            onChange={toggleCool}
          />
        </label>
      </div>
    </div>
  );
}
