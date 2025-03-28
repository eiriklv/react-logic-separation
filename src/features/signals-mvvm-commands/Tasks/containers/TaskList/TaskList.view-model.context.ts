import React from "react";
import {
  ISelectedFiltersModel,
  selectedFiltersModelSingleton,
} from "../../models/selected-filters.model";
import { ITasksModel, tasksModelSingleton } from "../../models/tasks.model";

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

export interface TaskListViewModelContextInterface {
  selectedFiltersModel: ISelectedFiltersModel;
  tasksModel: Pick<
    ITasksModel,
    | "getTasksByOwnerId"
    | "getTasksCountByOwnerId"
    | "addTask"
    | "isFetching"
    | "isLoading"
    | "isSaving"
  >;
}

export const defaultValue: TaskListViewModelContextInterface = {
  selectedFiltersModel: selectedFiltersModelSingleton,
  tasksModel: tasksModelSingleton,
};

export const TaskListViewModelContext =
  React.createContext<TaskListViewModelContextInterface>(defaultValue);
