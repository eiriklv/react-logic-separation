import { User } from "../types";
import { createUsersModel, UsersModelDependencies } from "./users.model";
import { createQueryClient } from "../utils/create-query-client";
import { createUsersServiceMock } from "../services/users.service.mock";

describe("UsersModel", () => {
  it("should initialize correctly", async () => {
    // arrange
    const initialUsers: User[] = [
      {
        id: "user-1",
        name: "John Doe",
        profileImageUrl: "./src/profile-1.png",
      },
      {
        id: "user-2",
        name: "Jane Doe",
        profileImageUrl: "./src/profile-2.png",
      },
    ];

    const usersService = createUsersServiceMock(undefined, {
      initialUsers,
    });

    const mockUsersModelDependencies: UsersModelDependencies = {
      usersService,
    };

    const mockQueryClient = createQueryClient();

    const usersModel = createUsersModel(
      mockQueryClient,
      mockUsersModelDependencies,
    );

    await vi.waitFor(() =>
      expect(usersModel.users.value).toEqual(initialUsers),
    );
  });
});
