import { Meta, StoryObj } from "@storybook/react";
import { App } from "./App.view";
import { useAppViewModel } from "./App.view-model";

const meta = {
  component: App,
  title: "App",
  tags: ["autodocs"],
} satisfies Meta<typeof App>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    dependencies: {
      useAppViewModel: () => ({
        models: {} as ReturnType<typeof useAppViewModel>["models"],
      }),
      Actions: () => <>Actions</>,
      Filters: () => <>Filters</>,
      TaskList: () => <>TaskList</>,
    },
  },
};
