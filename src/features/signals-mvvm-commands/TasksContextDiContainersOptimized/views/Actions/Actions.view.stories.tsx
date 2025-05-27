import { Meta, StoryObj } from "@storybook/react";
import { ActionsContext } from "./Actions.view.context";
import { Actions } from "./Actions.view";
import { ActionsDependencies } from "./Actions.view.dependencies";

const meta = {
  component: Actions,

  decorators: [
    (story, { parameters }) => {
      return (
        <ActionsContext.Provider value={parameters.dependencies}>
          {story()}
        </ActionsContext.Provider>
      );
    },
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Actions>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoUsersAvailable: Story = {
  args: {},
  parameters: {
    dependencies: {
      useActionsViewModel: () => ({
        users: [],
        addTask: async () => {},
      }),
    } satisfies ActionsDependencies,
  },
};

export const SingleUserAvailable: Story = {
  args: {},
  parameters: {
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
    } satisfies ActionsDependencies,
  },
};

export const MultipleUsersAvailable: Story = {
  args: {},
  parameters: {
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
    } satisfies ActionsDependencies,
  },
};
