import { User } from "../types";
import { UserModelDependencies, useUserModel } from "./user.model";
import { createQueryClient } from "../utils/create-query-client";
import { createUsersServiceMock } from "../services/users.service.mock";
import { renderHook } from "@testing-library/react";

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

    const { result } = renderHook(() =>
      useUserModel(mockUserId, mockQueryClient, mockUserModelDependencies),
    );

    await vi.waitFor(() =>
      expect(result.current.user).toEqual(initialUsers[0]),
    );
  });
});
