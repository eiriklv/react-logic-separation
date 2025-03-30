import { renderHook } from "@testing-library/react";
import React from "react";
import {
  CategorizedRemindersViewModelContextInterface,
  CategorizedRemindersViewModelContext,
} from "./CategorizedReminders.view-model.context";
import { useCategorizedRemindersViewModel } from "./CategorizedReminders.view-model";
import { SelectedCategoryModel } from "./models/selected-category.model";
import { RemindersModel } from "./models/reminders.model";

describe("useCategorizedRemindersViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const selectedCategoryModel = {} as SelectedCategoryModel;
    const remindersModel = {} as RemindersModel;

    const mockDependencies: CategorizedRemindersViewModelContextInterface = {
      createSelectedCategoryModel: vi.fn(
        () => selectedCategoryModel as SelectedCategoryModel,
      ),
      categorySidebarViewModelContextDefaultValue: {
        remindersModel,
      },
      remindersViewModelContextDefaultValue: {
        remindersModel,
      },
      topbarViewModelContextDefaultValue: {
        remindersModel,
      },
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
      categorySidebarViewModelDependencies: {
        remindersModel,
        selectedCategoryModel,
      },
      remindersViewModelDependencies: {
        remindersModel,
        selectedCategoryModel,
      },
      topbarViewModelDependencies: {
        remindersModel,
        selectedCategoryModel,
      },
    });
  });
});
