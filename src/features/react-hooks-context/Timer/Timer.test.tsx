import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Timer } from "./Timer";
import { TimerContext, TimerContextInterface } from "./context";

describe("Timer Component", () => {
  it("Renders correctly", () => {
    // arrange
    const dependencies: TimerContextInterface = {
      useTimerModel: () => ({
        elapsedSeconds: 10,
        isRunning: false,
        startTimer: async () => {},
        stopTimer: async () => {},
      })
    };

    render(
      <TimerContext.Provider value={dependencies}>
        <Timer />
      </TimerContext.Provider>
    );

    // assert
    expect(screen.getByText("Timer")).toBeInTheDocument();
  });

  it("Calls the correct handlers for start and stop", async () => {
    // arrange
    const startTimer = vi.fn();
    const stopTimer = vi.fn();

    const dependencies: TimerContextInterface = {
      useTimerModel: () => ({
        elapsedSeconds: 10,
        isRunning: false,
        startTimer,
        stopTimer,
      })
    };

    render(
      <TimerContext.Provider value={dependencies}>
        <Timer />
      </TimerContext.Provider>
    );

    // act
    await userEvent.click(screen.getByText("Start"));

    // assert
    expect(startTimer).toHaveBeenCalledTimes(1);

    // act
    await userEvent.click(screen.getByText("Stop"));

    // assert
    expect(stopTimer).toHaveBeenCalledTimes(1);
  });
});