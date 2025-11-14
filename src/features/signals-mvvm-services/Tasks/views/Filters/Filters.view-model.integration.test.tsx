import { renderHook } from "@testing-library/react";
import { useFiltersViewModel } from "./Filters.view-model";
import { signal } from "@preact/signals-core";
import defaultDependencies, {
  FiltersViewModelDependencies,
  ModelsDependencies,
} from "./Filters.view-model.dependencies";
import {
  ModelsContext,
  ModelsContextInterface,
} from "../../providers/models.provider";

describe("useFiltersViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const setSelectedOwnerId = vi.fn();

    const models: ModelsDependencies = {
      usersModel: {
        users: signal([]),
      },
      selectedFiltersModel: {
        selectedOwnerId: signal(""),
        setSelectedOwnerId,
      },
    };

    const dependencies: FiltersViewModelDependencies = {
      useModels: defaultDependencies.useModels,
    };

    const { result } = renderHook(() => useFiltersViewModel({ dependencies }), {
      wrapper: ({ children }) => (
        <ModelsContext.Provider value={models as ModelsContextInterface}>
          {children}
        </ModelsContext.Provider>
      ),
    });

    expect(result.current).toEqual({
      users: [],
      selectedOwnerId: "",
      setSelectedOwnerId,
    });
  });
});
