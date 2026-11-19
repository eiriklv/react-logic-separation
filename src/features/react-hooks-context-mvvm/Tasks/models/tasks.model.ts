import { Task } from "../types";
import { ITasksService } from "../services/tasks.service";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";

export interface ITasksModel {
  tasks: Task[] | undefined;
  tasksCount: number;
  isLoading: boolean;
  isFetching: boolean;
  isSaving: boolean;

  useTasksByOwnerId(selectedOwnerId: string): Task[] | undefined;
  useTasksCountByOwnerId(selectedOwnerId: string): number;

  addTask(text: string, ownerId: string): Promise<void>;
  deleteTask(taskId: string): Promise<void>;
}

// Types and interfaces
export type TasksModelDependencies = {
  tasksService: Pick<ITasksService, "addTask" | "deleteTask" | "listTasks">;
};

export function useTasksModel(queryClient: QueryClient, dependencies: TasksModelDependencies): ITasksModel {
  // Queries
  const tasksQuery = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: () => dependencies.tasksService.listTasks(),
  });

  // Mutations
  const addTaskMutation = useMutation({
    mutationFn: ({ text, ownerId }: { text: string; ownerId: string }) =>
      dependencies.tasksService.addTask(text, ownerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: ({ taskId }: { taskId: string }) =>
      dependencies.tasksService.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  // Getters
  const useTasksByOwnerId = (selectedOwnerId: string) => {
    const selectedOwnerIdValue = selectedOwnerId;
    return tasksQuery.data?.filter(
      (task) => !selectedOwnerIdValue || task.ownerId === selectedOwnerIdValue,
    );
  };

  const useTasksCountByOwnerId = (selectedOwnerId: string) => {
    const selectedOwnerIdValue = selectedOwnerId;
    return (
      tasksQuery.data?.filter(
        (task) =>
          !selectedOwnerIdValue || task.ownerId === selectedOwnerIdValue,
      ).length || 0
    );
  };

  // Computed values
  const tasks = tasksQuery.data;
  const tasksCount = tasksQuery.data?.length || 0;
  const isLoading = tasksQuery.isLoading;
  const isFetching = tasksQuery.isFetching;
  const isSaving = tasksQuery.isPending;

  // Commands
  const addTask = async (text: string, ownerId: string) => {
    // Validation
    if (!text) {
      throw new Error("Task text is missing");
    }

    if (!ownerId) {
      throw new Error("Owner id for task is missing");
    }

    await addTaskMutation.mutateAsync({ text, ownerId });
  };

  const deleteTask = async (taskId: string) => {
    // Validation
    if (!taskId) {
      throw new Error("Task id must be provided");
    }

    await deleteTaskMutation.mutateAsync({ taskId });
  };

  return {
    tasks,
    tasksCount,
    isLoading,
    isFetching,
    isSaving,
    useTasksByOwnerId,
    useTasksCountByOwnerId,
    addTask,
    deleteTask,
  };
}
