import { render, screen } from "@testing-library/react";
import { Root } from "./Root.view";
import { RootDependencies } from "./Root.view.dependencies";
import { ISdk } from "../sdks/sdk";
import { ITasksService } from "../services/tasks.service";
import { IUsersService } from "../services/users.service";
import { ISelectedFiltersModel } from "../models/selected-filters.model";
import { ITasksModel } from "../models/tasks.model";
import { IUsersModel } from "../models/users.model";
import { createQueryClient } from "../utils/create-query-client";

/**
 * Remove the default dependencies from the test
 * so that we avoid the unnecessary collect-time
 */
vi.mock("./Root.view.dependencies", () => ({ default: {} }));

describe("Root", () => {
  it("Renders correctly", () => {
    // arrange
    const dependencies: RootDependencies = {
      App: () => <div data-testid="App" />,
      Router: ({ children }) => <>{children}</>,
      baseUrl: "test",
      createQueryClient: () => createQueryClient(),
      createSdk: () => ({}) as ISdk,
      createTasksService: () => ({}) as ITasksService,
      createUsersService: () => ({}) as IUsersService,
      useSelectedFiltersModel: () => ({}) as ISelectedFiltersModel,
      useTasksModel: () => ({}) as ITasksModel,
      useUsersModel: () => ({}) as IUsersModel,
    };

    // act
    render(<Root dependencies={dependencies} />);

    // assert
    expect(screen.getByTestId("App")).toBeInTheDocument();
  });
});
