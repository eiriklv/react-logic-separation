import { Meta, StoryObj } from "@storybook/react";
import {
  CategorySidebarContextInterface,
  CategorySidebarContext,
} from "./CategorySidebar.context";
import { CategorySidebar } from "./CategorySidebar";

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
  args: {},
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
  args: {},
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
