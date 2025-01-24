import { renderHook, act } from "@testing-library/react";
import { useRemindersModel } from "./model";
import {
  RemindersModelContext,
  RemindersModelContextInterface,
} from "./model.context";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

describe("Add reminders (command)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should work as expected when adding a single reminder", async () => {
    // arrange
    const mockDependencies: RemindersModelContextInterface = {
      remindersService: {
        addReminder: vi.fn(),
        fetchReminders: vi.fn(async () => []),
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

    // act
    await act(() => result.current.addReminder("Paint house"));

    // assert
    expect(result.current.isFetching).toEqual(true);
    expect(result.current.isLoading).toEqual(true);
    expect(result.current.isSaving).toEqual(false);
    expect(
      mockDependencies.remindersService.fetchReminders,
    ).toHaveBeenCalledTimes(2);
    expect(mockDependencies.remindersService.addReminder).toHaveBeenCalledTimes(
      1,
    );

    await act(() => vi.advanceTimersToNextTimerAsync());

    expect(result.current.isFetching).toEqual(false);
    expect(result.current.isLoading).toEqual(false);
    expect(result.current.isSaving).toEqual(false);
    expect(result.current.reminders).toEqual([]);
  });

  it("should work as expected when adding multiple reminders", async () => {
    // arrange
    const mockDependencies: RemindersModelContextInterface = {
      remindersService: {
        addReminder: vi.fn(),
        fetchReminders: vi.fn(async () => []),
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

    // act
    await act(() => result.current.addReminder("Paint house"));
    await act(() => result.current.addReminder("Buy milk"));
    await act(() => result.current.addReminder("Wash car"));

    // assert
    expect(result.current.isFetching).toEqual(true);
    expect(result.current.isLoading).toEqual(true);
    expect(result.current.isSaving).toEqual(false);
    expect(
      mockDependencies.remindersService.fetchReminders,
    ).toHaveBeenCalledTimes(4);
    expect(mockDependencies.remindersService.addReminder).toHaveBeenCalledTimes(
      3,
    );
    expect(result.current.reminders).toEqual([]);

    await act(() => vi.advanceTimersToNextTimerAsync());

    expect(result.current.isFetching).toEqual(false);
    expect(result.current.isLoading).toEqual(false);
    expect(result.current.isSaving).toEqual(false);
  });

  it("should fail validation when adding empty reminder", async () => {
    // arrange
    const mockDependencies: RemindersModelContextInterface = {
      remindersService: {
        addReminder: vi.fn(),
        fetchReminders: vi.fn(async () => []),
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

    // act
    await act(() => result.current.addReminder(""));

    // assert
    expect(mockDependencies.remindersService.addReminder).toHaveBeenCalledTimes(
      0,
    );
    expect(result.current.reminders).toEqual([]);
  });
});
