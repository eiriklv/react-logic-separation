import { useContext, createContext } from "react";
import { useConditionalTimerModel } from "./model";

export function ConditionalTimer() {
  const { useConditionalTimerModel } = useContext(ConditionalTimerContext);

  const {
    elapsedSeconds,
    isOkay,
    isSafe,
    isCool,
    isRunning,
    toggleOkay,
    toggleSafe,
    toggleCool,
    resetTimer,
  } = useConditionalTimerModel();

  return (
    <div>
      <pre>react-hooks-context</pre>
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

export interface ConditionalTimerContextInterface {
  useConditionalTimerModel: typeof useConditionalTimerModel;
}

export const defaultValue: ConditionalTimerContextInterface = {
  useConditionalTimerModel,
};

export const ConditionalTimerContext =
  createContext<ConditionalTimerContextInterface>(defaultValue);
