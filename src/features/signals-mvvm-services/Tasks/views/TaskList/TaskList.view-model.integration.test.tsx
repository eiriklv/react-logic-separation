import { renderHook } from "@testing-library/react";
import { useTaskListViewModel } from "./TaskList.view-model";
import { signal } from "@preact/signals-core";
import { Task } from "../../types";
import defaultDependencies, {
  ModelsDependencies,
  TaskListViewModelDependencies,
} from "./TaskList.view-model.dependencies";
import { ModelsProvider } from "../../providers/models.provider";
import { ModelsContextInterface } from "../../providers/models.context";

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
      useModels: defaultDependencies.useModels,
    };

    const { result } = renderHook(
      () => useTaskListViewModel({ dependencies }),
      {
        wrapper: ({ children }) => (
          <ModelsProvider models={models as ModelsContextInterface}>
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
