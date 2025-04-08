import { renderHook, act } from "@testing-library/react";
import {
  ModelsDependencies,
  TaskItemViewModelDependencies,
  useTaskItemViewModel,
} from "./TaskItem.view-model";
import { signal } from "@preact/signals-core";
import { Task } from "../../types";
import { ModelsContext } from "../../providers/models.provider";

describe("useTaskItemViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const deleteTask = vi.fn();

    const dependencies: TaskItemViewModelDependencies = {
      createUserModel: () => ({
        user: signal({
          id: "user-1",
          name: "John Doe",
          profileImageUrl: "./src/image.png",
        }),
      }),
    };

    const mockModels: ModelsDependencies = {
      tasksModel: {
        deleteTask,
      },
    };

    const task: Task = {
      id: "1",
      text: "Buy milk",
      ownerId: "user-1",
    };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <ModelsContext.Provider value={mockModels}>
        {children}
      </ModelsContext.Provider>
    );

    const { result } = renderHook(
      () => useTaskItemViewModel({ dependencies, task }),
      { wrapper },
    );

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
