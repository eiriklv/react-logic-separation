import { useEffect, useState } from "react";

export function Timer() {
  // State
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Events
  const startedTimer = () => {
    setIsRunning(true);
  }
  const stoppedTimer = () => {
    setIsRunning(false);
  }
  const incrementedElapsedSeconds = () => {
    setElapsedSeconds((value) => value + 1);
  }

  // Commands
  const startTimer = async () => {
    startedTimer();
  };
  const stopTimer = async () => {
    stoppedTimer();
  }

  // Effects
  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = setInterval(() => {
      incrementedElapsedSeconds();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isRunning]);

  return (
    <div>
      <pre>react-naive</pre>
      <h3>Timer</h3>
      <h4>Status: {isRunning ? "running" : "stopped"}</h4>
      <div>{elapsedSeconds}</div>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
    </div>
  );
}
