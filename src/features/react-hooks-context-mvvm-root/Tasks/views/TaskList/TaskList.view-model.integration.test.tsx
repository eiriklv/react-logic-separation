import { renderHook } from "@testing-library/react";
import { useTaskListViewModel } from "./TaskList.view-model";
import { Task } from "../../types";
import defaultDependencies, {
  ModelsDependencies,
  TaskListViewModelDependencies,
} from "./TaskList.view-model.dependencies";
import {
  ModelsContextInterface,
  ModelsProvider,
} from "../../providers/models.provider";

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
      useModels: defaultDependencies.useModels,
    };

    const { result } = renderHook(
      () => useTaskListViewModel({ dependencies }),
      {
        wrapper: ({ children }) => (
          <ModelsProvider value={models as ModelsContextInterface}>
            {children}
          </ModelsProvider>
        ),
      },
    );

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
