import { useTaskItemViewModel } from "./TaskItem.view-model";

/**
 * This file contains the interface of the
 * dependencies for the unit, in addition
 * to the defaults for those dependencies
 */

export interface TaskItemDependencies {
  useTaskItemViewModel: typeof useTaskItemViewModel;
}

const defaultDependencies: TaskItemDependencies = {
  useTaskItemViewModel,
};

export default defaultDependencies;
