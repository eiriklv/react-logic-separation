import { useContext } from "react";
import { TimerContext } from "./Timer.context";

export function Timer() {
  // Get injected dependencies from context
  const { useElapsedSeconds, useIsRunning, useStartTimer, useStopTimer } =
    useContext(TimerContext);

  // Use injected dependencies (domain state/actions, components, etc)
  const elapsedSeconds = useElapsedSeconds();
  const isRunning = useIsRunning();
  const startTimer = useStartTimer();
  const stopTimer = useStopTimer();

  return (
    <div>
      <pre>easy-peasy</pre>
      <h3>Timer</h3>
      <h4>Status: {isRunning ? "running" : "stopped"}</h4>
      <div>{elapsedSeconds}</div>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
    </div>
  );
}
