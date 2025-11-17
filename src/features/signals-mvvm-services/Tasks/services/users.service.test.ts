import { User } from "../types";
import { createUsersService } from "./users.service";
import { createUsersServiceMock } from "./users.service.mock";

describe.each([
  { id: "Real", createService: createUsersService },
  { id: "Mock", createService: createUsersServiceMock },
])("Users Service", ({ id, createService }) => {
  describe(`Users Service ${id}`, () => {
    it("should list users correctly", async () => {
      // arrange
      const initialUsers: User[] = [
        { id: "user-1", name: "Frank Doe", profileImageUrl: "/img/user-1.jpg" },
        {
          id: "user-2",
          name: "Jane Johnson",
          profileImageUrl: "/img/user-2.jpg",
        },
      ];

      const usersService = createService(initialUsers);

      // act
      const users = await usersService.listUsers();

      // assert
      expect(users).toEqual(initialUsers);
    });

    it("should get user by id correctly", async () => {
      // arrange
      const initialUsers: User[] = [
        { id: "user-1", name: "Frank Doe", profileImageUrl: "/img/user-1.jpg" },
        {
          id: "user-2",
          name: "Jane Johnson",
          profileImageUrl: "/img/user-2.jpg",
        },
      ];

      const usersService = createService(initialUsers);

      // act
      const user = await usersService.getUserById("user-1");

      // assert
      expect(user).toEqual({
        id: "user-1",
        name: "Frank Doe",
        profileImageUrl: "/img/user-1.jpg",
      });
    });
  });
});
