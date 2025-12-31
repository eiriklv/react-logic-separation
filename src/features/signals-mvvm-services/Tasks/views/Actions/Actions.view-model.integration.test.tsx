import { renderHook } from "@testing-library/react";
import { signal } from "@preact/signals-core";
import { useActionsViewModel } from "./Actions.view-model";
import defaultDependencies, {
  ActionsViewModelDependencies,
  ModelsDependencies,
} from "./Actions.view-model.dependencies";
import { ModelsProvider } from "../../providers/models.provider";
import { ModelsContextInterface } from "../../providers/models.context";

describe("useActionsViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const models: ModelsDependencies = {
      tasksModel: {
        addTask: vi.fn(),
      },
      usersModel: {
        users: signal([]),
      },
    };

    const dependencies: ActionsViewModelDependencies = {
      useModels: defaultDependencies.useModels,
    };

    const { result } = renderHook(() => useActionsViewModel({ dependencies }), {
      wrapper: ({ children }) => (
        <ModelsProvider models={models as ModelsContextInterface}>
          {children}
        </ModelsProvider>
      ),
    });

    expect(result.current).toEqual({
      users: [],
      addTask: models.tasksModel.addTask,
    });
  });
});
