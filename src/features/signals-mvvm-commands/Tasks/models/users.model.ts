import { computed, ReadonlySignal } from "@preact/signals-core";

import { defaultQueryClient, query, SignalQuery } from "../../../../lib/query";
import { QueryClient } from "@tanstack/query-core";
import { User } from "../types";
import { listUsersCommand } from "../commands/list-users.command";

// Dependencies to be injected
const defaultDependencies = {
  listUsersCommand,
};

// Types and interfaces
export type UsersModelDependencies = typeof defaultDependencies;

export class UsersModel {
  // Dependencies
  private _dependencies: UsersModelDependencies;

  // Query client
  private _queryClient: QueryClient;

  // Queries
  private _userQuery: SignalQuery<User[]>;

  // Constructor
  constructor(
    queryClient: QueryClient = defaultQueryClient,
    dependencies: UsersModelDependencies = defaultDependencies,
  ) {
    this._queryClient = queryClient;
    this._dependencies = dependencies;

    // Queries
    this._userQuery = query<User[]>(
      () => ({
        queryKey: ["users"],
        queryFn: () => this._dependencies.listUsersCommand(),
      }),
      () => this._queryClient,
    );
  }

  public get users(): ReadonlySignal<User[] | undefined> {
    return computed(() => this._userQuery.value.data);
  }

  public get isLoading(): ReadonlySignal<boolean> {
    return computed(() => this._userQuery.value.isLoading);
  }

  public get error(): ReadonlySignal<Error | null> {
    return computed(() => this._userQuery.value.error);
  }
}

export const usersModelSingleton = new UsersModel();
