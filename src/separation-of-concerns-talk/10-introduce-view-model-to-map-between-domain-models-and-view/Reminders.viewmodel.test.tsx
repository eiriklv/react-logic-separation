import { renderHook } from "@testing-library/react";
import React from "react";
import {
  RemindersViewModelContextInterface,
  RemindersViewModelContext,
} from "./Reminders.viewmodel.context";
import { useRemindersViewModel } from "./Reminders.viewmodel";

describe("useRemindersViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const remindersModelReturnValue: ReturnType<
      RemindersViewModelContextInterface["useRemindersModel"]
    > = {
      isLoading: true,
      isFetching: true,
      isSaving: true,
      reminders: [],
      remindersCount: 0,
      addReminder: vi.fn(),
      failedToAddReminderError: new Error("something"),
      failedToFetchRemindersError: new Error("something"),
    };

    const mockDependencies: RemindersViewModelContextInterface = {
      useRemindersModel: vi.fn(() => remindersModelReturnValue),
    };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <RemindersViewModelContext.Provider value={mockDependencies}>
        {children}
      </RemindersViewModelContext.Provider>
    );

    const { result } = renderHook(() => useRemindersViewModel(), { wrapper });

    // assert
    expect(result.current.isFetching).toEqual(
      remindersModelReturnValue.isFetching,
    );
    expect(result.current.isLoading).toEqual(
      remindersModelReturnValue.isLoading,
    );
    expect(result.current.isSaving).toEqual(remindersModelReturnValue.isSaving);
    expect(result.current.reminders).toEqual(
      remindersModelReturnValue.reminders,
    );
    expect(result.current.remindersCount).toEqual(
      remindersModelReturnValue.remindersCount,
    );
    expect(result.current.addReminder).toEqual(
      remindersModelReturnValue.addReminder,
    );
    expect(result.current.failedToAddReminderError).toEqual(
      remindersModelReturnValue.failedToAddReminderError,
    );
    expect(result.current.failedToFetchRemindersError).toEqual(
      remindersModelReturnValue.failedToFetchRemindersError,
    );
  });
});
