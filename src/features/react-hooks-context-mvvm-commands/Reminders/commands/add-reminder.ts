import { remindersServiceSingleton } from "../services/reminders.service";

/**
 * Commands are meant to be single purpose operations that
 * wrap around one or more services and methods.
 *
 * Commands handle things like validation, transformation, error mapping, etc
 * - so that the consumer can use it with as much ease as possible
 *
 * Commands should be fully tested to ensure that all validation
 * and error handling logic is solid, and so that the same things
 * do not have to be tested through the model or the UI
 */

const defaultDependencies = {
  remindersService: remindersServiceSingleton,
};

export type AddReminderCommandDependencies = typeof defaultDependencies;

export class AddReminderCommand {
  private _dependencies: AddReminderCommandDependencies;

  public invoke = (text: string) => {
    if (!text) {
      throw new Error("Reminder text is missing");
    }

    return this._dependencies.remindersService.addReminder(text);
  };

  constructor(
    dependencies: AddReminderCommandDependencies = defaultDependencies,
  ) {
    this._dependencies = dependencies;
  }
}

export const addReminderCommand = new AddReminderCommand().invoke;
