import { computed, ReadonlySignal } from "@preact/signals-core";

import {
  defaultQueryClient,
  mutation,
  query,
  SignalMutation,
  SignalQuery,
} from "../../../../lib/query";
import { QueryClient } from "@tanstack/query-core";
import { fetchRemindersCommand } from "../commands/fetch-reminders";
import { addReminderCommand } from "../commands/add-reminder";
import { Reminder } from "../types";

// Dependencies to be injected
const defaultDependencies = {
  fetchRemindersCommand,
  addReminderCommand,
};

// Types and interfaces
export type RemindersModelDependencies = typeof defaultDependencies;

export class RemindersModel {
  // Dependencies
  private _injections: RemindersModelDependencies = defaultDependencies;

  // Query client
  private _queryClient: QueryClient;

  // Queries
  private _remindersQuery: SignalQuery<Reminder[]>;

  // Mutations
  private _addReminderMutation: SignalMutation<string, Reminder>;

  // Computed
  private _remindersCount = computed(
    () => this._remindersQuery.data.value?.length || 0,
  );

  // Constructor
  constructor(
    queryClient: QueryClient,
    dependencies: RemindersModelDependencies = defaultDependencies,
  ) {
    this._queryClient = queryClient;
    this._injections = dependencies;

    // Queries
    this._remindersQuery = query<Reminder[]>(
      () => ({
        queryKey: ["reminders"],
        queryFn: () => this._injections.fetchRemindersCommand(),
      }),
      this._queryClient,
    );

    // Mutations
    this._addReminderMutation = mutation(
      () => ({
        mutationFn: (text: string) => this._injections.addReminderCommand(text),
        onSuccess: () => {
          this._queryClient.invalidateQueries({ queryKey: ["reminders"] });
        },
      }),
      this._queryClient,
    );
  }

  // Getters
  public get reminders(): ReadonlySignal<Reminder[] | undefined> {
    return this._remindersQuery.data;
  }

  public get remindersCount(): ReadonlySignal<number> {
    return this._remindersCount;
  }

  public get isLoading(): ReadonlySignal<boolean> {
    return this._remindersQuery.isLoading;
  }

  public get isFetching(): ReadonlySignal<boolean> {
    return this._remindersQuery.isFetching;
  }

  public get isSaving(): ReadonlySignal<boolean> {
    return this._remindersQuery.isPending;
  }

  // Commands
  public addReminder = async (text: string) => {
    // Validation
    if (!text) {
      return;
    }

    await this._addReminderMutation.mutate(text);
  };
}

// Model singleton
export const remindersModel = new RemindersModel(defaultQueryClient);
