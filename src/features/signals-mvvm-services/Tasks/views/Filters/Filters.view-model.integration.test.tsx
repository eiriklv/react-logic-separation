import { renderHook } from "@testing-library/react";
import { useFiltersViewModel } from "./Filters.view-model";
import { signal } from "@preact/signals-core";
import defaultDependencies, {
  FiltersViewModelDependencies,
  ModelsDependencies,
} from "./Filters.view-model.dependencies";
import { ModelsProvider } from "../../providers/models.provider";
import { ModelsContextInterface } from "../../providers/models.context";

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
        <ModelsProvider models={models as ModelsContextInterface}>
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
