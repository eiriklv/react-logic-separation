import React from "react";
import { useTodosViewModel } from "./Todos.view-model";
import { TodoItem } from "./components/TodoItem";

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

export interface TodosContextInterface {
  useTodosViewModel: typeof useTodosViewModel;
  TodoItem: typeof TodoItem;
}

export const defaultValue: TodosContextInterface = {
  useTodosViewModel,
  TodoItem,
};

export const TodosContext =
  React.createContext<TodosContextInterface>(defaultValue);
