import { renderHook } from "@testing-library/react";
import React from "react";
import {
  TaskListViewModelContextInterface,
  TaskListViewModelContext,
} from "./TaskList.view-model.context";
import { useTaskListViewModel } from "./TaskList.view-model";
import { signal } from "@preact/signals-core";
import { Task } from "../../types";

describe("useTaskListViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    const mockTaskList: Task[] = [];
    const mockTaskListCount = 0;

    // arrange
    const mockDependencies: TaskListViewModelContextInterface = {
      tasksModel: {
        getTasksByOwnerId: vi.fn(() => signal(mockTaskList)),
        getTasksCountByOwnerId: vi.fn(() => signal(mockTaskListCount)),
        addTask: vi.fn(),
        isFetching: signal(false),
        isLoading: signal(false),
        isSaving: signal(false),
      },
      selectedFiltersModel: {
        selectedOwnerId: signal(""),
        setSelectedOwnerId: vi.fn(),
      },
    };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <TaskListViewModelContext.Provider value={mockDependencies}>
        {children}
      </TaskListViewModelContext.Provider>
    );

    const { result } = renderHook(() => useTaskListViewModel(), { wrapper });

    // assert
    expect(result.current).toEqual({
      tasks: [],
      tasksCount: 0,
      isLoading: false,
      isFetching: false,
      isSaving: false,
      addTask: mockDependencies.tasksModel?.addTask,
    });
  });
});
