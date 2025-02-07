import { renderHook, waitFor } from "@testing-library/react";
import { useRemindersModel } from "./reminders-model";
import {
  RemindersModelContext,
  RemindersModelContextInterface,
} from "./reminders-model.context";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Reminder } from "../types";

describe("Add reminders (command)", () => {
  it("should work as expected when adding a single reminder", async () => {
    // arrange
    let count = 0;
    const fakeReminderMocks: Reminder[][] = [
      [],
      [{ id: "abc", text: "Do this thing" }],
    ];

    const mockDependencies: RemindersModelContextInterface = {
      addReminderCommand: vi.fn(async (text) => ({ id: "1", text })),
      fetchRemindersCommand: vi.fn(async () => fakeReminderMocks[count++]),
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

    // check that the reminders load initially
    expect(result.current.isLoading).toEqual(true);

    // wait for the loading to finish
    await waitFor(() => expect(result.current.isLoading).toEqual(false));

    // check that the reminders were loaded
    expect(result.current.reminders).toEqual([]);

    // add some reminders
    await waitFor(() => result.current.addReminder("Paint house"));

    // check that the reminders were added the correct amount of times
    expect(mockDependencies.addReminderCommand).toHaveBeenCalledOnce();

    // check that the reminders were re-fetched the correct amount of times
    expect(mockDependencies.fetchRemindersCommand).toHaveBeenCalledTimes(2);

    // check that the list of reminders is correct
    expect(result.current.reminders).toEqual(fakeReminderMocks[1]);
  });

  it("should work as expected when adding multiple reminders", async () => {
    // arrange
    let count = 0;
    const fakeReminderMocks: Reminder[][] = [
      [],
      [{ id: "1", text: "Fake 1" }],
      [
        { id: "1", text: "Fake 1" },
        { id: "2", text: "Fake 2" },
      ],
      [
        { id: "1", text: "Fake 1" },
        { id: "2", text: "Fake 2" },
        { id: "3", text: "Fake 3" },
      ],
    ];

    const mockDependencies: RemindersModelContextInterface = {
      addReminderCommand: vi.fn(async (text) => ({ id: "1", text })),
      fetchRemindersCommand: vi.fn(async () => fakeReminderMocks[count++]),
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

    // check that the reminders load initially
    expect(result.current.isLoading).toEqual(true);

    // wait for the loading to finish
    await waitFor(() => expect(result.current.isLoading).toEqual(false));

    // check that the reminders were loaded
    expect(result.current.reminders).toEqual([]);

    // add some reminders
    await waitFor(() => result.current.addReminder("Paint house"));
    await waitFor(() => result.current.addReminder("Buy milk"));
    await waitFor(() => result.current.addReminder("Wash car"));

    // check that the reminders were added the correct amount of times
    expect(mockDependencies.addReminderCommand).toHaveBeenCalledTimes(3);

    // check that the reminders were re-fetched the correct amount of times
    expect(mockDependencies.fetchRemindersCommand).toHaveBeenCalledTimes(4);

    // check that the list of reminders is correct
    expect(result.current.reminders).toEqual(fakeReminderMocks[3]);
  });

  it("should fail validation when adding empty reminder", async () => {
    // arrange
    let count = 0;
    const fakeReminderMocks: Reminder[][] = [[], [{ id: "1", text: "Fake 1" }]];

    // arrange
    const mockDependencies: RemindersModelContextInterface = {
      addReminderCommand: vi.fn(async (text) => ({ id: "1", text })),
      fetchRemindersCommand: vi.fn(async () => fakeReminderMocks[count++]),
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

    // check that the reminders load initially
    expect(result.current.isLoading).toEqual(true);

    // wait for the loading to finish
    await waitFor(() => expect(result.current.isLoading).toEqual(false));

    // check that the reminders were loaded
    expect(result.current.reminders).toEqual([]);

    // add a reminder
    await waitFor(() => result.current.addReminder(""));

    // check that it never added a reminder
    expect(mockDependencies.addReminderCommand).not.toHaveBeenCalled();

    // check that it did not refetch the reminders
    expect(mockDependencies.fetchRemindersCommand).toHaveBeenCalledOnce();

    // check that the list of reminders is still the same as before
    expect(result.current.reminders).toEqual(fakeReminderMocks[0]);
  });
});
