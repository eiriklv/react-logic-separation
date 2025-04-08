import { render, screen } from "@testing-library/react";
import { Root } from "./Root.view";
import { useRootViewModel } from "./Root.view-model";
import { QueryClient } from "@tanstack/query-core";
import { RootContext, RootContextInterface } from "./Root.view.context";

describe("Root", () => {
  it("Renders correctly", () => {
    // arrange
    const dependencies: RootContextInterface = {
      useRootViewModel: () =>
        ({
          commands: {},
          queryClient: new QueryClient(),
        }) as ReturnType<typeof useRootViewModel>,
      App: () => <div data-testid="App" />,
    };

    render(
      <RootContext.Provider value={dependencies}>
        <Root />
      </RootContext.Provider>,
    );

    // assert
    expect(screen.getByTestId("App")).toBeInTheDocument();
  });
});
