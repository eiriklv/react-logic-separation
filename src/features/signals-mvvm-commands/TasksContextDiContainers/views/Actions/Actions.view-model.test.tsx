import { renderHook } from "@testing-library/react";
import { ModelsDependencies, useActionsViewModel } from "./Actions.view-model";
import { signal } from "@preact/signals-core";
import { ModelsContext } from "../../providers/models.provider";

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

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <ModelsContext.Provider value={mockModels}>
        {children}
      </ModelsContext.Provider>
    );

    const { result } = renderHook(() => useActionsViewModel(), { wrapper });

    expect(result.current).toEqual({
      users: [],
      addTask,
    });
  });
});
