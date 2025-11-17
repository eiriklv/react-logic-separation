import { sleep } from "../../../../lib/utils";
import { User } from "../types";
import { IUsersService } from "./users.service";

/**
 * Fake delay
 */
const serviceDelayInMs = 0;

export class UsersServiceMock implements IUsersService {
  private _users: User[];

  constructor(initialUsers?: User[]) {
    this._users = initialUsers?.slice() ?? [];
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
