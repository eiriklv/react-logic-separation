import { renderHook } from "@testing-library/react";
import { useFiltersViewModel } from "./Filters.view-model";
import defaultDependencies, {
  FiltersViewModelDependencies,
  ModelsDependencies,
} from "./Filters.view-model.dependencies";
import {
  ModelsContextInterface,
  ModelsProvider,
} from "../../providers/models.provider";

describe("useFiltersViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const setSelectedOwnerId = vi.fn();

    const models: ModelsDependencies = {
      usersModel: {
        users: [],
      },
      selectedFiltersModel: {
        selectedOwnerId: "",
        setSelectedOwnerId,
      },
    };

    const dependencies: FiltersViewModelDependencies = {
      useModels: defaultDependencies.useModels,
    };

    const { result } = renderHook(() => useFiltersViewModel({ dependencies }), {
      wrapper: ({ children }) => (
        <ModelsProvider value={models as ModelsContextInterface}>
          {children}
        </ModelsProvider>
      ),
    });

    expect(result.current).toEqual({
      users: [],
      selectedOwnerId: "",
      setSelectedOwnerId,
    });
  });
});
