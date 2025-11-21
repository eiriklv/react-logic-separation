import { User } from "../types";
import { createUsersService, SdkDependencies } from "./users.service";
import { UsersServiceDependencies } from "./users.service.dependencies";
import { createUsersServiceMock } from "./users.service.mock";

/**
 * TODO(eiriklv): Add integration tests in separate file using real SDK instance
 * and real dependencies (none in this case) to ensure that it integrates correctly
 */
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

      const mockSdk: SdkDependencies = {
        listUsers: vi
          .fn<SdkDependencies["listUsers"]>()
          .mockResolvedValueOnce(initialUsers),
        retrieveUserById: vi.fn(),
      };

      const usersServiceDependencies: UsersServiceDependencies = {
        initialUsers,
      };

      const usersService = createService(mockSdk, usersServiceDependencies);

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

      const mockSdk: SdkDependencies = {
        listUsers: vi.fn(),
        retrieveUserById: vi
          .fn<SdkDependencies["retrieveUserById"]>()
          .mockResolvedValueOnce(initialUsers[0]),
      };

      const usersServiceDependencies: UsersServiceDependencies = {
        initialUsers,
      };

      const usersService = createService(mockSdk, usersServiceDependencies);

      // act
      const user = await usersService.getUserById(initialUsers[0].id);

      // assert
      expect(user).toEqual(initialUsers[0]);
    });

    it("should handle missing user", async () => {
      // arrange
      const initialUsers: User[] = [
        { id: "user-1", name: "Frank Doe", profileImageUrl: "/img/user-1.jpg" },
        {
          id: "user-2",
          name: "Jane Johnson",
          profileImageUrl: "/img/user-2.jpg",
        },
      ];

      const mockSdk: SdkDependencies = {
        listUsers: vi.fn(),
        retrieveUserById: vi
          .fn<SdkDependencies["retrieveUserById"]>()
          .mockResolvedValueOnce(undefined),
      };

      const usersServiceDependencies: UsersServiceDependencies = {
        initialUsers,
      };

      const usersService = createService(mockSdk, usersServiceDependencies);

      // act
      const user = await usersService.getUserById("missing");

      // assert
      expect(user).toEqual(undefined);
    });
  });
});
