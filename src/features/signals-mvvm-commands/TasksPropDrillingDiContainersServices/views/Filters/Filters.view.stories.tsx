import { Meta, StoryObj } from "@storybook/react";
import { Filters } from "./Filters.view";

const meta = {
  component: Filters,
  tags: ["autodocs"],
} satisfies Meta<typeof Filters>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoFilterOptions: Story = {
  args: {
    dependencies: {
      useFiltersViewModel: () => ({
        users: [],
        selectedOwnerId: "",
        setSelectedOwnerId: async () => {},
      }),
    },
  },
};

export const NoFilterSelected: Story = {
  args: {
    dependencies: {
      useFiltersViewModel: () => ({
        users: [],
        selectedOwnerId: "",
        setSelectedOwnerId: async () => {},
      }),
    },
  },
};

export const UserFilterSelected: Story = {
  args: {
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
    },
  },
};
