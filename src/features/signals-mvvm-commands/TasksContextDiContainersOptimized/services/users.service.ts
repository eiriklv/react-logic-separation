import { sleep } from "../../../../lib/utils";
import { User } from "../types";
import defaultDependencies, {
  UsersServiceDependencies,
} from "./users.service.dependencies";

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

const defaultUsers: User[] = [
  { id: "user-1", name: "Frank Doe", profileImageUrl: "/img/user-1.jpg" },
  { id: "user-2", name: "Jane Johnson", profileImageUrl: "/img/user-2.jpg" },
];

export class UsersService implements IUsersService {
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

// Service factory
export const createUsersService = (
  ...args: ConstructorParameters<typeof UsersService>
): IUsersService => new UsersService(...args);
