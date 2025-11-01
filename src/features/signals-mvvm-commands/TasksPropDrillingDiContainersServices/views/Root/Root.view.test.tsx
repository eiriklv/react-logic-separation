import { render, screen } from "@testing-library/react";
import { Root } from "./Root.view";
import { useRootViewModel } from "./Root.view-model";
import { QueryClient } from "@tanstack/query-core";
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
      useRootViewModel: () => ({
        queryClient: new QueryClient(),
        services: {} as ReturnType<typeof useRootViewModel>["services"],
        models: {} as ReturnType<typeof useRootViewModel>["models"],
      }),
      App: () => <div data-testid="App" />,
    };

    render(<Root dependencies={dependencies} />);

    // assert
    expect(screen.getByTestId("App")).toBeInTheDocument();
  });
});
