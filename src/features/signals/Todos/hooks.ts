import { useSignal, useStore } from "./signal-hooks";

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
  const store = useStore();
  return useSignal(store.isInitialized);
};

export const useIsSaving = () => {
  const store = useStore();
  return useSignal(store.isSaving);
};

export const useTodos = () => {
  const store = useStore();
  return useSignal(store.todos);
};

export const useTodosCount = () => {
  const store = useStore();
  return useSignal(store.todosCount);
};

export const useAddTodo = () => {
  const { addTodo } = useStore();
  return addTodo;
};
