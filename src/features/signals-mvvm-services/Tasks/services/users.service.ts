import { ISdk } from "../sdks/sdk";
import { User } from "../types";
import { UsersServiceDependencies } from "./users.service.dependencies";

/**
 * Services are typically things like SDKs, APIs or other classes that
 * expose a bunch of methods to interact with some internal state,
 * which might reside on the client and/or the server through some network layer
 *
 * Services will often interact with an sdk or directly with an API, so that
 * testing a service will often involve either using a mock for the SDK,
 * or things like mock-service-worker or nock (mocking the network layer)
 */
export interface IUsersService {
  listUsers(): Promise<User[]>;
  getUserById(userId: string): Promise<User | undefined>;
}

export type SdkDependencies = Pick<ISdk, "listUsers" | "retrieveUserById">;

export class UsersService implements IUsersService {
  private _sdk: SdkDependencies;

  constructor(sdk: SdkDependencies, _dependencies?: UsersServiceDependencies) {
    this._sdk = sdk;
  }

  public async listUsers() {
    return this._sdk.listUsers();
  }

  public async getUserById(userId: string) {
    return this._sdk.retrieveUserById(userId);
  }
}

// Service factory
export const createUsersService = (
  ...args: ConstructorParameters<typeof UsersService>
): IUsersService => new UsersService(...args);
