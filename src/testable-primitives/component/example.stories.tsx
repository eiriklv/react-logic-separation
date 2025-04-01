import { Meta, StoryObj } from "@storybook/react";
import { Example } from "./example";

const meta = {
  component: Example,

  tags: ["autodocs"],
} satisfies Meta<typeof Example>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
