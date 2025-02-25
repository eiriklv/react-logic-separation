import { renderHook } from "@testing-library/react";
import React from "react";
import {
  RemindersViewModelContextInterface,
  RemindersViewModelContext,
} from "./Reminders.viewmodel.context";
import { useRemindersViewModel } from "./Reminders.viewmodel";
import { signal } from "@preact/signals-core";
import { PartialDeep } from "type-fest";
import { Reminder } from "../../types";
import { SelectedCategoryModel } from "../../models/selected-category-model";

describe("useRemindersViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    const mockReminders: Reminder[] = [];
    const mockRemindersCount = 0;

    // arrange
    const selectedCategoryModel: Partial<SelectedCategoryModel> = {
      selectedCategory: signal(""),
      setSelectedCategory: vi.fn(),
    };

    const mockDependencies: PartialDeep<RemindersViewModelContextInterface> = {
      remindersModel: {
        getRemindersByCategory: vi.fn(() => signal(mockReminders)),
        getRemindersCountByCategory: vi.fn(() => signal(mockRemindersCount)),
        addReminder: vi.fn(),
        isFetching: signal(false),
        isLoading: signal(false),
        isSaving: signal(false),
      },
      selectedCategoryModel,
    };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <RemindersViewModelContext.Provider
        value={mockDependencies as RemindersViewModelContextInterface}
      >
        {children}
      </RemindersViewModelContext.Provider>
    );

    const { result } = renderHook(() => useRemindersViewModel(), { wrapper });

    // assert
    expect(result.current).toEqual({
      reminders: [],
      remindersCount: 0,
      isLoading: false,
      isFetching: false,
      isSaving: false,
      addReminder: mockDependencies.remindersModel?.addReminder,
    });
  });
});
