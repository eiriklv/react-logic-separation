import { render, screen } from "@testing-library/react";
import { Root } from "./Root.view";
import { RootDependencies } from "./Root.view.dependencies";

/**
 * Remove the default dependencies from the test
 * so that we avoid the unnecessary collect-time
 */
vi.mock("./Root.view.dependencies", () => ({ default: {} }));

describe("Root", () => {
  it("Renders correctly", () => {
    // arrange
    const dependencies: RootDependencies = {
      Timer: () => <div data-testid="Timer" />,
    };

    // act
    render(<Root dependencies={dependencies} />);

    // assert
    expect(screen.getByTestId("Timer")).toBeInTheDocument();
  });
});
