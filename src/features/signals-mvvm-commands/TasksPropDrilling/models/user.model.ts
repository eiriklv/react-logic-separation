import { computed, ReadonlySignal } from "@preact/signals-core";

import { defaultQueryClient, query, SignalQuery } from "../../../../lib/query";
import { QueryClient } from "@tanstack/query-core";
import { User } from "../types";
import { getUserCommand } from "../commands/get-user.command";

export interface IUserModel {
  user: ReadonlySignal<User | undefined>;
  isLoading: ReadonlySignal<boolean>;
  error: ReadonlySignal<Error | null>;
}

// Dependencies to be injected
const defaultDependencies = {
  getUserCommand,
};

// Types and interfaces
export type UserModelDependencies = typeof defaultDependencies;

export class UserModel implements IUserModel {
  // Dependencies
  private _dependencies: UserModelDependencies;

  // Query client
  private _queryClient: QueryClient;

  // Queries
  private _userQuery: SignalQuery<User | undefined>;

  // Constructor
  constructor(
    userId: string,
    queryClient: QueryClient = defaultQueryClient,
    dependencies: UserModelDependencies = defaultDependencies,
  ) {
    this._queryClient = queryClient;
    this._dependencies = dependencies;

    // Queries
    this._userQuery = query<User | undefined>(
      () => ({
        queryKey: ["user", userId],
        queryFn: () => this._dependencies.getUserCommand(userId),
        retry: false,
      }),
      () => this._queryClient,
    );
  }

  public get user(): ReadonlySignal<User | undefined> {
    return computed(() => this._userQuery.value.data);
  }

  public get isLoading(): ReadonlySignal<boolean> {
    return computed(() => this._userQuery.value.isLoading);
  }

  public get error(): ReadonlySignal<Error | null> {
    return computed(() => this._userQuery.value.error);
  }
}

// Model factory
export const createUserModel = (
  ...args: ConstructorParameters<typeof UserModel>
): IUserModel => new UserModel(...args);
