import { useTaskListViewModel } from "./TaskList.view-model";
import { TaskItem } from "../TaskItem/TaskItem.view";

/**
 * This file contains the interface of the
 * dependencies for the unit, in addition
 * to the defaults for those dependencies
 */

export interface TaskListDependencies {
  useTaskListViewModel: typeof useTaskListViewModel;
  TaskItem: typeof TaskItem;
}

const defaultDependencies: TaskListDependencies = {
  useTaskListViewModel,
  TaskItem,
};

export default defaultDependencies;
