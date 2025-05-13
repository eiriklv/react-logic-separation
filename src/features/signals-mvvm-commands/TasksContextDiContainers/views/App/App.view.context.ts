import React from "react";
import { useAppViewModel } from "./App.view-model";
import { Actions } from "../Actions/Actions.view";
import { Filters } from "../Filters/Filters.view";
import { TaskList } from "../TaskList/TaskList.view";

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

export interface AppContextInterface {
  useAppViewModel: typeof useAppViewModel;
  Actions: typeof Actions;
  Filters: typeof Filters;
  TaskList: typeof TaskList;
}

export const defaultValue: AppContextInterface = {
  useAppViewModel,
  Actions,
  Filters,
  TaskList,
};

export const AppContext =
  React.createContext<AppContextInterface>(defaultValue);
