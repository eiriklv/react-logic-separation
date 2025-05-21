import { User } from "../types";
import { createUsersService, UsersServiceDependencies } from "./users.service";

describe("Users Service", () => {
  it("should list users correctly", async () => {
    // arrange
    const initialUsers: User[] = [];

    const usersServiceDependencies: UsersServiceDependencies = {
      delay: 0,
    };

    const usersService = createUsersService(
      usersServiceDependencies,
      initialUsers,
    );

    // act
    const users = await usersService.listUsers();

    // assert
    expect(users).toEqual(initialUsers);
  });

  it("should get user by id correctly", async () => {
    // arrange
    const initialUsers: User[] = [
      { id: "user-1", name: "User 1", profileImageUrl: "/src/img.png" },
    ];

    const usersServiceDependencies: UsersServiceDependencies = {
      delay: 0,
    };

    const usersService = createUsersService(
      usersServiceDependencies,
      initialUsers,
    );

    // act
    const user = await usersService.getUserById("user-1");

    // assert
    expect(user).toEqual({
      id: "user-1",
      name: "User 1",
      profileImageUrl: "/src/img.png",
    });
  });
});
