import React from "react";
import {
  useElapsedSeconds,
  useIsCool,
  useIsOkay,
  useIsRunning,
  useIsSafe,
  useToggleCool,
  useToggleOkay,
  useToggleSafe,
  useResetTimer,
} from "./hooks";

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
  useElapsedSeconds: typeof useElapsedSeconds;
  useIsOkay: typeof useIsOkay;
  useIsSafe: typeof useIsSafe;
  useIsCool: typeof useIsCool;
  useIsRunning: typeof useIsRunning;
  useToggleOkay: typeof useToggleOkay;
  useToggleSafe: typeof useToggleSafe;
  useToggleCool: typeof useToggleCool;
  useResetTimer: typeof useResetTimer;
}

export const defaultValue: ConditionalTimerContextInterface = {
  useElapsedSeconds,
  useIsRunning,
  useIsOkay,
  useIsSafe,
  useIsCool,
  useToggleOkay,
  useToggleSafe,
  useToggleCool,
  useResetTimer,
};

export const ConditionalTimerContext =
  React.createContext<ConditionalTimerContextInterface>(defaultValue);
