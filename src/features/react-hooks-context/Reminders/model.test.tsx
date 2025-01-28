import { renderHook, act, waitFor } from "@testing-library/react";
import { useRemindersModel } from "./model";
import {
  RemindersModelContext,
  RemindersModelContextInterface,
} from "./model.context";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Reminder } from "./types";

describe("Add reminders (command)", () => {
  it("should work as expected when adding a single reminder", async () => {
    // arrange
    let count = 0;
    const fakeReminderMocks: Reminder[][] = [
      [],
      [{ id: "abc", text: "Do this thing" }],
    ];

    const mockDependencies: RemindersModelContextInterface = {
      remindersService: {
        addReminder: vi.fn(),
        fetchReminders: vi.fn(async () => fakeReminderMocks[count++]),
      },
    };

    const queryClient = new QueryClient();

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <RemindersModelContext.Provider value={mockDependencies}>
          {children}
        </RemindersModelContext.Provider>
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useRemindersModel(), { wrapper });

    // wait for loading to stop
    await waitFor(() => expect(result.current.isLoading).toEqual(false));

    // check that fetching was done
    await waitFor(() =>
      expect(
        mockDependencies.remindersService.fetchReminders,
      ).toHaveBeenCalledTimes(1),
    );

    // check that the reminders are populated correctly
    await waitFor(() =>
      expect(result.current.reminders).toEqual(fakeReminderMocks[0]),
    );

    // add a reminder
    await act(() => result.current.addReminder("Paint house"));

    // check that the adding the reminder was done once
    await waitFor(() =>
      expect(
        mockDependencies.remindersService.addReminder,
      ).toHaveBeenCalledTimes(1),
    );

    // check that re-fetching was done after mutating
    await waitFor(() =>
      expect(
        mockDependencies.remindersService.fetchReminders,
      ).toHaveBeenCalledTimes(2),
    );

    // check that the reminders are populated correctly
    await waitFor(() =>
      expect(result.current.reminders).toEqual(fakeReminderMocks[1]),
    );
  });

  it("should work as expected when adding multiple reminders", async () => {
    // arrange
    let count = 0;
    const fakeReminderMocks: Reminder[][] = [
      [],
      [{ id: "1", text: "Fake 1" }],
      [{ id: "2", text: "Fake 2" }],
      [{ id: "3", text: "Fake 3" }],
    ];

    const mockDependencies: RemindersModelContextInterface = {
      remindersService: {
        addReminder: vi.fn(),
        fetchReminders: vi.fn(async () => fakeReminderMocks[count++]),
      },
    };

    const queryClient = new QueryClient();

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <RemindersModelContext.Provider value={mockDependencies}>
          {children}
        </RemindersModelContext.Provider>
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useRemindersModel(), { wrapper });

    // add some reminders
    await act(() => result.current.addReminder("Paint house"));
    await act(() => result.current.addReminder("Buy milk"));
    await act(() => result.current.addReminder("Wash car"));

    // check that the reminders were added the correct amount of times
    await waitFor(() =>
      expect(
        mockDependencies.remindersService.addReminder,
      ).toHaveBeenCalledTimes(3),
    );

    // check that the reminders were refetched the correct amount of times
    await waitFor(() =>
      expect(
        mockDependencies.remindersService.fetchReminders,
      ).toHaveBeenCalledTimes(4),
    );

    // wait for loading to stop
    await waitFor(() => expect(result.current.isLoading).toEqual(false));

    // check that the list of reminders is correct
    await waitFor(() =>
      expect(result.current.reminders).toEqual(fakeReminderMocks[3]),
    );
  });

  it("should fail validation when adding empty reminder", async () => {
    // arrange
    let count = 0;
    const fakeReminderMocks: Reminder[][] = [[], [{ id: "1", text: "Fake 1" }]];

    // arrange
    const mockDependencies: RemindersModelContextInterface = {
      remindersService: {
        addReminder: vi.fn(),
        fetchReminders: vi.fn(async () => fakeReminderMocks[count++]),
      },
    };

    const queryClient = new QueryClient();

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <RemindersModelContext.Provider value={mockDependencies}>
          {children}
        </RemindersModelContext.Provider>
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useRemindersModel(), { wrapper });

    // check that the reminders are populated initially
    await waitFor(() =>
      expect(
        mockDependencies.remindersService.fetchReminders,
      ).toHaveBeenCalledTimes(1),
    );

    // add a reminder
    await act(() => result.current.addReminder(""));

    // check that it never added a reminder
    await waitFor(() =>
      expect(
        mockDependencies.remindersService.addReminder,
      ).toHaveBeenCalledTimes(0),
    );

    // check that it did not refetch the reminders
    await waitFor(() =>
      expect(
        mockDependencies.remindersService.fetchReminders,
      ).toHaveBeenCalledTimes(1),
    );

    // check that the list of reminders is still the same as before
    await waitFor(() =>
      expect(result.current.reminders).toEqual(fakeReminderMocks[0]),
    );
  });
});
