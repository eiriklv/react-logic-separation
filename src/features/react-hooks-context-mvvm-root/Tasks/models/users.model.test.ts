import { User } from "../types";
import { useUsersModel, UsersModelDependencies } from "./users.model";
import { createQueryClient } from "../utils/create-query-client";
import { renderHook } from "@testing-library/react";

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
      usersService: {
        listUsers: vi.fn(async () => mockUsers),
      },
    };

    const mockQueryClient = createQueryClient();

    const { result } = renderHook(() =>
      useUsersModel(mockQueryClient, mockUsersModelDependencies),
    );

    expect(result.current.users).toBeUndefined();
    await vi.waitFor(() => expect(result.current.isLoading).toBe(true));
    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.users).toEqual(mockUsers);
  });

  it("should expose error if initialization fails", async () => {
    // arrange
    const mockUsersModelDependencies: UsersModelDependencies = {
      usersService: {
        listUsers: vi.fn(async () => Promise.reject(new Error("Failed"))),
      },
    };

    const mockQueryClient = createQueryClient();

    const { result } = renderHook(() =>
      useUsersModel(mockQueryClient, mockUsersModelDependencies),
    );

    expect(result.current.users).toBeUndefined();
    await vi.waitFor(() => expect(result.current.isLoading).toBe(true));
    await vi.waitFor(() => expect(result.current.error).not.toBe(null));
    expect(result.current.error).toEqual(new Error("Failed"));
  });
});
