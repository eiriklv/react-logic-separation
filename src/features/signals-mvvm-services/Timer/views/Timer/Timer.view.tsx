import defaultDependencies, {
  TimerDependencies,
} from "./Timer.view.dependencies";

type Props = {
  dependencies?: TimerDependencies;
};

export function Timer({ dependencies = defaultDependencies }: Props) {
  // Get injected dependencies from context
  const { useTimerViewModel } = dependencies;

  // Use view model
  const { elapsedSeconds, isRunning, startTimer, stopTimer } =
    useTimerViewModel();

  return (
    <div>
      <pre>signals-mvvm-commands</pre>
      <h3>Timer</h3>
      <h4>Status: {isRunning ? "running" : "stopped"}</h4>
      <div>{elapsedSeconds}</div>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
    </div>
  );
}
