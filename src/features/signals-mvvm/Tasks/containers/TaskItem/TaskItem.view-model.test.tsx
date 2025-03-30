import { renderHook, act } from "@testing-library/react";
import React from "react";
import {
  TaskItemViewModelContext,
  TaskItemViewModelContextInterface,
} from "./TaskItem.view-model.context";
import { useTaskItemViewModel } from "./TaskItem.view-model";
import { signal } from "@preact/signals-core";
import { Task } from "../../types";
import { IUserModel } from "../../models/user.model";
import { ITasksModel } from "../../models/tasks.model";

describe("useTaskItemViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const userModel: IUserModel = {
      user: signal({
        id: "user-1",
        name: "John Doe",
        profileImageUrl: "./src/image.png",
      }),
      isLoading: signal(false),
      error: signal(null),
    };

    const tasksModel: ITasksModel = {
      tasks: signal([]),
      tasksCount: signal(0),
      addTask: vi.fn(),
      deleteTask: vi.fn(),
      getTasksByOwnerId: vi.fn(),
      getTasksCountByOwnerId: vi.fn(),
      isFetching: signal(false),
      isLoading: signal(false),
      isSaving: signal(false),
    };

    const mockDependencies: TaskItemViewModelContextInterface = {
      tasksModel,
      createUserModel: () => userModel,
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
    expect(tasksModel.deleteTask).toBeCalledWith(task.id);
  });
});
