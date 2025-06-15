import { useSignalValue } from "../../../../../lib/use-signal-value";
import { useModels } from "../../providers/models.provider";
import { ISelectedFiltersModel } from "../../models/selected-filters.model";
import { ITasksModel } from "../../models/tasks.model";

/**
 * The main purpose of this file is to
 * bridge the business logic and the React view
 *
 * Access to business logic is facilitated
 * by providing custom hooks with appropriate
 * interfaces - taking care not to expose
 * implementation details of the business
 * logic itself or libraries used
 *
 * It can also be used for 3rd party library hooks,
 * so that you avoid coupling your component directly.
 * Instead you can provide a nice interface and map
 * the custom hooks into it
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

export const useTaskListViewModel = () => {
  // Get models from the shared models provider
  const models: ModelsDependencies = useModels();

  // Pull out what we need from the models
  const { tasksModel, selectedFiltersModel } = models;

  return {
    tasks: useSignalValue(
      tasksModel.getTasksByOwnerId(selectedFiltersModel.selectedOwnerId),
    ),
    tasksCount: useSignalValue(
      tasksModel.getTasksCountByOwnerId(selectedFiltersModel.selectedOwnerId),
    ),
    isLoading: useSignalValue(tasksModel.isLoading),
    isFetching: useSignalValue(tasksModel.isFetching),
    isSaving: useSignalValue(tasksModel.isSaving),
    addTask: tasksModel.addTask,
  };
};
