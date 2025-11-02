import { Meta, StoryObj } from "@storybook/react";
import { App } from "./App.view";

const meta = {
  component: App,
  tags: ["autodocs"],
} satisfies Meta<typeof App>;

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
