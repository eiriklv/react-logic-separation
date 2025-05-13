import {
  createListUsersCommand,
  ListUsersCommandDependencies,
} from "./list-users.command";

describe("ListUsersCommand", () => {
  it("should work as expected when listing users", async () => {
    // arrange
    const mockDependencies: ListUsersCommandDependencies = {
      usersService: {
        listUsers: vi.fn(async () => []),
      },
    };

    const listUsersCommand = createListUsersCommand(mockDependencies);

    // fetch the users
    const users = await listUsersCommand();

    // check that the users were given as a result
    expect(users).toEqual([]);

    // check that the underlying service was called
    expect(mockDependencies.usersService?.listUsers).toHaveBeenCalledOnce();
  });
});
