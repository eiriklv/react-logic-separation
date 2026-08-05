import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Timer } from "./Timer.view";
import { TimerDependencies } from "./Timer.view.dependencies";

describe("Timer Component", () => {
  it("Renders correctly", () => {
    // arrange
    const dependencies: TimerDependencies = {
      useTimerViewModel: vi.fn(() => ({
        elapsedSeconds: 10,
        isRunning: false,
        startTimer: vi.fn(),
        stopTimer: vi.fn(),
      })),
    };

    render(<Timer dependencies={dependencies} />);

    // assert
    expect(screen.getByText("10")).toBeInTheDocument();

    // assert
    expect(screen.getByText("Timer")).toBeInTheDocument();
  });

  it("Calls the correct handlers for start and stop", async () => {
    // arrange
    const startTimer = vi.fn();
    const stopTimer = vi.fn();

    const dependencies: TimerDependencies = {
      useTimerViewModel: vi.fn(() => ({
        elapsedSeconds: 10,
        isRunning: false,
        startTimer,
        stopTimer,
      })),
    };

    render(<Timer dependencies={dependencies} />);

    // act
    await userEvent.click(screen.getByRole("button", { name: "Start" }));

    // assert
    expect(startTimer).toHaveBeenCalledOnce();

    // act
    await userEvent.click(screen.getByRole("button", { name: "Stop" }));

    // assert
    expect(stopTimer).toHaveBeenCalledOnce();
  });
});
