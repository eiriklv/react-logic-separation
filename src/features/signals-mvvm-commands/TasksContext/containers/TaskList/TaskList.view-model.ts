import { useContext } from "react";
import { TaskListViewModelContext } from "./TaskList.view-model.context";
import { useSignalValue } from "../../../../../lib/use-signal-value";

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

export const useTaskListViewModel = () => {
  const { tasksModel, selectedFiltersModel } = useContext(
    TaskListViewModelContext,
  );

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
