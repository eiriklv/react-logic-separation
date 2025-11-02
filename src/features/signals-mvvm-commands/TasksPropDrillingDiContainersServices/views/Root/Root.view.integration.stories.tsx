import { Meta, StoryObj } from "@storybook/react";

import { Task, User } from "../../types";
import { Root } from "./Root.view";
import defaultRootDependencies, {
  RootDependencies,
} from "./Root.view.dependencies";
import defaultRootViewModelDependencies, {
  RootViewModelDependencies,
} from "./Root.view-model.dependencies";
import { generateId } from "../../../../../lib/utils";

const meta = {
  render: (_, { parameters }) => {
    // create mock tasks
    const mockTasks: Task[] = parameters.tasks.slice();

    // create mock users
    const mockUsers: User[] = parameters.users.slice();

    // create mock tasks service
    const tasksService: ReturnType<
      RootViewModelDependencies["createTasksService"]
    > = {
      addTask: async (text, ownerId) => {
        const newTask = {
          id: generateId(),
          text,
          ownerId,
        };

        mockTasks.push(newTask);

        return newTask;
      },
      deleteTask: async (taskId) => {
        mockTasks.splice(
          mockTasks.findIndex(({ id }) => taskId === id),
          1,
        );
      },
      listTasks: async () => mockTasks,
    };

    // create mock users service
    const usersService: ReturnType<
      RootViewModelDependencies["createUsersService"]
    > = {
      getUserById: async (userId) =>
        mockUsers.find((user) => user.id === userId),
      listUsers: async () => mockUsers,
    };

    // create root dependencies
    const rootDependencies: RootDependencies = {
      App: defaultRootDependencies.App,
      useRootViewModel: () =>
        defaultRootDependencies.useRootViewModel({
          dependencies: {
            /**
             * Use real dependencies
             */
            ...defaultRootViewModelDependencies,
            /**
             * ... Except for the services
             */
            createTasksService: () => tasksService,
            createUsersService: () => usersService,
          },
        }),
    };

    /**
     * Render a version that injects all the dependencies
     * we created further up so that we can test our integration
     */
    return <Root dependencies={rootDependencies} />;
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Root>;

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
