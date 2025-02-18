import {
  FetchRemindersCommand,
  FetchRemindersCommandDependencies,
} from "./fetch-reminders";
import type { PartialDeep } from "type-fest";

describe("FetchRemindersCommand", () => {
  it("should work as expected when adding a reminder", async () => {
    // arrange
    const mockDependencies: PartialDeep<FetchRemindersCommandDependencies> = {
      remindersService: {
        fetchReminders: vi.fn(async () => []),
      },
    };

    const fetchRemindersCommand = new FetchRemindersCommand(
      mockDependencies as FetchRemindersCommandDependencies,
    );

    // fetch the reminders
    const reminders = await fetchRemindersCommand.invoke();

    // check that the reminders were given as a result
    expect(reminders).toEqual([]);

    // check that the underlying service was called
    expect(
      mockDependencies.remindersService?.fetchReminders,
    ).toHaveBeenCalledOnce();
  });
});
