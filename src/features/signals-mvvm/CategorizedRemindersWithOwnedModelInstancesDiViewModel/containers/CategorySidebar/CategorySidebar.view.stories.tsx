import { Meta, StoryObj } from "@storybook/react";
import {
  CategorySidebarContextInterface,
  CategorySidebarContext,
} from "./CategorySidebar.view.context";
import { CategorySidebar } from "./CategorySidebar.view";
import { SelectedCategoryModel } from "../../models/selected-category.model";

const meta = {
  component: CategorySidebar,

  decorators: [
    (story, { parameters }) => {
      return (
        <CategorySidebarContext.Provider value={parameters.dependencies}>
          {story()}
        </CategorySidebarContext.Provider>
      );
    },
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof CategorySidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoSelectedCategory: Story = {
  args: {
    selectedCategoryModel: {} as SelectedCategoryModel,
  },
  parameters: {
    dependencies: {
      useCategorySidebarViewModel: () => ({
        selectedCategory: "",
        categories: ["category-1", "category-2"],
        setSelectedCategory: async () => {},
      }),
    } satisfies CategorySidebarContextInterface,
  },
};

export const SelectedCategory: Story = {
  args: {
    selectedCategoryModel: {} as SelectedCategoryModel,
  },
  parameters: {
    dependencies: {
      useCategorySidebarViewModel: () => ({
        selectedCategory: "category-1",
        categories: ["category-1", "category-2"],
        setSelectedCategory: async () => {},
      }),
    } satisfies CategorySidebarContextInterface,
  },
};
