import {
  ListUsersCommand,
  ListUsersCommandDependencies,
} from "./list-users.command";
import type { PartialDeep } from "type-fest";

describe("ListUsersCommand", () => {
  it("should work as expected when listing users", async () => {
    // arrange
    const mockDependencies: PartialDeep<ListUsersCommandDependencies> = {
      usersService: {
        listUsers: vi.fn(async () => []),
      },
    };

    const listUsersCommand = new ListUsersCommand(
      mockDependencies as ListUsersCommandDependencies,
    );

    // fetch the users
    const users = await listUsersCommand.invoke();

    // check that the users were given as a result
    expect(users).toEqual([]);

    // check that the underlying service was called
    expect(mockDependencies.usersService?.listUsers).toHaveBeenCalledOnce();
  });
});
