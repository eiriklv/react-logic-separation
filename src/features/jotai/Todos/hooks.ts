import { useAtomValue, useSetAtom } from "jotai";
import {
  addTodoAtom,
  isInitializedAtom,
  isSavingAtom,
  todosAtom,
  todosCountAtom,
} from "./model";

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
  return useAtomValue(isInitializedAtom);
};

export const useIsSaving = () => {
  return useAtomValue(isSavingAtom);
};

export const useTodos = () => {
  return useAtomValue(todosAtom);
};

export const useTodosCount = () => {
  return useAtomValue(todosCountAtom);
};

export const useAddTodo = () => {
  return useSetAtom(addTodoAtom);
};
