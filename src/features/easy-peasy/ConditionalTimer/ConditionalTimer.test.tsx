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
      useToggleOkay: () => vi.fn(),
      useToggleSafe: () => vi.fn(),
      useToggleCool: () => vi.fn(),
      useResetTimer: () => vi.fn(),
    };

    render(
      <ConditionalTimerContext.Provider value={dependencies}>
        <ConditionalTimer />
      </ConditionalTimerContext.Provider>,
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
      </ConditionalTimerContext.Provider>,
    );

    // act
    await userEvent.click(screen.getByText("Okay"));

    // assert
    expect(toggleOkay).toHaveBeenCalledOnce();

    // act
    await userEvent.click(screen.getByText("Safe"));

    // assert
    expect(toggleSafe).toHaveBeenCalledOnce();

    // act
    await userEvent.click(screen.getByText("Cool"));

    // assert
    expect(toggleCool).toHaveBeenCalledOnce();

    // act
    await userEvent.click(screen.getByText("Reset"));

    // assert
    expect(resetTimer).toHaveBeenCalledOnce();
  });
});
