import { useEffect, useState } from "react";

/**
 * NOTE: An issue with using hooks as the model instances
 * is that there is no simple way of creating a "long lived"
 * instance that does not get reset if the component using
 * it is re-rendered
 */
export const useTimerModel = () => {
  // State
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Events
  const startedTimer = () => {
    setIsRunning(true);
  };
  const stoppedTimer = () => {
    setIsRunning(false);
  };
  const incrementedElapsedSeconds = () => {
    setElapsedSeconds((value) => value + 1);
  };

  // Commands
  const startTimer = async () => {
    startedTimer();
  };
  const stopTimer = async () => {
    stoppedTimer();
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

  // Public model interface
  return {
    elapsedSeconds,
    isRunning,
    startTimer,
    stopTimer,
  };
};
