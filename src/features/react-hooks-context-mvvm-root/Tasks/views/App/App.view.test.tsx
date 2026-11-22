import { render, screen } from "@testing-library/react";
import { App } from "./App.view";
import { AppDependencies } from "./App.view.dependencies";

/**
 * Remove the default dependencies from the test
 * so that we avoid the unnecessary collect-time
 */
vi.mock("./Actions.view.dependencies", () => ({ default: {} }));

describe("App", () => {
  it("Renders correctly", () => {
    // arrange
    const dependencies: AppDependencies = {
      HomePage: () => <div data-testid="HomePage" />,
    };

    render(<App dependencies={dependencies} />);

    // assert
    expect(screen.getByTestId("HomePage")).toBeInTheDocument();
  });
});
