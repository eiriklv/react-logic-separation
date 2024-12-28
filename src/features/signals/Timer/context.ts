import React from "react";
import {
  useElapsedSeconds,
  useIsRunning,
  useStartTimer,
  useStopTimer,
} from "./hooks";

/**
 * The context can be used to inject any kind of
 * dependency, but mainly hooks and components/containers.
 *
 * The main purpose is to facilitate testing
 * and storybooking without havaing to make complex mocks
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
  useElapsedSeconds: typeof useElapsedSeconds;
  useIsRunning: typeof useIsRunning;
  useStartTimer: typeof useStartTimer;
  useStopTimer: typeof useStopTimer;
}

export const defaultValue: TimerContextInterface = {
  useElapsedSeconds,
  useIsRunning,
  useStartTimer,
  useStopTimer,
};

export const TimerContext =
  React.createContext<TimerContextInterface>(defaultValue);
