import { Meta, StoryObj } from "@storybook/react";
import { App } from "./App.view";
import { QueryClient } from "@tanstack/query-core";
import { Task, User } from "../../types";
import { QueryClientProvider } from "@tanstack/react-query";
import { createProviderTree } from "../../../../../lib/create-provider-tree";
import {
  ServicesContext,
  ServicesContextInterface,
} from "../../providers/services.provider";
import {
  ModelsContext,
  ModelsContextInterface,
} from "../../providers/models.provider";
import { TasksModel } from "../../models/tasks.model";
import { UsersModel } from "../../models/users.model";
import { SelectedFiltersModel } from "../../models/selected-filters.model";

const meta = {
  render: (_, { parameters }) => {
    // create query client for test
    const queryClient = new QueryClient();

    // create mock tasks
    const mockTasks: Task[] = parameters.tasks;

    // create mock users
    const mockUsers: User[] = parameters.users;

    // create mock services
    const services: ServicesContextInterface = {
      tasksService: {
        addTask: async () => ({
          id: "1",
          text: "task",
          ownerId: "user-1",
        }),
        deleteTask: async () => {},
        listTasks: async () => mockTasks,
      },
      usersService: {
        getUserById: async (userId) => {
          return mockUsers.find((user) => user.id === userId);
        },
        listUsers: async () => mockUsers,
      },
    };

    // create mock models
    const models: ModelsContextInterface = {
      tasksModel: new TasksModel(queryClient, services),
      usersModel: new UsersModel(queryClient, services),
      selectedFiltersModel: new SelectedFiltersModel(),
    };

    /**
     * Create provider tree
     */
    const Providers = createProviderTree([
      <QueryClientProvider client={queryClient} />,
      <ServicesContext.Provider value={services} />,
      <ModelsContext.Provider value={models} />,
    ]);

    /**
     * Render a version that injects all the dependencies
     * we created further up so that we can test our integration
     */
    return (
      <Providers>
        <App />
      </Providers>
    );
  },
  tags: ["autodocs"],
} satisfies Meta<typeof App>;

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
