import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Timer } from "./Timer.view";
import defaultDependencies, {
  TimerDependencies,
} from "./Timer.view.dependencies";
import { TimerViewModelDependencies } from "./Timer.view-model.dependencies";
import { signal } from "@preact/signals-core";

describe("Timer Component", () => {
  it("Integrates correctly with view model", async () => {
    // arrange
    const mockTimerModel: ReturnType<
      TimerViewModelDependencies["createTimerModel"]
    > = {
      elapsedSeconds: signal(10),
      isRunning: signal(true),
      startTimer: vi.fn(),
      stopTimer: vi.fn(),
      dispose: vi.fn(),
    };

    const timerViewModelDependencies: TimerViewModelDependencies = {
      createTimerModel: vi.fn(() => mockTimerModel),
    };

    const dependencies: TimerDependencies = {
      useTimerViewModel: () =>
        defaultDependencies.useTimerViewModel({
          dependencies: timerViewModelDependencies,
        }),
    };

    render(<Timer dependencies={dependencies} />);

    // assert
    expect(screen.getByText("10")).toBeInTheDocument();

    // assert
    expect(screen.getByText("Timer")).toBeInTheDocument();

    // assert
    await waitFor(() =>
      expect(screen.queryByText(/running/)).toBeInTheDocument(),
    );

    // act
    await userEvent.click(screen.getByRole("button", { name: "Start" }));

    // assert
    expect(mockTimerModel.startTimer).toHaveBeenCalledOnce();

    // act
    await userEvent.click(screen.getByRole("button", { name: "Stop" }));

    // assert
    expect(mockTimerModel.stopTimer).toHaveBeenCalledOnce();
  });
});
