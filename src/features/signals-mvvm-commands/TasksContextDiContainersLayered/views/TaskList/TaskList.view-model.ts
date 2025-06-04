import { useSignalValue } from "../../../../../lib/use-signal-value";
import {
  ModelsContextInterface,
  useModels,
} from "../../providers/models.provider";
import { PickDeep } from "type-fest";

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

export type ModelsDependencies = PickDeep<
  ModelsContextInterface,
  | "selectedFiltersModel"
  | "tasksModel.getTasksByOwnerId"
  | "tasksModel.getTasksCountByOwnerId"
  | "tasksModel.addTask"
  | "tasksModel.isFetching"
  | "tasksModel.isLoading"
  | "tasksModel.isSaving"
>;

export const useTaskListViewModel = () => {
  // Get models from the shared models provider
  const models = useModels<ModelsDependencies>();

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
