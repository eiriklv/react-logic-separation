import { useEffect, useMemo, useState } from "react";

/**
 * NOTE: An issue with using hooks as the model instances
 * is that there is no simple way of creating a "long lived"
 * instance that does not get reset if the component using
 * it is re-rendered
 */
export const useConditionalTimerModel = () => {
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

  // Public model interface
  return {
    elapsedSeconds,
    isOkay,
    isSafe,
    isCool,
    isRunning,
    toggleOkay,
    toggleSafe,
    toggleCool,
    resetTimer,
  };
};
