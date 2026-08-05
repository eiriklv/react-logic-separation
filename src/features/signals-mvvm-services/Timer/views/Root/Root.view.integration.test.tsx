import { render, screen } from "@testing-library/react";

import { Root } from "./Root.view";
import defaultDependencies, {
  RootDependencies,
} from "./Root.view.dependencies";
import { ComponentProps } from "react";
import { userEvent } from "@testing-library/user-event";

describe("Root", () => {
  it("Renders correctly", async () => {
    const timerViewModelMock: ReturnType<
      NonNullable<
        ComponentProps<RootDependencies["Timer"]>["dependencies"]
      >["useTimerViewModel"]
    > = {
      elapsedSeconds: 10,
      isRunning: true,
      startTimer: vi.fn(),
      stopTimer: vi.fn(),
    };

    const timerDependencies: ComponentProps<
      RootDependencies["Timer"]
    >["dependencies"] = {
      useTimerViewModel: vi.fn(() => timerViewModelMock),
    };

    // create root dependencies
    const rootDependencies: RootDependencies = {
      Timer: () => (
        <defaultDependencies.Timer dependencies={timerDependencies} />
      ),
    };

    /**
     * Render a version that injects all the dependencies
     * we created further up so that we can test our integration
     */
    render(<Root dependencies={rootDependencies} />);

    // Check that app renders correctly
    expect(screen.getByText("Timer")).toBeInTheDocument();

    // Check that data from view model is integrated correctly
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.queryByText(/running/)).toBeInTheDocument();

    // Check that methods from view model is integrated correctly
    // act
    await userEvent.click(screen.getByRole("button", { name: "Start" }));

    // assert
    expect(timerViewModelMock.startTimer).toHaveBeenCalledOnce();

    // act
    await userEvent.click(screen.getByRole("button", { name: "Stop" }));

    // assert
    expect(timerViewModelMock.stopTimer).toHaveBeenCalledOnce();
  });
});
