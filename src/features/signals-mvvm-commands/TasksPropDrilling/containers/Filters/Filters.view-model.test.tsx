import { renderHook } from "@testing-library/react";
import {
  FiltersViewModelDependencies,
  useFiltersViewModel,
} from "./Filters.view-model";
import { signal } from "@preact/signals-core";

describe("useFiltersViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const setSelectedOwnerId = vi.fn();

    const dependencies: FiltersViewModelDependencies = {
      usersModel: {
        users: signal([]),
      },
      selectedFiltersModel: {
        selectedOwnerId: signal(""),
        setSelectedOwnerId,
      },
    };

    const { result } = renderHook(() => useFiltersViewModel({ dependencies }));

    expect(result.current).toEqual({
      users: [],
      selectedOwnerId: "",
      setSelectedOwnerId,
    });
  });
});
