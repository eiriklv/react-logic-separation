import { renderHook } from "@testing-library/react";
import React from "react";
import {
  RemindersViewModelContextInterface,
  RemindersViewModelContext,
} from "./Reminders.view-model.context";
import { useRemindersViewModel } from "./Reminders.view-model";
import { signal } from "@preact/signals-core";
import { PartialDeep } from "type-fest";

describe("useRemindersViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const addReminder = vi.fn();

    const mockDependencies: PartialDeep<RemindersViewModelContextInterface> = {
      remindersModel: {
        isLoading: signal(true),
        isFetching: signal(true),
        isSaving: signal(true),
        reminders: signal([]),
        remindersCount: signal(0),
        addReminder,
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
    expect(result.current).toEqual({
      isLoading: true,
      isFetching: true,
      isSaving: true,
      reminders: [],
      remindersCount: 0,
      addReminder,
    });
  });
});
