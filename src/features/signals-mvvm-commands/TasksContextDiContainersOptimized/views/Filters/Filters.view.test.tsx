import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Filters } from "./Filters.view";
import { FiltersContext } from "./Filters.view.context";
import { FiltersDependencies } from "./Filters.view.dependencies";

/**
 * Remove the default dependencies from the test
 * so that we avoid the unnecessary collect-time
 */
vi.mock("./Filters.view.dependencies", () => ({ default: {} }));

describe("Filters Component", () => {
  it("Renders correctly", () => {
    // arrange
    const dependencies: FiltersDependencies = {
      useFiltersViewModel: vi.fn(() => ({
        users: [
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
        ],
        selectedOwnerId: "user-1",
        setSelectedOwnerId: vi.fn(),
      })),
    };

    render(
      <FiltersContext.Provider value={dependencies}>
        <Filters />
      </FiltersContext.Provider>,
    );

    // assert
    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument();
  });

  it("Calls correct handler with correct arguments when selecting an owner", async () => {
    // arrange
    const setSelectedOwnerId = vi.fn();

    const dependencies: FiltersDependencies = {
      useFiltersViewModel: vi.fn(() => ({
        users: [
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
        ],
        selectedOwnerId: "",
        setSelectedOwnerId,
      })),
    };

    render(
      <FiltersContext.Provider value={dependencies}>
        <Filters />
      </FiltersContext.Provider>,
    );

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
    expect(setSelectedOwnerId).toHaveBeenCalledWith("user-1");
  });
});
