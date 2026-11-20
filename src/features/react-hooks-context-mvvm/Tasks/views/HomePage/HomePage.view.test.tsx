import { render, screen } from "@testing-library/react";
import { HomePage } from "./HomePage.view";
import { HomePageDependencies } from "./HomePage.view.dependencies";

/**
 * Remove the default dependencies from the test
 * so that we avoid the unnecessary collect-time
 */
vi.mock("./Actions.view.dependencies", () => ({ default: {} }));

describe("HomePage", () => {
  it("Renders correctly", () => {
    // arrange
    const dependencies: HomePageDependencies = {
      Actions: () => <div data-testid="Actions" />,
      Filters: () => <div data-testid="Filters" />,
      TaskList: () => <div data-testid="TaskList" />,
    };

    render(<HomePage dependencies={dependencies} />);

    // assert
    expect(screen.getByTestId("Actions")).toBeInTheDocument();
    expect(screen.getByTestId("Filters")).toBeInTheDocument();
    expect(screen.getByTestId("TaskList")).toBeInTheDocument();
  });
});
