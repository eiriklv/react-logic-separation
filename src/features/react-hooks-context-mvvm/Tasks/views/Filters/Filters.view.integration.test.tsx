import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Filters } from "./Filters.view";
import defaultDependencies, {
  FiltersDependencies,
} from "./Filters.view.dependencies";
import { ModelsDependencies } from "./Filters.view-model.dependencies";
import { signal } from "@preact/signals-core";

describe("Filters Component", () => {
  it("Renders correctly", () => {
    // arrange
    const models: ModelsDependencies = {
      selectedFiltersModel: {
        selectedOwnerId: signal("user-1"),
        setSelectedOwnerId: vi.fn(),
      },
      usersModel: {
        users: signal([
          {
            id: "user-1",
            name: "John Doe",
            profileImageUrl: "./src/test.png",
          },
          {
            id: "user-2",
            name: "Jane Doe",
            profileImageUrl: "./src/test-2.png",
          },
        ]),
      },
    };

    const filtersDependencies: FiltersDependencies = {
      useFiltersViewModel: (props) =>
        defaultDependencies.useFiltersViewModel({
          ...props,
          dependencies: {
            useModels: () => models,
          },
        }),
    };

    render(<Filters dependencies={filtersDependencies} />);

    // assert
    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument();
  });

  it("Calls correct handler with correct arguments when selecting an owner", async () => {
    // arrange
    const models: ModelsDependencies = {
      selectedFiltersModel: {
        selectedOwnerId: signal("user-1"),
        setSelectedOwnerId: vi.fn(),
      },
      usersModel: {
        users: signal([
          {
            id: "user-1",
            name: "John Doe",
            profileImageUrl: "./src/test.png",
          },
          {
            id: "user-2",
            name: "Jane Doe",
            profileImageUrl: "./src/test-2.png",
          },
        ]),
      },
    };

    const filtersDependencies: FiltersDependencies = {
      useFiltersViewModel: (props) =>
        defaultDependencies.useFiltersViewModel({
          ...props,
          dependencies: {
            useModels: () => models,
          },
        }),
    };

    render(<Filters dependencies={filtersDependencies} />);

    // assert
    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument();

    // act
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Owner:" }),
      "John Doe",
    );

    // assert
    expect(models.selectedFiltersModel.setSelectedOwnerId).toHaveBeenCalledWith(
      "user-1",
    );
  });
});
