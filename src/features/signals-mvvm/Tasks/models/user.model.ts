import { computed, ReadonlySignal } from "@preact/signals-core";

import { defaultQueryClient, query, SignalQuery } from "../../../../lib/query";
import { QueryClient } from "@tanstack/query-core";
import { User } from "../types";
import {
  IUsersService,
  usersServiceSingleton,
} from "../services/users.service";

export interface IUserModel {
  user: ReadonlySignal<User | undefined>;
  isLoading: ReadonlySignal<boolean>;
  error: ReadonlySignal<Error | null>;
}

// Types and interfaces
export type UserModelDependencies = {
  usersService: IUsersService;
};

// Dependencies to be injected
const defaultDependencies: UserModelDependencies = {
  usersService: usersServiceSingleton,
};

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
        queryFn: () => this._dependencies.usersService.getUserById(userId),
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
