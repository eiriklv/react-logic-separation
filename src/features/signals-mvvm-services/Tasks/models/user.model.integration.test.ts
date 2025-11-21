import { User } from "../types";
import { createUserModel, UserModelDependencies } from "./user.model";
import { createQueryClient } from "../utils/create-query-client";
import { createUsersServiceMock } from "../services/users.service.mock";

describe("UserModel", () => {
  it("should initialize correctly", async () => {
    // arrange
    const initialUsers: User[] = [
      {
        id: "user-1",
        name: "John Doe",
        profileImageUrl: "./src/profile.png",
      },
    ];

    const usersService = createUsersServiceMock(undefined, { initialUsers });

    const mockUserModelDependencies: UserModelDependencies = {
      usersService,
    };

    const mockQueryClient = createQueryClient();
    const mockUserId = "user-1";

    const userModel = createUserModel(
      mockUserId,
      mockQueryClient,
      mockUserModelDependencies,
    );

    await vi.waitFor(() =>
      expect(userModel.user.value).toEqual(initialUsers[0]),
    );
  });
});
