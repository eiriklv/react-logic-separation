import { ISelectedFiltersModel } from "../../models/selected-filters.model";
import { ITasksModel } from "../../models/tasks.model";
import { useModels } from "../../providers/models.provider";

/**
 * This file contains the interface of the
 * dependencies for the unit, in addition
 * to the defaults for those dependencies
 */

/**
 * Specify which subset of models
 * we depend on in this module
 */
export type ModelsDependencies = {
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
};

export interface TaskListViewModelDependencies {
  useModels: () => ModelsDependencies;
}

const defaultDependencies: TaskListViewModelDependencies = {
  useModels,
};

export default defaultDependencies;
