import {
  IUsersService,
  usersServiceSingleton,
} from "../services/users.service";
import { User } from "../types";

/**
 * Commands are meant to be single purpose operations that
 * wrap around one or more services and methods.
 *
 * Command handle things like validation, transformations, error mapping, etc
 * - so that the consumer can use it with as much ease as possible
 *
 * Commands should be fully tested to ensure that all validation
 * and error handling logic is solid, and so that the same things
 * do not have to be tested through the model or the UI
 */

export interface IGetUserCommandInvocation {
  (userId: string): Promise<User | undefined>;
}

interface IGetUserCommand {
  invoke: IGetUserCommandInvocation;
}

export type GetUserCommandDependencies = {
  usersService: Pick<IUsersService, "getUserById">;
};

const defaultDependencies: GetUserCommandDependencies = {
  usersService: usersServiceSingleton,
};

export class GetUserCommand implements IGetUserCommand {
  private _dependencies: GetUserCommandDependencies;

  public invoke = (userId: string) => {
    return this._dependencies.usersService.getUserById(userId);
  };

  constructor(dependencies: GetUserCommandDependencies = defaultDependencies) {
    this._dependencies = dependencies;
  }
}

// Command factory
export const createGetUserCommand = (
  ...args: ConstructorParameters<typeof GetUserCommand>
): IGetUserCommand => new GetUserCommand(...args);
