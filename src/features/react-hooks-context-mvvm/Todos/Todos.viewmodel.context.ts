import React from "react";
import { useTodosModel } from "./models/todos-model";

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

export interface TodosViewModelContextInterface {
  useTodosModel: typeof useTodosModel;
}

export const defaultValue: TodosViewModelContextInterface = {
  useTodosModel,
};

export const TodosViewModelContext =
  React.createContext<TodosViewModelContextInterface>(defaultValue);
