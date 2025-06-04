import { renderHook } from "@testing-library/react";
import {
  ModelsDependencies,
  useTaskListViewModel,
} from "./TaskList.view-model";
import { signal } from "@preact/signals-core";
import { Task } from "../../types";
import {
  ModelsContext,
  ModelsContextInterface,
} from "../../providers/models.provider";

describe("useTaskListViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    const mockTaskList: Task[] = [];
    const mockTaskListCount = 0;

    // arrange
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

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <ModelsContext.Provider value={mockModels as ModelsContextInterface}>
        {children}
      </ModelsContext.Provider>
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
