import {
  ListUsersCommand,
  ListUsersCommandDependencies,
} from "./list-users.command";
import type { PartialDeep } from "type-fest";

describe("ListUsersCommand", () => {
  it("should work as expected when adding a reminder", async () => {
    // arrange
    const mockDependencies: PartialDeep<ListUsersCommandDependencies> = {
      usersService: {
        listUsers: vi.fn(async () => []),
      },
    };

    const listUsersCommand = new ListUsersCommand(
      mockDependencies as ListUsersCommandDependencies,
    );

    // fetch the reminders
    const reminders = await listUsersCommand.invoke();

    // check that the reminders were given as a result
    expect(reminders).toEqual([]);

    // check that the underlying service was called
    expect(mockDependencies.usersService?.listUsers).toHaveBeenCalledOnce();
  });
});
