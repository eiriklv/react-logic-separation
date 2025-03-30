import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Topbar } from "./Topbar.view";
import { TopbarContext, TopbarContextInterface } from "./Topbar.view.context";

describe("Topbar Component", () => {
  it("Renders correctly", () => {
    // arrange
    const dependencies: TopbarContextInterface = {
      useTopbarViewModel: vi.fn(() => ({
        selectedCategory: "selected-category",
        categories: ["category-1", "category-2"],
        setSelectedCategory: vi.fn(),
      })),
    };

    render(
      <TopbarContext.Provider value={dependencies}>
        <Topbar />
      </TopbarContext.Provider>,
    );

    // assert
    expect(screen.getByText("Categorized Reminders")).toBeInTheDocument();
    expect(screen.getByText("category-1")).toBeInTheDocument();
    expect(screen.getByText("category-2")).toBeInTheDocument();
    expect(screen.getByDisplayValue("selected-category")).toBeInTheDocument();
  });

  it("Calls the correct handler when changing the category", async () => {
    // arrange
    const setSelectedCategory = vi.fn();

    const dependencies: TopbarContextInterface = {
      useTopbarViewModel: vi.fn(() => ({
        selectedCategory: "selected-category",
        categories: ["category-1", "category-2"],
        setSelectedCategory,
      })),
    };

    render(
      <TopbarContext.Provider value={dependencies}>
        <Topbar />
      </TopbarContext.Provider>,
    );

    // act
    await userEvent.type(
      screen.getByLabelText("Selected category:"),
      "{backspace}",
    );

    // assert
    expect(setSelectedCategory).toHaveBeenCalledWith("selected-categor");
  });
});
