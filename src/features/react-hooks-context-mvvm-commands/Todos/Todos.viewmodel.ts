import { useContext } from "react";
import { TodosViewModelContext } from "./Todos.viewmodel.context";

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

export const useTodosViewModel = () => {
  const { useTodosModel } = useContext(TodosViewModelContext);

  const {
    isInitialized,
    isSaving,
    todos,
    todosCount,
    addTodo,
    initializeTodos,
  } = useTodosModel();

  return {
    isInitialized,
    isSaving,
    todos,
    todosCount,
    addTodo,
    initializeTodos,
  };
};
