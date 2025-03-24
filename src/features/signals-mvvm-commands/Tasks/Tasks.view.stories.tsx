import { Meta, StoryObj } from "@storybook/react";
import { TasksContextInterface, TasksContext } from "./Tasks.view.context";
import { Tasks } from "./Tasks.view";

const meta = {
  component: Tasks,
  title: "Tasks",
  decorators: [
    (story, { parameters }) => {
      return (
        <TasksContext.Provider value={parameters.dependencies}>
          {story()}
        </TasksContext.Provider>
      );
    },
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Tasks>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    dependencies: {
      Actions: () => <>Actions</>,
      Filters: () => <>Filters</>,
      TaskList: () => <>TaskList</>,
    } satisfies TasksContextInterface,
  },
};
