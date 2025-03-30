import { signal } from "@preact/signals-core";
import { Reminder } from "../types";
import { RemindersModelDependencies, RemindersModel } from "./reminders.model";
import { QueryClient } from "@tanstack/query-core";

describe("RemindersModel", () => {
  it("should work as expected when adding a single reminder", async () => {
    // arrange
    let count = 0;
    const fakeReminderMocks: Reminder[][] = [
      [],
      [{ id: "abc", text: "Do this thing", category: "home" }],
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
    await model.addReminder("Paint house", "work");

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
      [{ id: "1", text: "Fake 1", category: "category-1" }],
      [
        { id: "1", text: "Fake 1", category: "category-1" },
        { id: "2", text: "Fake 2", category: "category-1" },
      ],
      [
        { id: "1", text: "Fake 1", category: "category-1" },
        { id: "2", text: "Fake 2", category: "category-1" },
        { id: "3", text: "Fake 3", category: "category-1" },
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
    await model.addReminder("Paint house", "category");
    await model.addReminder("Buy milk", "category");
    await model.addReminder("Wash car", "category");

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
    const fakeReminderMocks: Reminder[][] = [
      [],
      [{ id: "1", text: "Fake 1", category: "category" }],
    ];

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

    // add a reminder without a category
    await model.addReminder("Thing", "");

    // add a reminder without text
    await model.addReminder("", "Category");

    // check that it never added a reminder
    expect(
      mockDependencies.remindersService.addReminder,
    ).not.toHaveBeenCalled();

    // check that it did not refetch the reminders
    expect(
      mockDependencies.remindersService.fetchReminders,
    ).toHaveBeenCalledOnce();

    // check that the list of reminders is still the same as before
    expect(model.reminders.value).toEqual(fakeReminderMocks[0]);
  });

  it("should provide reminders and counts filtered by category correctly", async () => {
    // arrange
    const fakeReminders: Reminder[] = [
      { id: "1", text: "Reminder 1", category: "category-1" },
      { id: "2", text: "Reminder 2", category: "category-1" },
      { id: "3", text: "Reminder 3", category: "category-2" },
      { id: "4", text: "Reminder 4", category: "category-2" },
    ];

    const mockDependencies: RemindersModelDependencies = {
      remindersService: {
        addReminder: vi.fn(),
        fetchReminders: vi.fn(async () => fakeReminders),
      },
    };

    const queryClient = new QueryClient();
    const model = new RemindersModel(queryClient, mockDependencies);
    const selectedCategory = signal("category-1");

    // check that the reminders load initially
    expect(model.isLoading.value).toEqual(true);

    // wait for the loading to finish
    await vi.waitFor(() => expect(model.isLoading.value).toEqual(false));

    // check that the reminders were loaded
    expect(model.reminders.value).toEqual(fakeReminders);

    // create a reference to reminders filtered by category
    const remindersBySelectedCategory =
      model.getRemindersByCategory(selectedCategory);

    // create a reference to reminders count filtered by category
    const remindersCountBySelectedCategory =
      model.getRemindersCountByCategory(selectedCategory);

    // check that correct filtered reminders are provided
    expect(remindersBySelectedCategory.value).toEqual([
      { id: "1", text: "Reminder 1", category: "category-1" },
      { id: "2", text: "Reminder 2", category: "category-1" },
    ]);

    // check that correct filtered reminders count is provided
    expect(remindersCountBySelectedCategory.value).toEqual(2);

    // change the selected category
    selectedCategory.value = "category-2";

    // check that correct filtered reminders are provided
    expect(remindersBySelectedCategory.value).toEqual([
      { id: "3", text: "Reminder 3", category: "category-2" },
      { id: "4", text: "Reminder 4", category: "category-2" },
    ]);

    // check that correct filtered reminders count is provided
    expect(remindersCountBySelectedCategory.value).toEqual(2);
  });

  it("should provide all categories correctly", async () => {
    // arrange
    const fakeReminders: Reminder[] = [
      { id: "1", text: "Reminder 1", category: "category-1" },
      { id: "2", text: "Reminder 2", category: "category-1" },
      { id: "3", text: "Reminder 3", category: "category-2" },
      { id: "4", text: "Reminder 4", category: "category-2" },
    ];

    const mockDependencies: RemindersModelDependencies = {
      remindersService: {
        addReminder: vi.fn(),
        fetchReminders: vi.fn(async () => fakeReminders),
      },
    };

    const queryClient = new QueryClient();
    const model = new RemindersModel(queryClient, mockDependencies);

    // check that the reminders load initially
    expect(model.isLoading.value).toEqual(true);

    // wait for the loading to finish
    await vi.waitFor(() => expect(model.isLoading.value).toEqual(false));

    // check that available categories are correct
    expect(model.categories.value).toEqual(["category-1", "category-2"]);
  });
});
