import { Dependencies, RemindersModel } from "./model";
import { QueryClient } from "@tanstack/query-core";

describe("Add reminders (command)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should work as expected when adding a single reminder", async () => {
    // arrange
    const mockDependencies: Dependencies = {
      remindersService: {
        addReminder: vi.fn(),
        fetchReminders: vi.fn(async () => [{ id: "abc", text: "test" }]),
      },
    };

    const queryClient = new QueryClient();

    const model = new RemindersModel(queryClient, mockDependencies);

    // act
    model.addReminder("Paint house");

    // assert
    expect(model.isFetching.value).toEqual(true);
    expect(model.isLoading.value).toEqual(true);
    expect(model.isSaving.value).toEqual(true);
    expect(
      mockDependencies.remindersService.fetchReminders,
    ).toHaveBeenCalledTimes(1);

    await vi.advanceTimersToNextTimerAsync();

    expect(mockDependencies.remindersService.addReminder).toHaveBeenCalledTimes(
      1,
    );
    expect(model.isFetching.value).toEqual(false);
    expect(model.isLoading.value).toEqual(false);
    expect(model.isSaving.value).toEqual(false);
    expect(model.reminders.value).toEqual([{ id: "abc", text: "test" }]);
  });

  it("should work as expected when adding multiple reminders", async () => {
    // arrange
    const mockDependencies: Dependencies = {
      remindersService: {
        addReminder: vi.fn(),
        fetchReminders: vi.fn(async () => [{ id: "abc", text: "test" }]),
      },
    };

    const queryClient = new QueryClient();

    const model = new RemindersModel(queryClient, mockDependencies);

    // act
    await model.addReminder("Paint house");
    await model.addReminder("Buy milk");
    await model.addReminder("Wash car");

    // assert
    expect(mockDependencies.remindersService.addReminder).toHaveBeenCalledTimes(
      3,
    );
    expect(
      mockDependencies.remindersService.fetchReminders,
    ).toHaveBeenCalledTimes(4);
    expect(model.isFetching.value).toEqual(false);
    expect(model.isLoading.value).toEqual(false);
    expect(model.isSaving.value).toEqual(false);
    expect(model.reminders.value).toEqual([{ id: "abc", text: "test" }]);
  });

  it("should fail validation when adding empty reminder", async () => {
    // arrange
    const mockDependencies: Dependencies = {
      remindersService: {
        addReminder: vi.fn(),
        fetchReminders: vi.fn(async () => []),
      },
    };

    const queryClient = new QueryClient();

    const model = new RemindersModel(queryClient, mockDependencies);

    // act
    await model.addReminder("");

    // assert
    expect(mockDependencies.remindersService.addReminder).toHaveBeenCalledTimes(
      0,
    );
    expect(
      mockDependencies.remindersService.fetchReminders,
    ).toHaveBeenCalledTimes(1);
    expect(model.reminders.value).toEqual([]);
  });
});
