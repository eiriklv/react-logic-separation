import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Timer } from "./Timer";
import { TimerContext, TimerContextInterface } from "./Timer.context";

describe("Timer Component", () => {
  it("Renders correctly", () => {
    // arrange
    const dependencies: TimerContextInterface = {
      useTimerViewModel: vi.fn(() => ({
        elapsedSeconds: 10,
        isRunning: false,
        startTimer: vi.fn(),
        stopTimer: vi.fn(),
      })),
    };

    render(
      <TimerContext.Provider value={dependencies}>
        <Timer />
      </TimerContext.Provider>,
    );

    // assert
    expect(screen.getByText("10")).toBeInTheDocument();

    // assert
    expect(screen.getByText("Timer")).toBeInTheDocument();
  });

  it("Calls the correct handlers for start and stop", async () => {
    // arrange
    const startTimer = vi.fn();
    const stopTimer = vi.fn();

    const dependencies: TimerContextInterface = {
      useTimerViewModel: vi.fn(() => ({
        elapsedSeconds: 10,
        isRunning: false,
        startTimer,
        stopTimer,
      })),
    };

    render(
      <TimerContext.Provider value={dependencies}>
        <Timer />
      </TimerContext.Provider>,
    );

    // act
    await userEvent.click(screen.getByText("Start"));

    // assert
    expect(startTimer).toHaveBeenCalledOnce();

    // act
    await userEvent.click(screen.getByText("Stop"));

    // assert
    expect(stopTimer).toHaveBeenCalledOnce();
  });
});
