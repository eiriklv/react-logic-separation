import { render, screen } from "@testing-library/react";
import { Root } from "./Root.view";
import { useRootViewModel } from "./Root.view-model";
import { RootContext } from "./Root.view.context";
import { createQueryClient } from "../../utils/create-query-client";
import { RootDependencies } from "./Root.view.dependencies";

/**
 * Optional: Remove the default dependencies from the test
 * so that we avoid the unnecessary collect-time and side-effects
 */
vi.mock("./Root.view.dependencies", () => ({ default: {} }));

describe("Root", () => {
  it("Renders correctly", () => {
    // arrange
    const dependencies: RootDependencies = {
      useRootViewModel: () => ({
        commands: {} as ReturnType<typeof useRootViewModel>["commands"],
        queryClient: createQueryClient(),
      }),
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
