import { computed, ReadonlySignal } from "@preact/signals-core";

import {
  defaultQueryClient,
  mutation,
  query,
  SignalMutation,
  SignalQuery,
} from "../../../../lib/query";
import { QueryClient } from "@tanstack/query-core";
import { Reminder } from "../types";
import { uniq } from "lodash";
import { fetchRemindersCommand } from "../commands/fetch-reminders";
import { addReminderCommand } from "../commands/add-reminder";

// Dependencies to be injected
const defaultDependencies = {
  fetchRemindersCommand,
  addReminderCommand,
};

// Types and interfaces
export type RemindersModelDependencies = typeof defaultDependencies;

export class RemindersModel {
  // Dependencies
  private _injections: RemindersModelDependencies;

  // Query client
  private _queryClient: QueryClient;

  // Queries
  private _remindersQuery: SignalQuery<Reminder[]>;

  // Mutations
  private _addReminderMutation: SignalMutation<
    {
      text: string;
      category: string;
    },
    Reminder
  >;

  // Constructor
  constructor(
    queryClient: QueryClient = defaultQueryClient,
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
        mutationFn: ({ text, category }: { text: string; category: string }) =>
          this._injections.addReminderCommand(text, category),
        onSuccess: () => {
          this._queryClient.invalidateQueries({ queryKey: ["reminders"] });
        },
      }),
      this._queryClient,
    );
  }

  // Getters
  public getRemindersByCategory(
    selectedCategory: ReadonlySignal<string>,
  ): ReadonlySignal<Reminder[] | undefined> {
    return computed(() => {
      const selectedCategoryValue = selectedCategory.value;
      return this._remindersQuery.value.data?.filter(
        (reminder) => reminder.category === selectedCategoryValue,
      );
    });
  }

  public get reminders(): ReadonlySignal<Reminder[] | undefined> {
    return computed(() => this._remindersQuery.value.data);
  }

  public getRemindersCountByCategory(
    selectedCategory: ReadonlySignal<string>,
  ): ReadonlySignal<number> {
    return computed(() => {
      const selectedCategoryValue = selectedCategory.value;
      return (
        this._remindersQuery.value.data?.filter(
          (reminder) => reminder.category === selectedCategoryValue,
        ).length || 0
      );
    });
  }

  public get remindersCount(): ReadonlySignal<number> {
    return computed(() => this._remindersQuery.value.data?.length || 0);
  }

  public get categories(): ReadonlySignal<string[]> {
    return computed(() => {
      return uniq(
        this._remindersQuery.value.data?.map((reminder) => {
          return reminder.category;
        }) || [],
      );
    });
  }

  public get isLoading(): ReadonlySignal<boolean> {
    return computed(() => this._remindersQuery.value.isLoading);
  }

  public get isFetching(): ReadonlySignal<boolean> {
    return computed(() => this._remindersQuery.value.isFetching);
  }

  public get isSaving(): ReadonlySignal<boolean> {
    return computed(() => this._remindersQuery.value.isPending);
  }

  // Commands
  public addReminder = async (text: string, category: string) => {
    // Validation
    if (!text || !category) {
      return;
    }

    await this._addReminderMutation.value.mutate({ text, category });
  };
}

// Model singleton
export const remindersModel = new RemindersModel();
