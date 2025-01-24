import { useEffect, useMemo, useState } from "react";

export function ConditionalTimer() {
  // State
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isOkay, setIsOkay] = useState(false);
  const [isSafe, setIsSafe] = useState(false);
  const [isCool, setIsCool] = useState(false);

  // Computed
  const isRunning = useMemo(
    () => isOkay && isSafe && isCool,
    [isCool, isOkay, isSafe],
  );

  // Events
  const toggledOkay = () => {
    setIsOkay((value) => !value);
  };
  const toggledSafe = () => {
    setIsSafe((value) => !value);
  };
  const toggledCool = () => {
    setIsCool((value) => !value);
  };
  const resettedTimer = () => {
    setElapsedSeconds(0);
  };
  const incrementedElapsedSeconds = () => {
    setElapsedSeconds((value) => value + 1);
  };

  // Commands
  const toggleOkay = async () => {
    toggledOkay();
  };
  const toggleSafe = async () => {
    toggledSafe();
  };
  const toggleCool = async () => {
    toggledCool();
  };
  const resetTimer = async () => {
    resettedTimer();
  };

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
