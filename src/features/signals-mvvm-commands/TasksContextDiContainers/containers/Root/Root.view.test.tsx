import { render, screen } from "@testing-library/react";
import { Root } from "./Root.view";
import { useRootViewModel } from "./Root.view-model";
import { RootContext, RootContextInterface } from "./Root.view.context";
import { createQueryClient } from "../../utils/create-query-client";

describe("Root", () => {
  it("Renders correctly", () => {
    // arrange
    const dependencies: RootContextInterface = {
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
