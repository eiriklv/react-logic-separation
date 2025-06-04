import { renderHook, act } from "@testing-library/react";
import {
  CommandsDependencies,
  ModelsDependencies,
  useTaskItemViewModel,
} from "./TaskItem.view-model";
import { signal } from "@preact/signals-core";
import { Task } from "../../types";
import {
  ModelsContext,
  ModelsContextInterface,
} from "../../providers/models.provider";
import {
  CommandsContext,
  CommandsContextInterface,
} from "../../providers/commands.provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { TaskItemViewModelContext } from "./TaskItem.view-model.context";
import { createQueryClient } from "../../utils/create-query-client";
import { TaskItemViewModelDependencies } from "./TaskItem.view-model.dependencies";

/**
 * Optional: Remove the default dependencies from the test
 * so that we avoid the unnecessary collect-time
 */
vi.mock("./TaskItem.view-model.dependencies", () => ({ default: {} }));

describe("useTaskItemViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const deleteTask = vi.fn();

    const queryClient = createQueryClient();

    const dependencies: TaskItemViewModelDependencies = {
      createUserModel: () => ({
        user: signal({
          id: "user-1",
          name: "John Doe",
          profileImageUrl: "./src/image.png",
        }),
      }),
    };

    const mockCommands: CommandsDependencies = {
      getUserCommand: vi.fn(),
    };

    const mockModels: ModelsDependencies = {
      tasksModel: {
        deleteTask,
      },
    };

    const task: Task = {
      id: "1",
      text: "Buy milk",
      ownerId: "user-1",
    };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <CommandsContext.Provider
          value={mockCommands as CommandsContextInterface}
        >
          <ModelsContext.Provider value={mockModels as ModelsContextInterface}>
            <TaskItemViewModelContext.Provider value={dependencies}>
              {children}
            </TaskItemViewModelContext.Provider>
          </ModelsContext.Provider>
        </CommandsContext.Provider>
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useTaskItemViewModel({ task }), {
      wrapper,
    });

    // assert
    expect(result.current.user).toEqual({
      id: "user-1",
      name: "John Doe",
      profileImageUrl: "./src/image.png",
    });

    // call delete handler
    await act(() => result.current.deleteTask());

    // assert
    expect(deleteTask).toBeCalledWith(task.id);
  });
});
