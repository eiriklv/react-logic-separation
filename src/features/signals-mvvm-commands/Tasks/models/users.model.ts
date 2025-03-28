import { computed, ReadonlySignal } from "@preact/signals-core";

import { defaultQueryClient, query, SignalQuery } from "../../../../lib/query";
import { QueryClient } from "@tanstack/query-core";
import { User } from "../types";
import { listUsersCommand } from "../commands/list-users.command";

export interface IUsersModel {
  users: ReadonlySignal<User[] | undefined>;
  isLoading: ReadonlySignal<boolean>;
  error: ReadonlySignal<Error | null>;
}

// Dependencies to be injected
const defaultDependencies = {
  listUsersCommand,
};

// Types and interfaces
export type UsersModelDependencies = typeof defaultDependencies;

export class UsersModel implements IUsersModel {
  // Dependencies
  private _dependencies: UsersModelDependencies;

  // Query client
  private _queryClient: QueryClient;

  // Queries
  private _usersQuery: SignalQuery<User[]>;

  // Constructor
  constructor(
    queryClient: QueryClient = defaultQueryClient,
    dependencies: UsersModelDependencies = defaultDependencies,
  ) {
    this._queryClient = queryClient;
    this._dependencies = dependencies;

    // Queries
    this._usersQuery = query<User[]>(
      () => ({
        queryKey: ["users"],
        queryFn: () => this._dependencies.listUsersCommand(),
        retry: false,
      }),
      () => this._queryClient,
    );
  }

  public get users(): ReadonlySignal<User[] | undefined> {
    return computed(() => this._usersQuery.value.data);
  }

  public get isLoading(): ReadonlySignal<boolean> {
    return computed(() => this._usersQuery.value.isLoading);
  }

  public get error(): ReadonlySignal<Error | null> {
    return computed(() => this._usersQuery.value.error);
  }
}

export const usersModelSingleton: IUsersModel = new UsersModel();
