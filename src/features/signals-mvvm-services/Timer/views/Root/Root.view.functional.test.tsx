import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Root } from "./Root.view";
import defaultDependencies, {
  RootDependencies,
} from "./Root.view.dependencies";

describe("Root Functional (e2e)", () => {
  it("should be able to use timer as expected", async () => {
    // create root dependencies
    const rootDependencies: RootDependencies = {
      Timer: defaultDependencies.Timer,
    };

    /**
     * Render a version that injects all the dependencies
     * we created further up so that we can test our integration
     */
    render(<Root dependencies={rootDependencies} />);

    // check that the timer is initially stopped
    await waitFor(() =>
      expect(screen.queryByText(/stopped/)).toBeInTheDocument(),
    );

    // start the timer
    await userEvent.click(screen.getByRole("button", { name: "Start" }));

    // check that the timer has started
    await waitFor(() =>
      expect(screen.queryByText(/running/)).toBeInTheDocument(),
    );

    // check that the timer runs as expected
    await waitFor(() => expect(screen.getByText("1")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText("2")).toBeInTheDocument());

    // stop the timer
    await userEvent.click(screen.getByRole("button", { name: "Stop" }));

    // check that the timer has stopped
    await waitFor(() =>
      expect(screen.queryByText(/stopped/)).toBeInTheDocument(),
    );
  });
});
