import { renderHook } from "@testing-library/react";
import { useRootViewModel } from "./Root.view-model";
import { QueryClient } from "@tanstack/query-core";
import {
  RootViewModelContext,
  RootViewModelContextInterface,
} from "./Root.view-model.context";

describe("useRootViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const queryClient = new QueryClient();
    const addTaskCommand = vi.fn();
    const deleteTaskCommand = vi.fn();
    const getUserCommand = vi.fn();
    const listTasksCommand = vi.fn();
    const listUsersCommand = vi.fn();

    const dependencies: RootViewModelContextInterface = {
      createQueryClient: vi.fn(() => queryClient),
      createAddTaskCommand: vi.fn(() => addTaskCommand),
      createDeleteTaskCommand: vi.fn(() => deleteTaskCommand),
      createGetUserCommand: vi.fn(() => getUserCommand),
      createListTasksCommand: vi.fn(() => listTasksCommand),
      createListUsersCommand: vi.fn(() => listUsersCommand),
    };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <RootViewModelContext.Provider value={dependencies}>
        {children}
      </RootViewModelContext.Provider>
    );

    const { result } = renderHook(() => useRootViewModel(), { wrapper });

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
