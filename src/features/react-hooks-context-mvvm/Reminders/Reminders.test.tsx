import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Reminders } from "./Reminders";
import {
  RemindersContext,
  RemindersContextInterface,
} from "./Reminders.context";

describe("Reminders Component", () => {
  it("Renders correctly", () => {
    // arrange
    const dependencies: RemindersContextInterface = {
      useRemindersViewModel: () => ({
        addReminder: vi.fn(),
        isLoading: false,
        isFetching: false,
        isSaving: false,
        reminders: [],
        remindersCount: 0,
      }),
      ReminderItem: () => <></>,
    };

    render(
      <RemindersContext.Provider value={dependencies}>
        <Reminders />
      </RemindersContext.Provider>,
    );

    // assert
    expect(screen.getByText("Reminders")).toBeInTheDocument();
  });

  it("Calls the correct handler when adding a reminder", async () => {
    // arrange
    const addReminder = vi.fn();

    const dependencies: RemindersContextInterface = {
      useRemindersViewModel: () => ({
        addReminder,
        isLoading: false,
        isFetching: false,
        isSaving: false,
        reminders: [],
        remindersCount: 0,
      }),
      ReminderItem: () => <></>,
    };

    render(
      <RemindersContext.Provider value={dependencies}>
        <Reminders />
      </RemindersContext.Provider>,
    );

    // act
    await userEvent.type(screen.getByLabelText("Remind me to"), "Paint house");
    await userEvent.type(screen.getByLabelText("Remind me to"), "{enter}");

    // assert
    expect(addReminder).toHaveBeenCalledWith("Paint house");
  });
});
