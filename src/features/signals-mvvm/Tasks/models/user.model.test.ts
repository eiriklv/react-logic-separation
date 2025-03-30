import { User } from "../types";
import { QueryClient } from "@tanstack/query-core";
import { UserModel, UserModelDependencies } from "./user.model";

describe("UserModel", () => {
  it("should initialize correctly", async () => {
    // arrange
    const mockUser: User = {
      id: "user-1",
      name: "John Doe",
      profileImageUrl: "./src/profile.png",
    };

    const mockUserModelDependencies: UserModelDependencies = {
      usersService: {
        listUsers: vi.fn(),
        getUserById: vi.fn(async () => mockUser),
      },
    };

    const mockQueryClient = new QueryClient();
    const mockUserId = "user-1";

    const userModel = new UserModel(
      mockUserId,
      mockQueryClient,
      mockUserModelDependencies,
    );

    expect(userModel.user.value).toBeUndefined();
    await vi.waitFor(() => expect(userModel.isLoading.value).toBe(true));
    await vi.waitFor(() => expect(userModel.isLoading.value).toBe(false));
    expect(userModel.user.value).toEqual(mockUser);
  });

  it("should expose error if initialization fails", async () => {
    // arrange
    const mockUserModelDependencies: UserModelDependencies = {
      usersService: {
        listUsers: vi.fn(),
        getUserById: vi.fn(async () => Promise.reject(new Error("Failed"))),
      },
    };

    const mockQueryClient = new QueryClient();
    const mockUserId = "user-1";

    const userModel = new UserModel(
      mockUserId,
      mockQueryClient,
      mockUserModelDependencies,
    );

    expect(userModel.user.value).toBeUndefined();
    await vi.waitFor(() => expect(userModel.isLoading.value).toBe(true));
    await vi.waitFor(() => expect(userModel.error.value).not.toEqual(null));
    expect(userModel.error.value).toEqual(new Error("Failed"));
  });
});
