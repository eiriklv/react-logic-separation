import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Reminders } from "./Reminders.view";
import {
  RemindersContext,
  RemindersContextInterface,
} from "./Reminders.view.context";

describe("Reminders Component", () => {
  it("Renders correctly", () => {
    // arrange
    const dependencies: RemindersContextInterface = {
      useRemindersViewModel: vi.fn(() => ({
        reminders: [],
        remindersCount: 0,
        isLoading: false,
        isFetching: false,
        isSaving: false,
        addReminder: vi.fn(),
      })),
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
      useRemindersViewModel: vi.fn(() => ({
        reminders: [],
        remindersCount: 0,
        isLoading: false,
        isFetching: false,
        isSaving: false,
        addReminder,
      })),
      ReminderItem: () => <></>,
    };

    render(
      <RemindersContext.Provider value={dependencies}>
        <Reminders />
      </RemindersContext.Provider>,
    );

    // act
    await userEvent.type(
      screen.getByLabelText("Remind me to:"),
      "Paint house{tab}home{enter}",
    );

    // assert
    expect(addReminder).toHaveBeenCalledWith("Paint house", "home");
  });
});
