import { renderHook, act } from "@testing-library/react";
import React from "react";
import {
  TaskItemViewModelContext,
  TaskItemViewModelContextInterface,
} from "./TaskItem.view-model.context";
import { useTaskItemViewModel } from "./TaskItem.view-model";
import { signal } from "@preact/signals-core";
import { Task } from "../../types";

describe("useTaskItemViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const deleteTask = vi.fn();

    const mockDependencies: TaskItemViewModelContextInterface = {
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

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <TaskItemViewModelContext.Provider value={mockDependencies}>
        {children}
      </TaskItemViewModelContext.Provider>
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
