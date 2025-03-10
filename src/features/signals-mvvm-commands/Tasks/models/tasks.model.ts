import { computed, ReadonlySignal } from "@preact/signals-core";

import {
  defaultQueryClient,
  mutation,
  query,
  SignalMutation,
  SignalQuery,
} from "../../../../lib/query";
import { QueryClient } from "@tanstack/query-core";
import { Task } from "../types";
import { listTasksCommand } from "../commands/list-tasks.command";
import { addTaskCommand } from "../commands/add-task.command";
import { deleteTaskCommand } from "../commands/delete-task.command";

// Dependencies to be injected
const defaultDependencies = {
  listTasksCommand,
  addTaskCommand,
  deleteTaskCommand,
};

// Types and interfaces
export type TasksModelDependencies = typeof defaultDependencies;

export class TasksModel {
  // Dependencies
  private _dependencies: TasksModelDependencies;

  // Query client
  private _queryClient: QueryClient;

  // Queries
  private _tasksQuery: SignalQuery<Task[]>;

  // Mutations
  private _addTaskMutation: SignalMutation<
    {
      text: string;
      ownerId: string;
    },
    Task
  >;

  // Mutations
  private _deleteTaskMutation: SignalMutation<
    {
      taskId: string;
    },
    void
  >;

  // Constructor
  constructor(
    queryClient: QueryClient = defaultQueryClient,
    dependencies: TasksModelDependencies = defaultDependencies,
  ) {
    this._queryClient = queryClient;
    this._dependencies = dependencies;

    // Queries
    this._tasksQuery = query<Task[]>(
      () => ({
        queryKey: ["tasks"],
        queryFn: () => this._dependencies.listTasksCommand(),
      }),
      () => this._queryClient,
    );

    // Mutations
    this._addTaskMutation = mutation(
      () => ({
        mutationFn: ({ text, ownerId }: { text: string; ownerId: string }) =>
          this._dependencies.addTaskCommand(text, ownerId),
        onSuccess: () => {
          this._queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
      }),
      () => this._queryClient,
    );

    this._deleteTaskMutation = mutation(
      () => ({
        mutationFn: ({ taskId }: { taskId: string }) =>
          this._dependencies.deleteTaskCommand(taskId),
        onSuccess: () => {
          this._queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
      }),
      () => this._queryClient,
    );
  }

  // Getters
  public getTasksByOwnerId(
    selectedOwnerId: ReadonlySignal<string>,
  ): ReadonlySignal<Task[] | undefined> {
    return computed(() => {
      const selectedOwnerIdValue = selectedOwnerId.value;
      return this._tasksQuery.value.data?.filter(
        (task) =>
          !selectedOwnerIdValue || task.ownerId === selectedOwnerIdValue,
      );
    });
  }

  public get tasks(): ReadonlySignal<Task[] | undefined> {
    return computed(() => this._tasksQuery.value.data);
  }

  public getTasksCountByOwnerId(
    selectedOwnerId: ReadonlySignal<string>,
  ): ReadonlySignal<number> {
    return computed(() => {
      const selectedOwnerIdValue = selectedOwnerId.value;
      return (
        this._tasksQuery.value.data?.filter(
          (task) =>
            !selectedOwnerIdValue || task.ownerId === selectedOwnerIdValue,
        ).length || 0
      );
    });
  }

  public get tasksCount(): ReadonlySignal<number> {
    return computed(() => this._tasksQuery.value.data?.length || 0);
  }

  public get isLoading(): ReadonlySignal<boolean> {
    return computed(() => this._tasksQuery.value.isLoading);
  }

  public get isFetching(): ReadonlySignal<boolean> {
    return computed(() => this._tasksQuery.value.isFetching);
  }

  public get isSaving(): ReadonlySignal<boolean> {
    return computed(() => this._tasksQuery.value.isPending);
  }

  // Commands
  public addTask = async (text: string, ownerId: string) => {
    // Validation
    if (!text || !ownerId) {
      return;
    }

    await this._addTaskMutation.value.mutate({ text, ownerId });
  };

  public deleteTask = async (taskId: string) => {
    // Validation
    if (!taskId) {
      return;
    }

    await this._deleteTaskMutation.value.mutate({ taskId });
  };
}

// Model singleton
export const tasksModelSingleton = new TasksModel();
