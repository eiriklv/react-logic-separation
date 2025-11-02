import { User } from "../types";
import { createUsersService } from "./users.service";

describe("Users Service", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should list users correctly", async () => {
    // arrange
    const initialUsers: User[] = [];

    const usersService = createUsersService(initialUsers);

    // act
    const usersPromise = usersService.listUsers();
    await vi.runAllTimersAsync();
    const users = await usersPromise;

    // assert
    expect(users).toEqual(initialUsers);
  });

  it("should get user by id correctly", async () => {
    // arrange
    const initialUsers: User[] = [
      { id: "user-1", name: "User 1", profileImageUrl: "/src/img.png" },
    ];

    const usersService = createUsersService(initialUsers);

    // act
    const userPromise = usersService.getUserById("user-1");
    await vi.runAllTimersAsync();
    const user = await userPromise;

    // assert
    expect(user).toEqual({
      id: "user-1",
      name: "User 1",
      profileImageUrl: "/src/img.png",
    });
  });
});
