import { Meta, StoryObj } from "@storybook/react";
import { Tasks } from "./Tasks.view";

const meta = {
  component: Tasks,
  title: "Tasks",
  tags: ["autodocs"],
} satisfies Meta<typeof Tasks>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    dependencies: {
      Actions: () => <>Actions</>,
      Filters: () => <>Filters</>,
      TaskList: () => <>TaskList</>,
    },
  },
};
