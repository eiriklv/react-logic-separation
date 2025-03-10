import { usersServiceSingleton } from "../services/users.service";

/**
 * Commands are meant to be single purpose operations that
 * wrap around one or more services and methods.
 *
 * Command handle things like validation, transformations, error mapping, etc
 * - so that the consumer can use it with a much ease as possible
 *
 * Commands should be fully tested to ensure that all validation
 * and error handling logic is solid, and so that the same things
 * do not have to be tested through the model or the UI
 */

const defaultDependencies = {
  usersService: usersServiceSingleton,
};

export type GetUserCommandDependencies = typeof defaultDependencies;

export class GetUserCommand {
  private _dependencies: GetUserCommandDependencies;

  public invoke = (userId: string) => {
    return this._dependencies.usersService.getUserById(userId);
  };

  constructor(dependencies: GetUserCommandDependencies = defaultDependencies) {
    this._dependencies = dependencies;
  }
}

export const getUserCommand = new GetUserCommand().invoke;
