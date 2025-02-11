import { Reminder } from "../types";
import {
  RemindersModelContext,
  RemindersModelContextInterface,
} from "./reminders-model.context";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useRemindersModel } from "./reminders-model";

describe("useRemindersModel", () => {
  it("should expose loaded reminders correctly", async () => {
    // arrange
    const remindersMock: Reminder[] = [{ id: "abc", text: "Do this thing" }];

    const mockDependencies: RemindersModelContextInterface = {
      remindersService: {
        fetchReminders: vi.fn(async () => remindersMock),
        addReminder: vi.fn(),
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

    // check that the reminders were loaded
    await waitFor(() =>
      expect(result.current.reminders).toEqual(remindersMock),
    );

    // check that loading is not active
    expect(result.current.isLoading).toEqual(false);

    // check that fetching is not active
    expect(result.current.isFetching).toEqual(false);

    // check that there are no fetching errors
    expect(result.current.failedToFetchRemindersError).toEqual(null);

    // check that the underlying service was called only once
    expect(
      mockDependencies.remindersService?.fetchReminders,
    ).toHaveBeenCalledOnce();
  });

  it("should behave correctly if for some reason the reminders query is re-fetched", async () => {
    // arrange
    let count = 0;
    const remindersMocks: Reminder[][] = [
      [{ id: "abc", text: "Do this thing" }],
      [{ id: "abc", text: "Do this thing" }],
    ];

    const mockDependencies: RemindersModelContextInterface = {
      remindersService: {
        fetchReminders: vi.fn(async () => remindersMocks[count++]),
        addReminder: vi.fn(),
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

    // check that the reminders were loaded
    await waitFor(() =>
      expect(result.current.reminders).toEqual(remindersMocks[0]),
    );

    // check that the underlying service was called once
    expect(
      mockDependencies.remindersService?.fetchReminders,
    ).toHaveBeenCalledOnce();

    // reset the query cache to trigger refetching
    await act(() => queryClient.refetchQueries());

    // check that the reminders were loaded
    await waitFor(() =>
      expect(result.current.reminders).toEqual(remindersMocks[1]),
    );

    // check that loading is not active
    expect(result.current.isLoading).toEqual(false);

    // check that fetching is not active
    expect(result.current.isFetching).toEqual(false);

    // check that there are no fetching errors
    expect(result.current.failedToFetchRemindersError).toEqual(null);

    // check that the underlying service was called twice
    expect(
      mockDependencies.remindersService?.fetchReminders,
    ).toHaveBeenCalledTimes(2);
  });

  it("should expose error when fetching reminders fails", async () => {
    // arrange
    const remindersErrorMock = new Error("Service Unavailable");

    const mockDependencies: RemindersModelContextInterface = {
      remindersService: {
        fetchReminders: vi.fn(async () => {
          throw remindersErrorMock;
        }),
        addReminder: vi.fn(),
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

    // check that the failed to fetch error is exposes at some point
    await waitFor(() =>
      expect(result.current.failedToFetchRemindersError).toEqual(
        remindersErrorMock,
      ),
    );

    // check that no reminders are loaded
    expect(result.current.reminders).toEqual([]);

    // check that loading is not active
    expect(result.current.isLoading).toEqual(false);

    // check that fetching is not active
    expect(result.current.isFetching).toEqual(false);

    // check that the underlying service was called only once
    expect(
      mockDependencies.remindersService?.fetchReminders,
    ).toHaveBeenCalledOnce();
  });

  it("should expose error when saving reminder fails", async () => {
    // arrange
    const addReminderErrorMock = new Error("Service Unavailable");

    const mockDependencies: RemindersModelContextInterface = {
      remindersService: {
        fetchReminders: vi.fn(async () => []),
        addReminder: vi.fn(async () => {
          throw addReminderErrorMock;
        }),
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

    // check that the failed to fetch error is exposes at some point
    await waitFor(() =>
      expect(() => result.current.addReminder("Wash car")).rejects.toThrowError(
        addReminderErrorMock,
      ),
    );

    // check that the error is available through the model
    expect(result.current.failedToAddReminderError).toEqual(
      addReminderErrorMock,
    );

    // check that no reminders are loaded
    expect(result.current.reminders).toEqual([]);

    // check that loading is not active
    expect(result.current.isLoading).toEqual(false);

    // check that fetching is not active
    expect(result.current.isFetching).toEqual(false);

    // check that the underlying service was called only once
    expect(
      mockDependencies.remindersService?.addReminder,
    ).toHaveBeenCalledOnce();
  });

  it("should add reminder and refetch correctly", async () => {
    // arrange
    let count = 0;
    const remindersMocks: Reminder[][] = [
      [{ id: "abc", text: "Do this thing" }],
      [
        { id: "abc", text: "Do this thing" },
        { id: "cde", text: "Do other thing" },
      ],
    ];

    const mockDependencies: RemindersModelContextInterface = {
      remindersService: {
        fetchReminders: vi.fn(async () => remindersMocks[count++]),
        addReminder: vi.fn(async () => {}),
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

    // check that the reminders were loaded
    await waitFor(() =>
      expect(result.current.reminders).toEqual(remindersMocks[0]),
    );

    // check that the underlying service was called once
    expect(
      mockDependencies.remindersService?.fetchReminders,
    ).toHaveBeenCalledOnce();

    // reset the query cache to trigger refetching
    await waitFor(() => result.current.addReminder("Wash car"));

    // check that the reminders were loaded
    await waitFor(() =>
      expect(result.current.reminders).toEqual(remindersMocks[1]),
    );

    // check that loading is not active
    expect(result.current.isLoading).toEqual(false);

    // check that fetching is not active
    expect(result.current.isFetching).toEqual(false);

    // check that there are no fetching errors
    expect(result.current.failedToFetchRemindersError).toEqual(null);

    // check that the underlying service was called twice
    expect(
      mockDependencies.remindersService?.fetchReminders,
    ).toHaveBeenCalledTimes(2);
  });
});
