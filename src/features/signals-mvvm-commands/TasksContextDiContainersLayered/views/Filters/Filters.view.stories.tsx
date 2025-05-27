import { Meta, StoryObj } from "@storybook/react";
import { FiltersContext } from "./Filters.view.context";
import { Filters } from "./Filters.view";
import { FiltersDependencies } from "./Filters.view.dependencies";

const meta = {
  component: Filters,

  decorators: [
    (story, { parameters }) => {
      return (
        <FiltersContext.Provider value={parameters.dependencies}>
          {story()}
        </FiltersContext.Provider>
      );
    },
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Filters>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoFilterOptions: Story = {
  args: {},
  parameters: {
    dependencies: {
      useFiltersViewModel: () => ({
        users: [],
        selectedOwnerId: "",
        setSelectedOwnerId: async () => {},
      }),
    } satisfies FiltersDependencies,
  },
};

export const NoFilterSelected: Story = {
  args: {},
  parameters: {
    dependencies: {
      useFiltersViewModel: () => ({
        users: [],
        selectedOwnerId: "",
        setSelectedOwnerId: async () => {},
      }),
    } satisfies FiltersDependencies,
  },
};

export const UserFilterSelected: Story = {
  args: {},
  parameters: {
    dependencies: {
      useFiltersViewModel: () => ({
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
        setSelectedOwnerId: async () => {},
      }),
    } satisfies FiltersDependencies,
  },
};
