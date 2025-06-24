import { renderHook } from "@testing-library/react";
import { useActionsViewModel } from "./Actions.view-model";
import { signal } from "@preact/signals-core";
import {
  ActionsViewModelDependencies,
  ModelsDependencies,
} from "./Actions.view-model.dependencies";
import { ActionsViewModelContext } from "./Actions.view-model.context";

/**
 * Optional: Remove the default dependencies from the test
 * so that we avoid the unnecessary collect-time
 */
vi.mock("./Actions.view-model.dependencies", () => ({ default: {} }));

describe("useActionsViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const addTask = vi.fn();

    const mockModels: ModelsDependencies = {
      tasksModel: {
        addTask,
      },
      usersModel: {
        users: signal([]),
      },
    };

    const dependencies: ActionsViewModelDependencies = {
      useModels: vi.fn(() => mockModels),
    };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <ActionsViewModelContext.Provider value={dependencies}>
        {children}
      </ActionsViewModelContext.Provider>
    );

    const { result } = renderHook(() => useActionsViewModel(), { wrapper });

    expect(result.current).toEqual({
      users: [],
      addTask,
    });
  });
});
