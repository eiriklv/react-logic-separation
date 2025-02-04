import React from "react";
import { fetchTodosCommand } from "../commands/fetch-todos";
import { saveTodosCommand } from "../commands/save-todos";
import { generateId } from "../../../../lib/utils";

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

export interface TodosModelContextInterface {
  fetchTodosCommand: typeof fetchTodosCommand;
  saveTodosCommand: typeof saveTodosCommand;
  generateId: typeof generateId;
  waitTimeBeforeSave: number;
}

export const defaultValue: TodosModelContextInterface = {
  fetchTodosCommand,
  saveTodosCommand,
  generateId,
  waitTimeBeforeSave: 1000,
};

export const TodosModelContext =
  React.createContext<TodosModelContextInterface>(defaultValue);
