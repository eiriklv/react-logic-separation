import { renderHook } from "@testing-library/react";
import React from "react";
import {
  ActionsViewModelContextInterface,
  ActionsViewModelContext,
} from "./Actions.view-model.context";
import { useActionsViewModel } from "./Actions.view-model";
import { signal } from "@preact/signals-core";
import { PartialDeep } from "type-fest";

describe("useActionsViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const addTask = vi.fn();

    const mockDependencies: PartialDeep<ActionsViewModelContextInterface> = {
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
      <ActionsViewModelContext.Provider
        value={mockDependencies as ActionsViewModelContextInterface}
      >
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
