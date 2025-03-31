import { renderHook } from "@testing-library/react";
import {
  ActionsViewModelDependencies,
  useActionsViewModel,
} from "./Actions.view-model";
import { signal } from "@preact/signals-core";

describe("useActionsViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const addTask = vi.fn();

    const dependencies: ActionsViewModelDependencies = {
      tasksModel: {
        addTask,
      },
      usersModel: {
        users: signal([]),
      },
    };

    const { result } = renderHook(() => useActionsViewModel({ dependencies }));

    expect(result.current).toEqual({
      users: [],
      addTask,
    });
  });
});
