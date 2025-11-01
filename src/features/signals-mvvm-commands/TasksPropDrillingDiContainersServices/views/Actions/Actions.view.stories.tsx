import { Meta, StoryObj } from "@storybook/react";
import { Actions } from "./Actions.view";

const meta = {
  component: Actions,
  title: "Actions",
  tags: ["autodocs"],
} satisfies Meta<typeof Actions>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoUsersAvailable: Story = {
  args: {
    dependencies: {
      useActionsViewModel: () => ({
        users: [],
        addTask: async () => {},
      }),
    },
  },
};

export const SingleUserAvailable: Story = {
  args: {
    dependencies: {
      useActionsViewModel: () => ({
        users: [
          {
            id: "user-1",
            name: "John Doe",
            profileImageUrl: "./src/test.png",
          },
        ],
        addTask: async () => {},
      }),
    },
  },
};

export const MultipleUsersAvailable: Story = {
  args: {
    dependencies: {
      useActionsViewModel: () => ({
        users: [
          {
            id: "user-1",
            name: "John Doe",
            profileImageUrl: "./src/test.png",
          },
          {
            id: "user-2",
            name: "Jane Doe",
            profileImageUrl: "./src/test.png",
          },
        ],
        addTask: async () => {},
      }),
    },
  },
};
