import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategorySidebar } from "./CategorySidebar";
import {
  CategorySidebarContext,
  CategorySidebarContextInterface,
} from "./CategorySidebar.context";

describe("CategorySidebar Component", () => {
  it("Renders correctly", () => {
    // arrange
    const dependencies: CategorySidebarContextInterface = {
      useCategorySidebarViewModel: vi.fn(() => ({
        selectedCategory: "category-1",
        categories: ["category-1", "category-2"],
        setSelectedCategory: vi.fn(),
      })),
    };

    render(
      <CategorySidebarContext.Provider value={dependencies}>
        <CategorySidebar />
      </CategorySidebarContext.Provider>,
    );

    // assert
    expect(screen.getByText("Categories")).toBeInTheDocument();
    expect(screen.getByText("category-1")).toBeInTheDocument();
    expect(screen.getByText("category-2")).toBeInTheDocument();

    expect(screen.getByText("category-1")).toHaveStyle("font-weight: bold");
  });

  it("Calls the correct handler when selecting a category", async () => {
    // arrange
    const setSelectedCategory = vi.fn();

    const dependencies: CategorySidebarContextInterface = {
      useCategorySidebarViewModel: vi.fn(() => ({
        selectedCategory: "selected-category",
        categories: ["category-1", "category-2"],
        setSelectedCategory,
      })),
    };

    render(
      <CategorySidebarContext.Provider value={dependencies}>
        <CategorySidebar />
      </CategorySidebarContext.Provider>,
    );

    // act
    await userEvent.click(screen.getByText("category-1"));

    // assert
    expect(setSelectedCategory).toHaveBeenCalledWith("category-1");
  });
});
