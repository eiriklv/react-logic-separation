import { useContext } from "react";
import { TimerContext } from "./context";

export function Timer() {
  const { useTimerModel } = useContext(TimerContext);
  const { elapsedSeconds, isRunning, startTimer, stopTimer } = useTimerModel();

  return (
    <div>
      <pre>react-hooks-context</pre>
      <h3>Timer</h3>
      <h4>Status: {isRunning ? "running" : "stopped"}</h4>
      <div>{elapsedSeconds}</div>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
    </div>
  );
}
