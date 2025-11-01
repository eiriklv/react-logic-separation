import { renderHook, act } from "@testing-library/react";
import { useTaskItemViewModel } from "./TaskItem.view-model";
import { signal } from "@preact/signals-core";
import { Task } from "../../types";
import { QueryClient } from "@tanstack/query-core";
import {
  CommandsDependencies,
  ModelsDependencies,
  TaskItemViewModelDependencies,
} from "./TaskItem.view-model.dependencies";

/**
 * Remove the default dependencies from the test
 * so that we avoid the unnecessary collect-time
 */
vi.mock("./TaskItem.view-model.dependencies", () => ({ default: {} }));

describe("useTaskItemViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const deleteTask = vi.fn();

    const queryClient = new QueryClient();

    const commands: CommandsDependencies = {
      getUserCommand: vi.fn(),
    };

    const models: ModelsDependencies = {
      tasksModel: {
        deleteTask,
      },
    };

    const dependencies: TaskItemViewModelDependencies = {
      createUserModel: () => ({
        user: signal({
          id: "user-1",
          name: "John Doe",
          profileImageUrl: "./src/image.png",
        }),
      }),
      useCommands: () => commands,
      useModels: () => models,
      useQueryClient: () => queryClient,
    };

    const task: Task = {
      id: "1",
      text: "Buy milk",
      ownerId: "user-1",
    };

    const { result } = renderHook(() =>
      useTaskItemViewModel({ dependencies, task }),
    );

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
