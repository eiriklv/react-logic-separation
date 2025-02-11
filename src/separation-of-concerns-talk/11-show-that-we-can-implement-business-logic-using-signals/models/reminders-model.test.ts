import { Reminder } from "../types";
import { QueryClient } from "@tanstack/query-core";
import { RemindersModel, RemindersModelDependencies } from "./reminders-model";

describe("useRemindersModel", () => {
  it("should expose loaded reminders correctly", async () => {
    // arrange
    const remindersMock: Reminder[] = [{ id: "abc", text: "Do this thing" }];

    const mockDependencies: RemindersModelDependencies = {
      remindersService: {
        addReminder: vi.fn(),
        fetchReminders: vi.fn(async () => remindersMock),
      },
    };

    const queryClient = new QueryClient();

    const model = new RemindersModel(queryClient, mockDependencies);

    // check that the reminders were loaded
    await vi.waitFor(() =>
      expect(model.reminders.value).toEqual(remindersMock),
    );

    // check that loading is not active
    expect(model.isLoading.value).toEqual(false);

    // check that fetching is not active
    expect(model.isFetching.value).toEqual(false);

    // check that there are no fetching errors
    expect(model.failedToFetchRemindersError.value).toEqual(null);

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

    const mockDependencies: RemindersModelDependencies = {
      remindersService: {
        addReminder: vi.fn(),
        fetchReminders: vi.fn(async () => remindersMocks[count++]),
      },
    };

    const queryClient = new QueryClient();

    const model = new RemindersModel(queryClient, mockDependencies);

    // check that the reminders were loaded
    await vi.waitFor(() =>
      expect(model.reminders.value).toEqual(remindersMocks[0]),
    );

    // check that the underlying service was called once
    expect(
      mockDependencies.remindersService?.fetchReminders,
    ).toHaveBeenCalledOnce();

    // reset the query cache to trigger refetching
    await queryClient.refetchQueries();

    // check that the reminders were loaded
    await vi.waitFor(() =>
      expect(model.reminders.value).toEqual(remindersMocks[1]),
    );

    // check that loading is not active
    expect(model.isLoading.value).toEqual(false);

    // check that fetching is not active
    expect(model.isFetching.value).toEqual(false);

    // check that there are no fetching errors
    expect(model.failedToFetchRemindersError.value).toEqual(null);

    // check that the underlying service was called twice
    expect(
      mockDependencies.remindersService?.fetchReminders,
    ).toHaveBeenCalledTimes(2);
  });

  it("should expose error when fetching reminders fails", async () => {
    // arrange
    const remindersErrorMock = new Error("Service Unavailable");

    const mockDependencies: RemindersModelDependencies = {
      remindersService: {
        addReminder: vi.fn(),
        fetchReminders: vi.fn(async () => {
          throw remindersErrorMock;
        }),
      },
    };

    const queryClient = new QueryClient();

    const model = new RemindersModel(queryClient, mockDependencies);

    // check that the failed to fetch error is exposes at some point
    await vi.waitFor(() =>
      expect(model.failedToFetchRemindersError.value).toEqual(
        remindersErrorMock,
      ),
    );

    // check that no reminders are loaded
    expect(model.reminders.value).toEqual(undefined);

    // check that loading is not active
    expect(model.isLoading.value).toEqual(false);

    // check that fetching is not active
    expect(model.isFetching.value).toEqual(false);

    // check that the underlying service was called only once
    expect(
      mockDependencies.remindersService?.fetchReminders,
    ).toHaveBeenCalledOnce();
  });

  it("should expose error when saving reminder fails", async () => {
    // arrange
    const addReminderErrorMock = new Error("Service Unavailable");

    const mockDependencies: RemindersModelDependencies = {
      remindersService: {
        fetchReminders: vi.fn(async () => []),
        addReminder: vi.fn(async () => {
          throw addReminderErrorMock;
        }),
      },
    };

    const queryClient = new QueryClient();

    const model = new RemindersModel(queryClient, mockDependencies);

    // check that the failed to fetch error is exposes at some point
    await vi.waitFor(() =>
      expect(() => model.addReminder("Wash car")).rejects.toThrowError(
        addReminderErrorMock,
      ),
    );

    // check that the error is available through the model
    expect(model.failedToAddReminderError.value).toEqual(addReminderErrorMock);

    // check that no reminders are loaded
    expect(model.reminders.value).toEqual([]);

    // check that loading is not active
    expect(model.isLoading.value).toEqual(false);

    // check that fetching is not active
    expect(model.isFetching.value).toEqual(false);

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

    const mockDependencies: RemindersModelDependencies = {
      remindersService: {
        fetchReminders: vi.fn(async () => remindersMocks[count++]),
        addReminder: vi.fn(async () => {}),
      },
    };

    const queryClient = new QueryClient();

    const model = new RemindersModel(queryClient, mockDependencies);

    // check that the reminders were loaded
    await vi.waitFor(() =>
      expect(model.reminders.value).toEqual(remindersMocks[0]),
    );

    // check that the underlying service was called once
    expect(
      mockDependencies.remindersService?.fetchReminders,
    ).toHaveBeenCalledOnce();

    // reset the query cache to trigger refetching
    await model.addReminder("Wash car");

    // check that the reminders were loaded
    await vi.waitFor(() =>
      expect(model.reminders.value).toEqual(remindersMocks[1]),
    );

    // check that loading is not active
    expect(model.isLoading.value).toEqual(false);

    // check that fetching is not active
    expect(model.isFetching.value).toEqual(false);

    // check that there are no fetching errors
    expect(model.failedToFetchRemindersError.value).toEqual(null);

    // check that the underlying service was called twice
    expect(
      mockDependencies.remindersService?.fetchReminders,
    ).toHaveBeenCalledTimes(2);
  });
});
