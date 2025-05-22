import { render, screen } from "@testing-library/react";
import { Root, RootDependencies } from "./Root.view";
import { useRootViewModel } from "./Root.view-model";
import { QueryClient } from "@tanstack/query-core";

describe("Root", () => {
  it("Renders correctly", () => {
    // arrange
    const dependencies: RootDependencies = {
      useRootViewModel: () => ({
        commands: {} as ReturnType<typeof useRootViewModel>["commands"],
        queryClient: new QueryClient(),
      }),
      App: () => <div data-testid="App" />,
    };

    render(<Root dependencies={dependencies} />);

    // assert
    expect(screen.getByTestId("App")).toBeInTheDocument();
  });
});
