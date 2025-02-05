import * as remindersService from "./services/reminders.service";

import { defaultQueryClient } from "../../../lib/query";
import { QueryClient } from "@tanstack/query-core";
import { Reminder } from "./types";
import { atom, getDefaultStore } from "jotai";
import {
  atomWithMutation,
  AtomWithMutationResult,
  atomWithQuery,
  AtomWithQueryResult,
} from "jotai-tanstack-query";
import { WritableAtom } from "jotai";
import { Atom } from "jotai";
import { noop } from "../../../lib/utils";

// Dependencies to be injected
const defaultDependencies = {
  remindersService,
};

// Jotai store instance
const defaultStore = getDefaultStore();

// Types and interfaces
export type RemindersModelDependencies = typeof defaultDependencies;

export class RemindersModel {
  // Dependencies
  private _injections: RemindersModelDependencies = defaultDependencies;

  // Store
  private _store: typeof defaultStore;

  // Query client
  private _queryClient: QueryClient;

  // Queries
  private _remindersQuery: WritableAtom<
    AtomWithQueryResult<Reminder[]>,
    [],
    void
  >;

  // Mutations
  private _addReminderMutation: Atom<
    AtomWithMutationResult<void, unknown, string, unknown>
  >;

  // Computed
  private _remindersCount = atom(
    (get) => get(this._remindersQuery).data?.length || 0,
  );

  private _reminders = atom((get) => get(this._remindersQuery).data);
  private _isLoading = atom((get) => get(this._remindersQuery).isLoading);
  private _isFetching = atom((get) => get(this._remindersQuery).isFetching);
  private _isSaving = atom((get) => get(this._remindersQuery).isPending);

  // Constructor
  constructor(
    queryClient: QueryClient,
    store = defaultStore,
    dependencies: RemindersModelDependencies = defaultDependencies,
  ) {
    this._queryClient = queryClient;
    this._store = store;
    this._injections = dependencies;

    // Queries
    this._remindersQuery = atomWithQuery<Reminder[]>(
      () => ({
        queryKey: ["reminders"],
        queryFn: () => {
          const result = this._injections.remindersService.fetchReminders();
          console.log({ result });
          return result;
        },
      }),
      () => this._queryClient,
    );

    // Mutations
    this._addReminderMutation = atomWithMutation(
      () => ({
        mutationFn: (text: string) =>
          this._injections.remindersService.addReminder(text),
        onSuccess: () => {
          this._queryClient.invalidateQueries({ queryKey: ["reminders"] });
        },
      }),
      () => this._queryClient,
    );

    // Mount atom subscriptions
    this._store.sub(this._remindersQuery, noop);
  }

  // Getters
  public get reminders(): Atom<Reminder[] | undefined> {
    return this._reminders;
  }

  public get remindersCount(): Atom<number> {
    return this._remindersCount;
  }

  public get isLoading(): Atom<boolean> {
    return this._isLoading;
  }

  public get isFetching(): Atom<boolean> {
    return this._isFetching;
  }

  public get isSaving(): Atom<boolean> {
    return this._isSaving;
  }

  // Commands
  public addReminder = async (text: string) => {
    // Validation
    if (!text) {
      return;
    }

    await this._store.get(this._addReminderMutation).mutateAsync(text);
  };
}

// Model singleton
export const model = new RemindersModel(defaultQueryClient);
