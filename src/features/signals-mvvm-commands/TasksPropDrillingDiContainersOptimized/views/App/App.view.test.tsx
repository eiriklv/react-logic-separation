import { render, screen } from "@testing-library/react";
import { App } from "./App.view";
import { useAppViewModel } from "./App.view-model";
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
      useAppViewModel: () => ({
        models: {} as ReturnType<typeof useAppViewModel>["models"],
      }),
      Actions: () => <div data-testid="Actions" />,
      Filters: () => <div data-testid="Filters" />,
      TaskList: () => <div data-testid="TaskList" />,
    };

    render(<App dependencies={dependencies} />);

    // assert
    expect(screen.getByTestId("Actions")).toBeInTheDocument();
    expect(screen.getByTestId("Filters")).toBeInTheDocument();
    expect(screen.getByTestId("TaskList")).toBeInTheDocument();
  });
});
