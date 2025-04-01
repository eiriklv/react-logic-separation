import { Meta, StoryObj } from "@storybook/react";
import { TopbarContextInterface, TopbarContext } from "./Topbar.view.context";
import { Topbar } from "./Topbar.view";
import { SelectedCategoryModel } from "../../models/selected-category.model";

const meta = {
  component: Topbar,

  decorators: [
    (story, { parameters }) => {
      return (
        <TopbarContext.Provider value={parameters.dependencies}>
          {story()}
        </TopbarContext.Provider>
      );
    },
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Topbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const EmptyCategorySelected: Story = {
  args: {
    selectedCategoryModel: {} as SelectedCategoryModel,
  },
  parameters: {
    dependencies: {
      useTopbarViewModel: () => ({
        selectedCategory: "",
        categories: [],
        setSelectedCategory: async () => {},
      }),
    } satisfies TopbarContextInterface,
  },
};

export const AvailableCategorySelected: Story = {
  args: {
    selectedCategoryModel: {} as SelectedCategoryModel,
  },
  parameters: {
    dependencies: {
      useTopbarViewModel: () => ({
        selectedCategory: "category-1",
        categories: ["category-1", "category-2"],
        setSelectedCategory: async () => {},
      }),
    } satisfies TopbarContextInterface,
  },
};

export const UnavailableCategorySelected: Story = {
  args: {
    selectedCategoryModel: {} as SelectedCategoryModel,
  },
  parameters: {
    dependencies: {
      useTopbarViewModel: () => ({
        selectedCategory: "unavailable-category",
        categories: ["category-1", "category-2"],
        setSelectedCategory: async () => {},
      }),
    } satisfies TopbarContextInterface,
  },
};
