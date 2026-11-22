import { renderHook } from "@testing-library/react";
import { useFiltersViewModel } from "./Filters.view-model";
import {
  FiltersViewModelDependencies,
  ModelsDependencies,
} from "./Filters.view-model.dependencies";

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
      useModels: () => models,
    };

    const { result } = renderHook(() => useFiltersViewModel({ dependencies }));

    expect(result.current).toEqual({
      users: [],
      selectedOwnerId: "",
      setSelectedOwnerId,
    });
  });
});
