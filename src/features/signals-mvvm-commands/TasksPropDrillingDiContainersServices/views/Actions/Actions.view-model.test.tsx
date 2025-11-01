import { renderHook } from "@testing-library/react";
import { signal } from "@preact/signals-core";
import { useActionsViewModel } from "./Actions.view-model";
import {
  ActionsViewModelDependencies,
  ModelsDependencies,
} from "./Actions.view-model.dependencies";

describe("useActionsViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const addTask = vi.fn();

    const models: ModelsDependencies = {
      tasksModel: {
        addTask,
      },
      usersModel: {
        users: signal([]),
      },
    };

    const dependencies: ActionsViewModelDependencies = {
      useModels: () => models,
    };

    const { result } = renderHook(() => useActionsViewModel({ dependencies }));

    expect(result.current).toEqual({
      users: [],
      addTask,
    });
  });
});
