import { IUsersService } from "../services/users.service";
import type { User } from "../types";

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

export interface IGetUserCommand {
  (userId: string): Promise<User | undefined>;
}

export type GetUserCommandDependencies = {
  usersService: Pick<IUsersService, "getUserById">;
};

export const createGetUserCommand = (
  dependencies: GetUserCommandDependencies,
): IGetUserCommand => {
  return (userId: string) => {
    return dependencies.usersService.getUserById(userId);
  };
};
