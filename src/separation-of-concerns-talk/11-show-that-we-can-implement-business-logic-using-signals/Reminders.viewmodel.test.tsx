import { renderHook } from "@testing-library/react";
import React from "react";
import {
  RemindersViewModelContextInterface,
  RemindersViewModelContext,
} from "./Reminders.viewmodel.context";
import { useRemindersViewModel } from "./Reminders.viewmodel";
import { signal } from "@preact/signals-core";
import { PartialDeep } from "type-fest";

describe("useRemindersViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const mockDependencies: PartialDeep<RemindersViewModelContextInterface> = {
      remindersModel: {
        isLoading: signal(true),
        isFetching: signal(true),
        isSaving: signal(true),
        reminders: signal([]),
        remindersCount: signal(0),
        addReminder: vi.fn(),
        failedToAddReminderError: signal(new Error("something")),
        failedToFetchRemindersError: signal(new Error("something")),
      },
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
    expect(result.current.isFetching).toEqual(
      mockDependencies.remindersModel?.isFetching?.value,
    );
    expect(result.current.isLoading).toEqual(
      mockDependencies.remindersModel?.isLoading?.value,
    );
    expect(result.current.isSaving).toEqual(
      mockDependencies.remindersModel?.isSaving?.value,
    );
    expect(result.current.reminders).toEqual(
      mockDependencies.remindersModel?.reminders?.value,
    );
    expect(result.current.remindersCount).toEqual(
      mockDependencies.remindersModel?.remindersCount?.value,
    );
    expect(result.current.addReminder).toEqual(
      mockDependencies.remindersModel?.addReminder,
    );
    expect(result.current.failedToAddReminderError).toEqual(
      mockDependencies.remindersModel?.failedToAddReminderError?.value,
    );
    expect(result.current.failedToFetchRemindersError).toEqual(
      mockDependencies.remindersModel?.failedToFetchRemindersError?.value,
    );
  });
});
