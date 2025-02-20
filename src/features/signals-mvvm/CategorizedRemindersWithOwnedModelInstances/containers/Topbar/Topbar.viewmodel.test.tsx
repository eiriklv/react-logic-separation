import { renderHook } from "@testing-library/react";
import React from "react";
import {
  TopbarViewModelContextInterface,
  TopbarViewModelContext,
} from "./Topbar.viewmodel.context";
import { useTopbarViewModel } from "./Topbar.viewmodel";
import { RemindersModel } from "../../models/reminders-model";
import { SelectedCategoryModel } from "../../models/selected-category-model";
import { signal } from "@preact/signals-core";

describe("useTopbarViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const remindersModel: Partial<RemindersModel> = {
      categories: signal(["home", "work"]),
    };

    const selectedCategoryModel: Partial<SelectedCategoryModel> = {
      selectedCategory: signal("test"),
      setSelectedCategory: vi.fn(),
    };

    const mockDependencies: TopbarViewModelContextInterface = {
      remindersModel: remindersModel as RemindersModel,
    };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <TopbarViewModelContext.Provider value={mockDependencies}>
        {children}
      </TopbarViewModelContext.Provider>
    );

    const { result } = renderHook(
      () =>
        useTopbarViewModel({
          selectedCategoryModel: selectedCategoryModel as SelectedCategoryModel,
        }),
      { wrapper },
    );

    expect(result.current).toEqual({
      categories: ["home", "work"],
      selectedCategory: "test",
      setSelectedCategory: selectedCategoryModel.setSelectedCategory,
    });
  });
});
