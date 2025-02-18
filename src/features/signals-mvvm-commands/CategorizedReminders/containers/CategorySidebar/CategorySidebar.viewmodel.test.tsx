import { renderHook } from "@testing-library/react";
import React from "react";
import {
  CategorySidebarViewModelContextInterface,
  CategorySidebarViewModelContext,
} from "./CategorySidebar.viewmodel.context";
import { useCategorySidebarViewModel } from "./CategorySidebar.viewmodel";
import { signal } from "@preact/signals-core";
import { PartialDeep } from "type-fest";

describe("useCategorySidebarViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const mockDependencies: PartialDeep<CategorySidebarViewModelContextInterface> =
      {
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
      <CategorySidebarViewModelContext.Provider
        value={mockDependencies as CategorySidebarViewModelContextInterface}
      >
        {children}
      </CategorySidebarViewModelContext.Provider>
    );

    const { result } = renderHook(() => useCategorySidebarViewModel(), {
      wrapper,
    });

    expect(result.current).toEqual({
      categories: [],
      selectedCategory: "",
      setSelectedCategory:
        mockDependencies.selectedCategoryModel?.setSelectedCategory,
    });
  });
});
