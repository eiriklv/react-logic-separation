import { renderHook } from "@testing-library/react";
import { useRootViewModel } from "./Root.view-model";
import { QueryClient } from "@tanstack/query-core";
import { ITasksService } from "../../services/tasks.service";
import { IUsersService } from "../../services/users.service";
import type { RootViewModelDependencies } from "./Root.view-model.dependencies";

/**
 * Remove the default dependencies from the test
 * so that we avoid the unnecessary collect-time
 */
vi.mock("./Root.view-model.dependencies", () => ({ default: {} }));

describe("useRootViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const queryClient = new QueryClient();
    const tasksService = {} as ITasksService;
    const usersService = {} as IUsersService;
    const deleteTaskCommand = vi.fn();
    const getUserCommand = vi.fn();
    const listTasksCommand = vi.fn();
    const listUsersCommand = vi.fn();

    const dependencies: RootViewModelDependencies = {
      createQueryClient: vi.fn(() => queryClient),
      createTasksService: vi.fn(() => tasksService),
      createUsersService: vi.fn(() => usersService),
      createDeleteTaskCommand: vi.fn(() => deleteTaskCommand),
      createGetUserCommand: vi.fn(() => getUserCommand),
      createListTasksCommand: vi.fn(() => listTasksCommand),
      createListUsersCommand: vi.fn(() => listUsersCommand),
    };

    const { result } = renderHook(() => useRootViewModel({ dependencies }));

    expect(result.current).toEqual({
      services: {
        tasksService,
        usersService,
      },
      commands: {
        deleteTaskCommand,
        getUserCommand,
        listTasksCommand,
        listUsersCommand,
      },
      queryClient,
    });
  });
});
