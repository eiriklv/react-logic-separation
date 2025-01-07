import { useTimerModel } from "./model";

export function Timer() {
  const { elapsedSeconds, isRunning, startTimer, stopTimer } = useTimerModel();

  return (
    <div>
      <pre>react-hooks</pre>
      <h3>Timer</h3>
      <h4>Status: {isRunning ? "running" : "stopped"}</h4>
      <div>{elapsedSeconds}</div>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
    </div>
  );
}
