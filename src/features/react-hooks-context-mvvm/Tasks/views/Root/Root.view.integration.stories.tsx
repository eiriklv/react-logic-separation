import { Meta, StoryObj } from "@storybook/react";

import { Task, User } from "../../types";
import { Root } from "./Root.view";
import defaultRootDependencies, {
  RootDependencies,
} from "./Root.view.dependencies";
import defaultRootViewModelDependencies from "./Root.view-model.dependencies";
import { createTasksServiceMock } from "../../services/tasks.service.mock";
import { createUsersServiceMock } from "../../services/users.service.mock";

const meta = {
  render: (_, { parameters }) => {
    // Parse parameters
    const initialTasks: Task[] = parameters.tasks;
    const initialUsers: User[] = parameters.users;

    // create mock tasks service
    const tasksService = createTasksServiceMock(undefined, {
      initialTasks,
    });

    // create mock users service
    const usersService = createUsersServiceMock(undefined, {
      initialUsers,
    });

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
