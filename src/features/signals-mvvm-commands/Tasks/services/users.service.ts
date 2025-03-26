import { sleep } from "../../../../lib/utils";
import { User } from "../types";

/**
 * Services are typically things like SDKs, APIs or other classes that
 * expose a bunch of methods to interact with some internal state,
 * which might reside on the client and/or the server through some network layer
 *
 * Services will often interact with an sdk or directly with an API, so that
 * testing a service will often involve either using a mock for the SDK,
 * or things like mock-service-worker or nock (mocking the network layer)
 */
const defaultUsers: User[] = [
  { id: "user-1", name: "Frank Doe", profileImageUrl: "/img/user-1.jpg" },
  { id: "user-2", name: "Jane Johnson", profileImageUrl: "/img/user-2.jpg" },
];

const defaultDependencies = {
  delay: 1000,
};

export type UsersServiceDependencies = typeof defaultDependencies;

export class UsersService {
  private _users: User[];

  private _dependencies: UsersServiceDependencies;

  constructor(
    dependencies: UsersServiceDependencies = defaultDependencies,
    initialUsers: User[] = defaultUsers,
  ) {
    this._dependencies = dependencies;
    this._users = initialUsers;
  }

  public async listUsers() {
    await sleep(this._dependencies.delay);
    return this._users.slice();
  }

  public async getUserById(userId: string) {
    await sleep(this._dependencies.delay);
    return this._users.find((user) => user.id === userId);
  }
}

export const usersServiceSingleton = new UsersService();
