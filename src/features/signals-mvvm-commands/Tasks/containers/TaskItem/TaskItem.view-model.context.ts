import React from "react";
import { tasksModelSingleton } from "../../models/tasks.model";
import { createUserModel } from "../../models/user.model";

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

export interface TaskItemViewModelContextInterface {
  tasksModel: typeof tasksModelSingleton;
  createUserModel: typeof createUserModel;
}

export const defaultValue: TaskItemViewModelContextInterface = {
  tasksModel: tasksModelSingleton,
  createUserModel,
};

export const TaskItemViewModelContext =
  React.createContext<TaskItemViewModelContextInterface>(defaultValue);
