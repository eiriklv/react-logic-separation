import { render, screen } from "@testing-library/react";

import { Root } from "./Root.view";
import defaultDependencies, {
  RootDependencies,
} from "./Root.view.dependencies";
import { createQueryClient } from "../../utils/create-query-client";
import { ISdk } from "../../sdks/sdk";
import { ISelectedFiltersModel } from "../../models/selected-filters.model";
import { ITasksModel } from "../../models/tasks.model";
import { IUsersModel } from "../../models/users.model";
import { ITasksService } from "../../services/tasks.service";
import { IUsersService } from "../../services/users.service";

describe("Root", () => {
  it("Renders correctly", async () => {
    // create root dependencies
    const rootDependencies: RootDependencies = {
      App: () => (
        <defaultDependencies.App
          dependencies={{
            HomePage: () => <div data-testid="HomePage" />,
          }}
        />
      ),
      useRootViewModel: () =>
        defaultDependencies.useRootViewModel({
          dependencies: {
            baseUrl: "fake",
            createQueryClient: () => createQueryClient(),
            createSdk: () => ({}) as ISdk,
            useSelectedFiltersModel: () => ({}) as ISelectedFiltersModel,
            useTasksModel: () => ({}) as ITasksModel,
            useUsersModel: () => ({}) as IUsersModel,
            createTasksService: () => ({}) as ITasksService,
            createUsersService: () => ({}) as IUsersService,
          },
        }),
    };

    /**
     * Render a version that injects all the dependencies
     * we created further up so that we can test our integration
     */
    render(<Root dependencies={rootDependencies} />);

    // Check that app renders correctly
    expect(screen.getByTestId("HomePage")).toBeInTheDocument();

    /**
     * TODO(eiriklv): What more should be checked here to ensure the single depth integration?
     *
     * - Check that return values from the view model is mapped to the correct providers
     * - To do this we will have to inject the provider components as dependencies
     * - That means we'll have to update the unit test as well
     */
  });
});
