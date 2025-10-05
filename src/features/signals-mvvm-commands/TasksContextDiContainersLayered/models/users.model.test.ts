import { User } from "../types";
import { createUsersModel, UsersModelDependencies } from "./users.model";
import { createQueryClient } from "../utils/create-query-client";

describe("UsersModel", () => {
  it("should initialize correctly", async () => {
    // arrange
    const mockUsers: User[] = [
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

    const mockUsersModelDependencies: UsersModelDependencies = {
      listUsersCommand: vi.fn(async () => mockUsers),
    };

    const mockQueryClient = createQueryClient();

    const usersModel = createUsersModel(
      mockQueryClient,
      mockUsersModelDependencies,
    );

    expect(usersModel.users.value).toBeUndefined();
    await vi.waitFor(() => expect(usersModel.isLoading.value).toBe(true));
    await vi.waitFor(() => expect(usersModel.isLoading.value).toBe(false));
    expect(usersModel.users.value).toEqual(mockUsers);
  });

  it("should expose error if initialization fails", async () => {
    // arrange
    const mockUsersModelDependencies: UsersModelDependencies = {
      listUsersCommand: vi.fn(async () => Promise.reject(new Error("Failed"))),
    };

    const mockQueryClient = createQueryClient();

    const usersModel = createUsersModel(
      mockQueryClient,
      mockUsersModelDependencies,
    );

    expect(usersModel.users.value).toBeUndefined();
    await vi.waitFor(() => expect(usersModel.isLoading.value).toBe(true));
    await vi.waitFor(() => expect(usersModel.error.value).not.toBe(null));
    expect(usersModel.error.value).toEqual(new Error("Failed"));
  });
});
