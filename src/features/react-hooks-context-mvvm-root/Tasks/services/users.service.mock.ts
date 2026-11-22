import { sleep } from "../../../../lib/utils";
import { User } from "../types";
import { IUsersService } from "./users.service";
import defaultDependencies, {
  UsersServiceDependencies,
} from "./users.service.dependencies";

/**
 * Fake delay
 */
const serviceDelayInMs = 0;

export class UsersServiceMock implements IUsersService {
  private _users: User[];
  private _dependencies: UsersServiceDependencies;

  constructor(_sdk: unknown, dependencies?: UsersServiceDependencies) {
    this._dependencies = {
      ...defaultDependencies,
      ...dependencies,
    };
    this._users = this._dependencies.initialUsers ?? [];
  }

  public async listUsers() {
    await sleep(serviceDelayInMs);
    return this._users.slice();
  }

  public async getUserById(userId: string) {
    await sleep(serviceDelayInMs);
    return this._users.find((user) => user.id === userId);
  }
}

// Service factory
export const createUsersServiceMock = (
  ...args: ConstructorParameters<typeof UsersServiceMock>
): IUsersService => new UsersServiceMock(...args);
