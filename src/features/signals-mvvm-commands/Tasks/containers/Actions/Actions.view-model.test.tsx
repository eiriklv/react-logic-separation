import { renderHook } from "@testing-library/react";
import React from "react";
import {
  ActionsViewModelContextInterface,
  ActionsViewModelContext,
} from "./Actions.view-model.context";
import { useActionsViewModel } from "./Actions.view-model";
import { signal } from "@preact/signals-core";

describe("useActionsViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const addTask = vi.fn();

    const mockDependencies: ActionsViewModelContextInterface = {
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
      <ActionsViewModelContext.Provider value={mockDependencies}>
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
