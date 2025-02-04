import { useContext } from "react";
import { TimerContext } from "./Timer.context";

export function Timer() {
  // Get injected dependencies from context
  const { useTimerViewModel } = useContext(TimerContext);

  // Use view model
  const { elapsedSeconds, isRunning, startTimer, stopTimer } =
    useTimerViewModel();

  return (
    <div>
      <pre>signals-mvvm</pre>
      <h3>Timer</h3>
      <h4>Status: {isRunning ? "running" : "stopped"}</h4>
      <div>{elapsedSeconds}</div>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
    </div>
  );
}
