import { renderHook } from "@testing-library/react";
import { RootViewModelDependencies, useRootViewModel } from "./Root.view-model";
import { QueryClient } from "@tanstack/query-core";

describe("useRootViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const queryClient = new QueryClient();
    const addTaskCommand = vi.fn();
    const deleteTaskCommand = vi.fn();
    const getUserCommand = vi.fn();
    const listTasksCommand = vi.fn();
    const listUsersCommand = vi.fn();

    const dependencies: RootViewModelDependencies = {
      createQueryClient: vi.fn(() => queryClient),
      createAddTaskCommand: vi.fn(() => addTaskCommand),
      createDeleteTaskCommand: vi.fn(() => deleteTaskCommand),
      createGetUserCommand: vi.fn(() => getUserCommand),
      createListTasksCommand: vi.fn(() => listTasksCommand),
      createListUsersCommand: vi.fn(() => listUsersCommand),
    };

    const { result } = renderHook(() => useRootViewModel({ dependencies }));

    expect(result.current).toEqual({
      commands: {
        addTaskCommand,
        deleteTaskCommand,
        getUserCommand,
        listTasksCommand,
        listUsersCommand,
      },
      queryClient,
    });
  });
});
