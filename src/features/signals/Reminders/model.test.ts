import { RemindersModelDependencies, Reminder, RemindersModel } from "./model";
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
      remindersService: {
        addReminder: vi.fn(),
        fetchReminders: vi.fn(async () => fakeReminderMocks[count++]),
      },
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
    expect(
      mockDependencies.remindersService.addReminder,
    ).toHaveBeenCalledOnce();

    // check that the reminders were re-fetched the correct amount of times
    expect(
      mockDependencies.remindersService.fetchReminders,
    ).toHaveBeenCalledTimes(2);

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
      remindersService: {
        addReminder: vi.fn(async () => {}),
        fetchReminders: vi.fn(async () => fakeReminderMocks[count++]),
      },
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
    expect(mockDependencies.remindersService.addReminder).toHaveBeenCalledTimes(
      3,
    );

    // check that the reminders were re-fetched the correct amount of times
    expect(
      mockDependencies.remindersService.fetchReminders,
    ).toHaveBeenCalledTimes(4);

    // check that the list of reminders is correct
    expect(model.reminders.value).toEqual(fakeReminderMocks[3]);
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
    expect(
      mockDependencies.remindersService.addReminder,
    ).not.toHaveBeenCalled();

    // check that it did not refetch the reminders
    expect(
      mockDependencies.remindersService.fetchReminders,
    ).toHaveBeenCalledTimes(1);

    // check that the list of reminders is still the same as before
    expect(model.reminders.value).toEqual(fakeReminderMocks[0]);
  });
});
