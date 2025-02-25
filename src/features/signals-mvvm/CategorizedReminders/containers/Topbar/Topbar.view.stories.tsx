import { Meta, StoryObj } from "@storybook/react";
import { TopbarContextInterface, TopbarContext } from "./Topbar.view.context";
import { Topbar } from "./Topbar.view";

const meta = {
  component: Topbar,
  title: "Topbar",
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
  args: {},
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
  args: {},
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
  args: {},
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
