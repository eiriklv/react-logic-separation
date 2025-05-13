import { useTaskItemViewModel } from "./TaskItem.view-model";

export interface TaskItemDependencies {
  useTaskItemViewModel: typeof useTaskItemViewModel;
}

const defaultDependencies: TaskItemDependencies = {
  useTaskItemViewModel,
};

export default defaultDependencies;
