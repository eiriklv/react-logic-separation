import { User } from "../types";
import { GetUserCommand, GetUserCommandDependencies } from "./get-user.command";

describe("GetUserCommand", () => {
  it("should work as expected when getting a user by id", async () => {
    // arrange
    const mockUser: User = {
      id: "user-1",
      name: "John Doe",
      profileImageUrl: "./src/image.png",
    };

    const mockDependencies: GetUserCommandDependencies = {
      usersService: {
        getUserById: vi.fn(async () => ({
          id: "user-1",
          name: "John Doe",
          profileImageUrl: "./src/image.png",
        })),
      },
    };

    const getUserCommand = new GetUserCommand(mockDependencies);

    // get the user by id
    const user = await getUserCommand.invoke(mockUser.id);

    // check that the users were given as a result
    expect(user).toEqual(mockUser);

    // check that the underlying service was called
    expect(mockDependencies.usersService?.getUserById).toHaveBeenCalledWith(
      mockUser.id,
    );
  });
});
