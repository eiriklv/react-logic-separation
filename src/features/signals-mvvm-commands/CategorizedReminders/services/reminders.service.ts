import { generateId, sleep } from "../../../../lib/utils";
import { Reminder } from "../types";

/**
 * Services are typically things like SDKs, APIs or other classes that
 * expose a bunch of methods to interact with some internal state,
 * which might reside on the client and/or the server through some network layer
 *
 * Services will often interact with an sdk or directly with an API, so that
 * testing a service will often involve either using a mock for the SDK,
 * or things like mock-service-worker or nock (mocking the network layer)
 */

const defaultDependencies = {
  generateId,
};

export type RemindersServiceDependencies = typeof defaultDependencies;

export class RemindersService {
  private _reminders: Reminder[] = [
    { id: "1", text: "Write self reflection", category: "work" },
    { id: "2", text: "Fix that bug", category: "work" },
    { id: "3", text: "But milk", category: "home" },
    { id: "4", text: "Wash car", category: "home" },
    { id: "5", text: "Buy mother's day present", category: "family" },
    { id: "6", text: "Buy birthday gift", category: "family" },
  ];

  private _dependencies: RemindersServiceDependencies;

  constructor(
    dependencies: RemindersServiceDependencies = defaultDependencies,
  ) {
    this._dependencies = dependencies;
  }

  public async fetchReminders() {
    await sleep(1000);
    return this._reminders.slice();
  }

  public async addReminder(text: string, category: string) {
    await sleep(1000);

    const newReminder = {
      id: this._dependencies.generateId(),
      text,
      category,
    };

    this._reminders.splice(
      0,
      this._reminders.length,
      ...this._reminders,
      newReminder,
    );

    return newReminder;
  }
}

export const remindersServiceSingleton = new RemindersService();
