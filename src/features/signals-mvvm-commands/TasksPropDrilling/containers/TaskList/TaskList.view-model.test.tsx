import { renderHook } from "@testing-library/react";
import {
  TaskListViewModelDependencies,
  useTaskListViewModel,
} from "./TaskList.view-model";
import { signal } from "@preact/signals-core";
import { Task } from "../../types";

describe("useTaskListViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    const mockTaskList: Task[] = [];
    const mockTaskListCount = 0;

    // arrange
    const dependencies: TaskListViewModelDependencies = {
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

    const { result } = renderHook(() => useTaskListViewModel({ dependencies }));

    // assert
    expect(result.current).toEqual({
      tasks: [],
      tasksCount: 0,
      isLoading: false,
      isFetching: false,
      isSaving: false,
      addTask: dependencies.tasksModel?.addTask,
    });
  });
});
