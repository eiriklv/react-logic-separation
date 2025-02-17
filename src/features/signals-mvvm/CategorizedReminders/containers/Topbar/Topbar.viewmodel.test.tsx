import { renderHook } from "@testing-library/react";
import React from "react";
import {
  TopbarViewModelContextInterface,
  TopbarViewModelContext,
} from "./Topbar.viewmodel.context";
import { useTopbarViewModel } from "./Topbar.viewmodel";
import { signal } from "@preact/signals-core";
import { PartialDeep } from "type-fest";

describe("useTopbarViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const mockDependencies: PartialDeep<TopbarViewModelContextInterface> = {
      remindersModel: {
        categories: signal([]),
      },
      selectedCategoryModel: {
        selectedCategory: signal(""),
        setSelectedCategory: vi.fn(),
      },
    };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <TopbarViewModelContext.Provider
        value={mockDependencies as TopbarViewModelContextInterface}
      >
        {children}
      </TopbarViewModelContext.Provider>
    );

    const { result } = renderHook(() => useTopbarViewModel(), { wrapper });

    expect(result.current).toEqual({
      categories: [],
      selectedCategory: "",
      setSelectedCategory:
        mockDependencies.selectedCategoryModel?.setSelectedCategory,
    });
  });
});
