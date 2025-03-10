import { useEffect, useState } from "react";
import { model } from "./model";
import { autorun } from "mobx";

/**
 * Create hook to connect mobx observables to React
 */
export const useObservableValue = <T, U>(model: U, key: keyof U) => {
  const [value, setValue] = useState(model[key]);

  useEffect(() => {
    autorun(() => {
      setValue(model[key]);
    });
  }, [model, key]);

  return value as T;
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
  return useObservableValue<typeof model.isInitialized, typeof model>(
    model,
    "isInitialized",
  );
};

export const useIsSaving = () => {
  return useObservableValue<typeof model.isSaving, typeof model>(
    model,
    "isSaving",
  );
};

export const useTodos = () => {
  return useObservableValue<typeof model.todos, typeof model>(model, "todos");
};

export const useTodosCount = () => {
  return useObservableValue<typeof model.todosCount, typeof model>(
    model,
    "todosCount",
  );
};

export const useAddTodo = () => {
  return model.addTodo;
};
