import { renderHook } from "@testing-library/react";
import React from "react";
import {
  CategorySidebarViewModelContextInterface,
  CategorySidebarViewModelContext,
} from "./CategorySidebar.viewmodel.context";
import { useCategorySidebarViewModel } from "./CategorySidebar.viewmodel";
import { RemindersModel } from "../../models/reminders-model";
import { SelectedCategoryModel } from "../../models/selected-category-model";
import { signal } from "@preact/signals-core";

describe("useCategorySidebarViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const remindersModel: Partial<RemindersModel> = {
      categories: signal(["home", "work"]),
    };

    const selectedCategoryModel: Partial<SelectedCategoryModel> = {
      selectedCategory: signal("test"),
      setSelectedCategory: vi.fn(),
    };

    const mockDependencies: CategorySidebarViewModelContextInterface = {
      remindersModel: remindersModel as RemindersModel,
      selectedCategoryModel: selectedCategoryModel as SelectedCategoryModel,
    };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <CategorySidebarViewModelContext.Provider value={mockDependencies}>
        {children}
      </CategorySidebarViewModelContext.Provider>
    );

    const { result } = renderHook(() => useCategorySidebarViewModel(), {
      wrapper,
    });

    expect(result.current).toEqual({
      categories: ["home", "work"],
      selectedCategory: "test",
      setSelectedCategory: selectedCategoryModel.setSelectedCategory,
    });
  });
});
