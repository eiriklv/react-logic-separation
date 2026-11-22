import { Meta, StoryObj } from "@storybook/react";
import { HomePage } from "./HomePage.view";

const meta = {
  component: HomePage,
  tags: ["autodocs"],
} satisfies Meta<typeof HomePage>;

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
