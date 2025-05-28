import {
  IUsersService,
  usersServiceSingleton,
} from "../services/users.service";
import { User } from "../types";

/**
 * Commands are meant to be single purpose operations that
 * wrap around one or more services and methods.
 *
 * Commands handle things like validation, transformations, error mapping, etc
 * - so that the consumer can use it with as much ease as possible
 *
 * Commands should be fully tested to ensure that all validation
 * and error handling logic is solid, and so that the same things
 * do not have to be tested through the model or the UI
 */

export interface IListUsersCommandInvocation {
  (): Promise<User[]>;
}

interface IListUsersCommand {
  invoke: IListUsersCommandInvocation;
}

export type ListUsersCommandDependencies = {
  usersService: Pick<IUsersService, "listUsers">;
};

const defaultDependencies: ListUsersCommandDependencies = {
  usersService: usersServiceSingleton,
};

export class ListUsersCommand implements IListUsersCommand {
  private _dependencies: ListUsersCommandDependencies;

  public invoke = () => {
    return this._dependencies.usersService.listUsers();
  };

  constructor(
    dependencies: ListUsersCommandDependencies = defaultDependencies,
  ) {
    this._dependencies = dependencies;
  }
}

// Command factory
export const createListUsersCommand = (
  ...args: ConstructorParameters<typeof ListUsersCommand>
): IListUsersCommandInvocation => new ListUsersCommand(...args).invoke;
