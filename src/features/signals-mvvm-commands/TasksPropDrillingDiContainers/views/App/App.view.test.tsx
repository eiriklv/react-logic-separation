import { render, screen } from "@testing-library/react";
import { AppDependencies, App } from "./App.view";
import { useAppViewModel } from "./App.view-model";

describe("App", () => {
  it("Renders correctly", () => {
    // arrange
    const dependencies: AppDependencies = {
      useAppViewModel: () =>
        ({
          models: {},
        }) as ReturnType<typeof useAppViewModel>,
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
