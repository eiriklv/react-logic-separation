import { renderHook } from "@testing-library/react";
import { useRootViewModel } from "./Root.view-model";
import { RootViewModelContext } from "./Root.view-model.context";
import { createQueryClient } from "../../utils/create-query-client";
import { RootViewModelDependencies } from "./Root.view-model.dependencies";
import { ITasksService } from "../../services/tasks.service";
import { IUsersService } from "../../services/users.service";

/**
 * Optional: Remove the default dependencies from the test
 * so that we avoid the unnecessary collect-time and side-effects
 */
vi.mock("./Root.view-model.dependencies", () => ({ default: {} }));

describe("useRootViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const queryClient = createQueryClient();
    const tasksService = {} as ITasksService;
    const usersService = {} as IUsersService;
    const addTaskCommand = vi.fn();
    const deleteTaskCommand = vi.fn();
    const getUserCommand = vi.fn();
    const listTasksCommand = vi.fn();
    const listUsersCommand = vi.fn();

    const dependencies: RootViewModelDependencies = {
      createQueryClient: vi.fn(() => queryClient),
      createTasksService: vi.fn(() => tasksService),
      createUsersService: vi.fn(() => usersService),
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
