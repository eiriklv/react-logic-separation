import React from "react";
import { useTodos, useAddTodo, useIsSaving, useIsInitialized } from "./hooks";
import { TodoItem } from "./components/TodoItem";

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

export interface TodosContextInterface {
  useTodos: typeof useTodos;
  useAddTodo: typeof useAddTodo;
  useIsSaving: typeof useIsSaving;
  useIsInitialized: typeof useIsInitialized;
  TodoItem: typeof TodoItem
}

export const defaultValue: TodosContextInterface = {
  useTodos,
  useAddTodo,
  useIsSaving,
  useIsInitialized,
  TodoItem,
};

export const TodosContext =
  React.createContext<TodosContextInterface>(defaultValue);
