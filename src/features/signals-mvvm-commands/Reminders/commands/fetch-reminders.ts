import { remindersServiceSingleton } from "../services/reminders.service";

/**
 * Commands are meant to be single purpose operations that
 * wrap around one or more services and methods.
 *
 * Command handle things like validation, transformations, error mapping, etc
 * - so that the consumer can use it with a much ease as possible
 *
 * Commands should be fully tested to ensure that all validation
 * and error handling logic is solid, and so that the same things
 * do not have to be tested through the model or the UI
 */

const defaultDependencies = {
  remindersService: remindersServiceSingleton,
};

export type FetchRemindersCommandDependencies = typeof defaultDependencies;

export class FetchRemindersCommand {
  private _dependencies: FetchRemindersCommandDependencies;

  public invoke = () => {
    return this._dependencies.remindersService.fetchReminders();
  };

  constructor(
    dependencies: FetchRemindersCommandDependencies = defaultDependencies,
  ) {
    this._dependencies = dependencies;
  }
}

export const fetchRemindersCommand = new FetchRemindersCommand().invoke;
