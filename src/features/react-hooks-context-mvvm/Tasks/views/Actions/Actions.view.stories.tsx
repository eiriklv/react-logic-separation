import { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Actions } from "./Actions.view";

const meta = {
  component: Actions,
  tags: ["autodocs"],
} satisfies Meta<typeof Actions>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoUsersAvailable: Story = {
  args: {
    dependencies: {
      useActionsViewModel: () => ({
        users: [],
        addTask: fn(),
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
        addTask: fn(),
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
        addTask: fn(),
      }),
    },
  },
};
