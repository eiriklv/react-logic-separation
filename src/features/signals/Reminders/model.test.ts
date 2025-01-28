import { Dependencies, Reminder, RemindersModel } from "./model";
import { QueryClient } from "@tanstack/query-core";
import { waitFor } from "@testing-library/react";

describe("Add reminders (command)", () => {
  it("should work as expected when adding a single reminder", async () => {
    // arrange
    let count = 0;
    const fakeReminderMocks: Reminder[][] = [
      [],
      [{ id: "abc", text: "Do this thing" }],
    ];

    const mockDependencies: Dependencies = {
      remindersService: {
        addReminder: vi.fn(),
        fetchReminders: vi.fn(async () => fakeReminderMocks[count++]),
      },
    };

    const queryClient = new QueryClient();

    const model = new RemindersModel(queryClient, mockDependencies);

    // wait for loading to stop
    await waitFor(() => expect(model.isLoading.value).toEqual(false));

    // check that fetching was done
    await waitFor(() =>
      expect(
        mockDependencies.remindersService.fetchReminders,
      ).toHaveBeenCalledTimes(1),
    );

    // check that the reminders are populated correctly
    await waitFor(() =>
      expect(model.reminders.value).toEqual(fakeReminderMocks[0]),
    );

    // add a reminder
    await model.addReminder("Paint house");

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
      expect(model.reminders.value).toEqual(fakeReminderMocks[1]),
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

    const mockDependencies: Dependencies = {
      remindersService: {
        addReminder: vi.fn(),
        fetchReminders: vi.fn(async () => fakeReminderMocks[count++]),
      },
    };

    const queryClient = new QueryClient();

    const model = new RemindersModel(queryClient, mockDependencies);

    // add some reminders
    await model.addReminder("Paint house");
    await model.addReminder("Buy milk");
    await model.addReminder("Wash car");

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
    await waitFor(() => expect(model.isLoading.value).toEqual(false));

    // check that the list of reminders is correct
    await waitFor(() =>
      expect(model.reminders.value).toEqual(fakeReminderMocks[3]),
    );
  });

  it("should fail validation when adding empty reminder", async () => {
    // arrange
    let count = 0;
    const fakeReminderMocks: Reminder[][] = [[], [{ id: "1", text: "Fake 1" }]];

    // arrange
    const mockDependencies: Dependencies = {
      remindersService: {
        addReminder: vi.fn(),
        fetchReminders: vi.fn(async () => fakeReminderMocks[count++]),
      },
    };

    const queryClient = new QueryClient();

    const model = new RemindersModel(queryClient, mockDependencies);

    // check that the reminders are populated initially
    await waitFor(() =>
      expect(
        mockDependencies.remindersService.fetchReminders,
      ).toHaveBeenCalledTimes(1),
    );

    // add a reminder
    await model.addReminder("");

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
      expect(model.reminders.value).toEqual(fakeReminderMocks[0]),
    );
  });
});
