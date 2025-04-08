import { Meta, StoryObj } from "@storybook/react";
import { App } from "./App.view";
import { QueryClient } from "@tanstack/query-core";
import { Task, User } from "../../types";
import { ComponentType } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  CommandsContext,
  CommandsContextInterface,
} from "../../providers/commands.provider";
import { createProviderTree } from "../../../../../lib/create-provider-tree";

type Props = {
  children?: JSX.Element;
};

const Container: ComponentType<Props> = ({ children }) => {
  return <>{children}</>;
};

const meta = {
  component: Container,
  title: "Tasks",
  decorators: [
    (Story, { parameters }) => {
      // create query client for test
      const queryClient = new QueryClient();

      // create mock tasks
      const mockTasks: Task[] = parameters.tasks;

      // create mock users
      const mockUsers: User[] = parameters.users;

      // create mock commands
      const commands: CommandsContextInterface = {
        listTasksCommand: async () => mockTasks,
        addTaskCommand: async () => ({
          id: "1",
          text: "task",
          ownerId: "user-1",
        }),
        deleteTaskCommand: async () => {},
        getUserCommand: async (userId) => {
          return mockUsers.find((user) => user.id === userId);
        },
        listUsersCommand: async () => mockUsers,
      };

      /**
       * Create provider tree
       */
      const Providers = createProviderTree([
        <QueryClientProvider client={queryClient} />,
        <CommandsContext.Provider value={commands} />,
      ]);

      /**
       * Render a version that injects all the dependencies
       * we created further up so that we can test our integration
       */
      return (
        <Story>
          <Providers>
            <App />
          </Providers>
        </Story>
      );
    },
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Container>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    tasks: [
      { id: "1", text: "Task 1", ownerId: "user-1" },
      { id: "2", text: "Task 2", ownerId: "user-1" },
      { id: "3", text: "Task 3", ownerId: "user-2" },
      { id: "4", text: "Task 4", ownerId: "user-2" },
    ] satisfies Task[],
    users: [
      { id: "user-1", name: "User 1", profileImageUrl: "./src/user-1" },
      { id: "user-2", name: "User 2", profileImageUrl: "./src/user-2" },
    ] satisfies User[],
  },
};

export const NoTasksNoUsers: Story = {
  args: {},
  parameters: {
    tasks: [] satisfies Task[],
    users: [] satisfies User[],
  },
};
