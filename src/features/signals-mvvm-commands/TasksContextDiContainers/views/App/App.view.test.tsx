import { render, screen } from "@testing-library/react";
import { App } from "./App.view";
import { useAppViewModel } from "./App.view-model";
import { AppContext, AppContextInterface } from "./App.view.context";

describe("App", () => {
  it("Renders correctly", () => {
    // arrange
    const dependencies: AppContextInterface = {
      useAppViewModel: () =>
        ({
          models: {},
        }) as ReturnType<typeof useAppViewModel>,
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
