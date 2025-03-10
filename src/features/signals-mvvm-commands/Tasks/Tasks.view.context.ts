import React from "react";
import { Actions } from "./containers/Actions/Actions.view";
import { Filters } from "./containers/Filters/Filters.view";
import { TaskList } from "./containers/TaskList/TaskList.view";

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

export interface TasksContextInterface {
  Actions: typeof Actions;
  Filters: typeof Filters;
  TaskList: typeof TaskList;
}

export const defaultValue: TasksContextInterface = {
  Actions,
  Filters,
  TaskList,
};

export const TasksContext =
  React.createContext<TasksContextInterface>(defaultValue);
