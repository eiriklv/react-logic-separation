import { useContext, createContext } from "react";
import { useTimerModel } from "./model";

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

/**
 * The context can be used to inject any kind of
 * dependency, but mainly hooks and components/containers.
 *
 * The main purpose is to facilitate testing
 * and storybooking without having to make complex mocks
 * - and to keep the components as simple as possible.
 *
 * Can be used for integrating 3rd party libraries and
 * components into your application
 *
 * The other purpose is to completely avoid prop drilling,
 * which reduces the amount of indirection in components.
 *
 * The interfaces of the components also become much simpler.
 */

export interface TimerContextInterface {
  useTimerModel: typeof useTimerModel;
}

export const defaultValue: TimerContextInterface = {
  useTimerModel,
};

export const TimerContext = createContext<TimerContextInterface>(defaultValue);
