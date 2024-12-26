import { createTypedHooks } from "easy-peasy";
import { TodosModel } from "./model";
import { useCallback } from "react";

const { useStoreState, useStoreActions } = createTypedHooks<TodosModel>();

/**
 * The main purpose of this file is to
 * bridge the business logic and the React view
 *
 * Access to business logic is facilitated
 * by proving custom hooks with appropriate
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
  return useStoreState((state) => state.isInitialized);
};

export const useIsSaving = () => {
  return useStoreState((state) => state.isSaving);
};

export const useTodos = () => {
  return useStoreState((state) => state.todos);
};

export const useTodosCount = () => {
  return useStoreState((state) => state.todosCount);
};

export const useAddTodo = () => {
  const { addTodo } = useStoreActions((actions) => actions);
  return useCallback((text: string) => addTodo(text), [addTodo]);
};
