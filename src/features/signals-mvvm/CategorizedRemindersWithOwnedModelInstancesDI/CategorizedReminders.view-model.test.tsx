import { renderHook } from "@testing-library/react";
import React from "react";
import {
  CategorizedRemindersViewModelContextInterface,
  CategorizedRemindersViewModelContext,
} from "./CategorizedReminders.view-model.context";
import { useCategorizedRemindersViewModel } from "./CategorizedReminders.view-model";
import { SelectedCategoryModel } from "./models/selected-category.model";
import { signal } from "@preact/signals-core";

describe("useCategorizedRemindersViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const selectedCategoryModel: Partial<SelectedCategoryModel> = {
      selectedCategory: signal(""),
      setSelectedCategory: vi.fn(),
    };

    const mockDependencies: CategorizedRemindersViewModelContextInterface = {
      createSelectedCategoryModel: vi.fn(
        () => selectedCategoryModel as SelectedCategoryModel,
      ),
    };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <CategorizedRemindersViewModelContext.Provider value={mockDependencies}>
        {children}
      </CategorizedRemindersViewModelContext.Provider>
    );

    const { result } = renderHook(() => useCategorizedRemindersViewModel(), {
      wrapper,
    });

    expect(result.current).toEqual({
      selectedCategoryModel,
    });
  });
});
