import { renderHook } from "@testing-library/react";
import { useTaskListViewModel } from "./TaskList.view-model";
import { signal } from "@preact/signals-core";
import { Task } from "../../types";
import {
  ModelsDependencies,
  TaskListViewModelDependencies,
} from "./TaskList.view-model.dependencies";

/**
 * Remove the default dependencies from the test
 * so that we avoid the unnecessary collect-time
 */
vi.mock("./TaskList.view-model.dependencies", () => ({ default: {} }));

describe("useTaskListViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    const mockTaskList: Task[] = [];
    const mockTaskListCount = 0;

    // arrange
    const models: ModelsDependencies = {
      tasksModel: {
        getTasksByOwnerId: vi.fn(() => signal(mockTaskList)),
        getTasksCountByOwnerId: vi.fn(() => signal(mockTaskListCount)),
        isFetching: signal(false),
        isLoading: signal(false),
        isSaving: signal(false),
      },
      selectedFiltersModel: {
        selectedOwnerId: signal(""),
        setSelectedOwnerId: vi.fn(),
      },
    };

    const dependencies: TaskListViewModelDependencies = {
      useModels: () => models,
    };

    const { result } = renderHook(() => useTaskListViewModel({ dependencies }));

    // assert
    expect(result.current).toEqual({
      tasks: [],
      tasksCount: 0,
      isLoading: false,
      isFetching: false,
      isSaving: false,
    });
  });
});
