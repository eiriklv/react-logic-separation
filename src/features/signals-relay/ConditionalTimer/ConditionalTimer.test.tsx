import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConditionalTimer } from "./ConditionalTimer";
import {
  ConditionalTimerContext,
  ConditionalTimerContextInterface,
} from "./ConditionalTimer.context";

describe("ConditionalTimer Component", () => {
  it("Renders correctly", () => {
    // arrange
    const dependencies: ConditionalTimerContextInterface = {
      useElapsedSeconds: () => 10,
      useIsOkay: () => false,
      useIsSafe: () => false,
      useIsCool: () => false,
      useIsRunning: () => false,
      useToggleOkay: () => async () => {},
      useToggleSafe: () => async () => {},
      useToggleCool: () => async () => {},
      useResetTimer: () => async () => {},
    };

    render(
      <ConditionalTimerContext.Provider value={dependencies}>
        <ConditionalTimer />
      </ConditionalTimerContext.Provider>
    );

    // assert
    expect(screen.getByText("Conditional Timer")).toBeInTheDocument();

    // assert
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("Calls the correct handlers for toggling all the condition of the timer", async () => {
    // arrange
    const toggleOkay = vi.fn();
    const toggleSafe = vi.fn();
    const toggleCool = vi.fn();
    const resetTimer = vi.fn();

    const dependencies: ConditionalTimerContextInterface = {
      useElapsedSeconds: () => 10,
      useIsOkay: () => false,
      useIsSafe: () => false,
      useIsCool: () => false,
      useIsRunning: () => false,
      useToggleOkay: () => toggleOkay,
      useToggleSafe: () => toggleSafe,
      useToggleCool: () => toggleCool,
      useResetTimer: () => resetTimer,
    };

    render(
      <ConditionalTimerContext.Provider value={dependencies}>
        <ConditionalTimer />
      </ConditionalTimerContext.Provider>
    );

    // act
    await userEvent.click(screen.getByText("Okay"));

    // assert
    expect(toggleOkay).toHaveBeenCalledTimes(1);

    // act
    await userEvent.click(screen.getByText("Safe"));

    // assert
    expect(toggleSafe).toHaveBeenCalledTimes(1);

    // act
    await userEvent.click(screen.getByText("Cool"));

    // assert
    expect(toggleCool).toHaveBeenCalledTimes(1);

    // act
    await userEvent.click(screen.getByText("Reset"));

    // assert
    expect(resetTimer).toHaveBeenCalledTimes(1);
  });
});
