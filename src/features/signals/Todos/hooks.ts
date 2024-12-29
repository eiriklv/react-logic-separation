import { Signal } from "@preact/signals-core";
import { useSyncExternalStore } from "react";
import { model } from "./model";

/**
 * Custom hook for connecting signals to React
 */
const useSignal = <T>(signal: Signal<T>) => {
  return useSyncExternalStore(
    signal.subscribe.bind(signal),
    signal.peek.bind(signal)
  );
};

/**
 * The main purpose of this file is to
 * bridge the business logic and the React view
 *
 * Access to business logic is facilitated
 * by providing custom hooks with appropriate
 * interfaces - taking care not to expose
 * implementation details of the business
 * logic itself or libraries used
 *
 * It can also be used for 3rd party library hooks,
 * so that you avoid coupling your component directly.
 * Instead you can provide a nice interface and map
 * the custom hooks into it
 */

export const useIsInitialized = () => {
  return useSignal(model.isInitialized);
};

export const useIsSaving = () => {
  return useSignal(model.isSaving);
};

export const useTodos = () => {
  return useSignal(model.todos);
};

export const useTodosCount = () => {
  return useSignal(model.todosCount);
};

export const useAddTodo = () => {
  return model.addTodo;
};
