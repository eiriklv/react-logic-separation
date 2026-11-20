import { renderHook } from "@testing-library/react";
import { useTaskListViewModel } from "./TaskList.view-model";
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
        useTasksByOwnerId: vi.fn(() => mockTaskList),
        useTasksCountByOwnerId: vi.fn(() => mockTaskListCount),
        isFetching: false,
        isLoading: false,
        isSaving: false,
      },
      selectedFiltersModel: {
        selectedOwnerId: "",
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
