import { useContext } from "react";
import { ConditionalTimerContext } from "./ConditionalTimer.context";

export function ConditionalTimer() {
  const { useConditionalTimerModel } = useContext(ConditionalTimerContext);
  const {
    elapsedSeconds,
    isOkay,
    isSafe,
    isCool,
    isRunning,
    toggleOkay,
    toggleSafe,
    toggleCool,
    resetTimer
  } = useConditionalTimerModel();

  return (
    <div>
      <pre>react-hooks-context</pre>
      <h3>Conditional Timer</h3>
      <h4>Status: {isRunning ? "running" : "stopped"}</h4>
      <div>{elapsedSeconds}</div>
      <button onClick={resetTimer}>Reset</button>
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
  );
}
