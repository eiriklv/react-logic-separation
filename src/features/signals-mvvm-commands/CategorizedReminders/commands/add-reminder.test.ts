import {
  AddReminderCommand,
  AddReminderCommandDependencies,
} from "./add-reminder";
import type { PartialDeep } from "type-fest";

describe("AddReminderCommand", () => {
  it("should work as expected when adding a reminder", async () => {
    // arrange
    const mockDependencies: PartialDeep<AddReminderCommandDependencies> = {
      remindersService: {
        addReminder: vi.fn(),
      },
    };

    const addReminderCommand = new AddReminderCommand(
      mockDependencies as AddReminderCommandDependencies,
    );

    // add a reminder
    await addReminderCommand.invoke("Paint house", "home");

    // check that the underlying service was called
    expect(mockDependencies.remindersService?.addReminder).toHaveBeenCalledWith(
      "Paint house",
      "home",
    );

    // check that error is thrown if text is missing
    expect(() => addReminderCommand.invoke("", "")).toThrowError(
      "Reminder text is missing",
    );

    // check that error is thrown if category is missing
    expect(() => addReminderCommand.invoke("Do something", "")).toThrowError(
      "Reminder category is missing",
    );
  });
});
