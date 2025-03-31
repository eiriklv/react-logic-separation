import { renderHook, act } from "@testing-library/react";
import {
  TaskItemViewModelDependencies,
  useTaskItemViewModel,
} from "./TaskItem.view-model";
import { signal } from "@preact/signals-core";
import { Task } from "../../types";

describe("useTaskItemViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const deleteTask = vi.fn();

    const dependencies: TaskItemViewModelDependencies = {
      tasksModel: {
        deleteTask,
      },
      createUserModel: () => ({
        user: signal({
          id: "user-1",
          name: "John Doe",
          profileImageUrl: "./src/image.png",
        }),
      }),
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
