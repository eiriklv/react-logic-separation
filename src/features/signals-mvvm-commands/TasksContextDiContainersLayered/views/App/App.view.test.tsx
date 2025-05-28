import { render, screen } from "@testing-library/react";
import { App } from "./App.view";
import { useAppViewModel } from "./App.view-model";
import { AppContext } from "./App.view.context";
import { AppDependencies } from "./App.view.dependencies";

/**
 * Optional: Remove the default dependencies from the test
 * so that we avoid the unnecessary collect-time
 */
vi.mock("./App.view.dependencies", () => ({ default: {} }));

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

    render(
      <AppContext.Provider value={dependencies}>
        <App />
      </AppContext.Provider>,
    );

    // assert
    expect(screen.getByTestId("Actions")).toBeInTheDocument();
    expect(screen.getByTestId("Filters")).toBeInTheDocument();
    expect(screen.getByTestId("TaskList")).toBeInTheDocument();
  });
});
