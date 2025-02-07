import { RemindersModelDependencies, RemindersModel } from "./model";
import { QueryClient } from "@tanstack/query-core";
import { Reminder } from "./types";
import { createStore } from "jotai";
import { sleep } from "../../../lib/utils";

describe("Add reminders (command)", () => {
  it("should work as expected when adding a single reminder", async () => {
    // arrange
    let count = 0;
    const fakeReminderMocks: Reminder[][] = [
      [],
      [{ id: "abc", text: "Do this thing" }],
    ];

    const mockDependencies: RemindersModelDependencies = {
      remindersService: {
        addReminder: vi.fn(),
        fetchReminders: vi.fn(async () => fakeReminderMocks[count++]),
      },
    };

    const store = createStore();
    const queryClient = new QueryClient();
    const model = new RemindersModel(queryClient, store, mockDependencies);

    // check that the reminders load initially
    expect(store.get(model.isLoading)).toEqual(true);

    // wait for the loading to finish
    await vi.waitFor(() => expect(store.get(model.isLoading)).toEqual(false));

    // check that the reminders were loaded
    expect(store.get(model.reminders)).toEqual([]);

    // add some reminders
    await model.addReminder("Paint house");

    // for some reason jotai-tanstack-query waits until the next tick before updating
    await sleep(0);

    // check that the reminders were added the correct amount of times
    expect(
      mockDependencies.remindersService.addReminder,
    ).toHaveBeenCalledOnce();

    // check that the reminders were re-fetched the correct amount of times
    expect(
      mockDependencies.remindersService.fetchReminders,
    ).toHaveBeenCalledTimes(2);

    // check that the list of reminders is correct
    expect(store.get(model.reminders)).toEqual(fakeReminderMocks[1]);
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

    const mockDependencies: RemindersModelDependencies = {
      remindersService: {
        addReminder: vi.fn(async () => {}),
        fetchReminders: vi.fn(async () => fakeReminderMocks[count++]),
      },
    };

    const store = createStore();
    const queryClient = new QueryClient();
    const model = new RemindersModel(queryClient, store, mockDependencies);

    // check that the reminders load initially
    expect(store.get(model.isLoading)).toEqual(true);

    // wait for the loading to finish
    await vi.waitFor(() => expect(store.get(model.isLoading)).toEqual(false));

    // check that the reminders were loaded
    expect(store.get(model.reminders)).toEqual([]);

    // add some reminders
    await model.addReminder("Paint house");
    await model.addReminder("Buy milk");
    await model.addReminder("Wash car");

    // for some reason jotai-tanstack-query waits until the next tick before updating
    await sleep(0);

    // check that the reminders were added the correct amount of times
    expect(mockDependencies.remindersService.addReminder).toHaveBeenCalledTimes(
      3,
    );

    // check that the reminders were re-fetched the correct amount of times
    expect(
      mockDependencies.remindersService.fetchReminders,
    ).toHaveBeenCalledTimes(4);

    // check that the list of reminders is correct
    expect(store.get(model.reminders)).toEqual(fakeReminderMocks[3]);
  });

  it("should fail validation when adding empty reminder", async () => {
    // arrange
    let count = 0;
    const fakeReminderMocks: Reminder[][] = [[], [{ id: "1", text: "Fake 1" }]];

    // arrange
    const mockDependencies: RemindersModelDependencies = {
      remindersService: {
        addReminder: vi.fn(),
        fetchReminders: vi.fn(async () => fakeReminderMocks[count++]),
      },
    };

    const store = createStore();
    const queryClient = new QueryClient();
    const model = new RemindersModel(queryClient, store, mockDependencies);

    // check that the reminders load initially
    expect(store.get(model.isLoading)).toEqual(true);

    // wait for the loading to finish
    await vi.waitFor(() => expect(store.get(model.isLoading)).toEqual(false));

    // check that the reminders were loaded
    expect(store.get(model.reminders)).toEqual([]);

    // add a reminder
    await model.addReminder("");

    // for some reason jotai-tanstack-query waits until the next tick before updating
    await sleep(0);

    // check that it never added a reminder
    expect(
      mockDependencies.remindersService.addReminder,
    ).not.toHaveBeenCalled();

    // check that it did not refetch the reminders
    expect(
      mockDependencies.remindersService.fetchReminders,
    ).toHaveBeenCalledOnce();

    // check that the list of reminders is still the same as before
    expect(store.get(model.reminders)).toEqual(fakeReminderMocks[0]);
  });
});
