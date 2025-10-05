import { renderHook } from "@testing-library/react";
import { useTaskListViewModel } from "./TaskList.view-model";
import { signal } from "@preact/signals-core";
import { Task } from "../../types";
import { TaskListViewModelContext } from "./TaskList.view-model.context";
import {
  ModelsDependencies,
  TaskListViewModelDependencies,
} from "./TaskList.view-model.dependencies";

/**
 * Optional: Remove the default dependencies from the test
 * so that we avoid the unnecessary collect-time
 */
vi.mock("./TaskList.view-model.dependencies", () => ({ default: {} }));

describe("useTaskListViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const mockTaskList: Task[] = [];
    const mockTaskListCount = 0;

    const mockModels: ModelsDependencies = {
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

    const dependencies: TaskListViewModelDependencies = {
      useModels: vi.fn(() => mockModels),
    };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <TaskListViewModelContext.Provider value={dependencies}>
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
      addTask: mockModels.tasksModel?.addTask,
    });
  });
});
