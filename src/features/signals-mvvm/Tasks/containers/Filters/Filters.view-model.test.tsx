import { renderHook } from "@testing-library/react";
import React from "react";
import {
  FiltersViewModelContextInterface,
  FiltersViewModelContext,
} from "./Filters.view-model.context";
import { useFiltersViewModel } from "./Filters.view-model";
import { signal } from "@preact/signals-core";
import { PartialDeep } from "type-fest";

describe("useFiltersViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const setSelectedOwnerId = vi.fn();

    const mockDependencies: PartialDeep<FiltersViewModelContextInterface> = {
      usersModel: {
        users: signal([]),
      },
      selectedFiltersModel: {
        selectedOwnerId: signal(""),
        setSelectedOwnerId,
      },
    };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <FiltersViewModelContext.Provider
        value={mockDependencies as FiltersViewModelContextInterface}
      >
        {children}
      </FiltersViewModelContext.Provider>
    );

    const { result } = renderHook(() => useFiltersViewModel(), { wrapper });

    expect(result.current).toEqual({
      users: [],
      selectedOwnerId: "",
      setSelectedOwnerId,
    });
  });
});
