import { User } from "../types";
import { useUserModel, UserModelDependencies } from "./user.model";
import { createQueryClient } from "../utils/create-query-client";
import { renderHook } from "@testing-library/react";

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
        getUserById: vi.fn(async () => mockUser),
      },
    };

    const mockQueryClient = createQueryClient();
    const mockUserId = "user-1";

    const { result } = renderHook(() =>
      useUserModel(mockUserId, mockQueryClient, mockUserModelDependencies),
    );

    expect(result.current.user).toBeUndefined();
    await vi.waitFor(() => expect(result.current.isLoading).toBe(true));
    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.user).toEqual(mockUser);
  });

  it("should expose error if initialization fails", async () => {
    // arrange
    const mockUserModelDependencies: UserModelDependencies = {
      usersService: {
        getUserById: vi.fn(async () => Promise.reject(new Error("Failed"))),
      },
    };

    const mockQueryClient = createQueryClient();
    const mockUserId = "user-1";

    const { result } = renderHook(() =>
      useUserModel(mockUserId, mockQueryClient, mockUserModelDependencies),
    );

    expect(result.current.user).toBeUndefined();
    await vi.waitFor(() => expect(result.current.isLoading).toBe(true));
    await vi.waitFor(() => expect(result.current.error).not.toEqual(null));
    expect(result.current.error).toEqual(new Error("Failed"));
  });
});
