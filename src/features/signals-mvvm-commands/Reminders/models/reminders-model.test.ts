import { Reminder } from "../types";
import { RemindersModelDependencies, RemindersModel } from "./reminders-model";
import { QueryClient } from "@tanstack/query-core";

describe("Add reminders (command)", () => {
  it("should work as expected when adding a single reminder", async () => {
    // arrange
    let count = 0;
    const fakeReminderMocks: Reminder[][] = [
      [],
      [{ id: "abc", text: "Do this thing" }],
    ];

    const mockDependencies: RemindersModelDependencies = {
      addReminderCommand: vi.fn(async (text) => ({ id: "1", text })),
      fetchRemindersCommand: vi.fn(async () => fakeReminderMocks[count++]),
    };

    const queryClient = new QueryClient();
    const model = new RemindersModel(queryClient, mockDependencies);

    // check that the reminders load initially
    expect(model.isLoading.value).toEqual(true);

    // wait for the loading to finish
    await vi.waitFor(() => expect(model.isLoading.value).toEqual(false));

    // check that the reminders were loaded
    expect(model.reminders.value).toEqual([]);

    // add some reminders
    await model.addReminder("Paint house");

    // check that the reminders were added the correct amount of times
    expect(mockDependencies.addReminderCommand).toHaveBeenCalledOnce();

    // check that the reminders were re-fetched the correct amount of times
    expect(mockDependencies.fetchRemindersCommand).toHaveBeenCalledTimes(2);

    // check that the list of reminders is correct
    expect(model.reminders.value).toEqual(fakeReminderMocks[1]);
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
      addReminderCommand: vi.fn(async (text) => ({ id: "1", text })),
      fetchRemindersCommand: vi.fn(async () => fakeReminderMocks[count++]),
    };

    const queryClient = new QueryClient();
    const model = new RemindersModel(queryClient, mockDependencies);

    // check that the reminders load initially
    expect(model.isLoading.value).toEqual(true);

    // wait for the loading to finish
    await vi.waitFor(() => expect(model.isLoading.value).toEqual(false));

    // check that the reminders were loaded
    expect(model.reminders.value).toEqual([]);

    // add some reminders
    await model.addReminder("Paint house");
    await model.addReminder("Buy milk");
    await model.addReminder("Wash car");

    // check that the reminders were added the correct amount of times
    expect(mockDependencies.addReminderCommand).toHaveBeenCalledTimes(3);

    // check that the reminders were re-fetched the correct amount of times
    expect(mockDependencies.fetchRemindersCommand).toHaveBeenCalledTimes(4);

    // check that the list of reminders is correct
    expect(model.reminders.value).toEqual(fakeReminderMocks[3]);
  });

  it("should fail validation when adding empty reminder", async () => {
    // arrange
    let count = 0;
    const fakeReminderMocks: Reminder[][] = [[], [{ id: "1", text: "Fake 1" }]];

    // arrange
    const mockDependencies: RemindersModelDependencies = {
      addReminderCommand: vi.fn(async (text) => ({ id: "1", text })),
      fetchRemindersCommand: vi.fn(async () => fakeReminderMocks[count++]),
    };

    const queryClient = new QueryClient();
    const model = new RemindersModel(queryClient, mockDependencies);

    // check that the reminders load initially
    expect(model.isLoading.value).toEqual(true);

    // wait for the loading to finish
    await vi.waitFor(() => expect(model.isLoading.value).toEqual(false));

    // check that the reminders were loaded
    expect(model.reminders.value).toEqual([]);

    // add a reminder
    await model.addReminder("");

    // check that it never added a reminder
    expect(mockDependencies.addReminderCommand).not.toHaveBeenCalled();

    // check that it did not refetch the reminders
    expect(mockDependencies.fetchRemindersCommand).toHaveBeenCalledOnce();

    // check that the list of reminders is still the same as before
    expect(model.reminders.value).toEqual(fakeReminderMocks[0]);
  });
});
