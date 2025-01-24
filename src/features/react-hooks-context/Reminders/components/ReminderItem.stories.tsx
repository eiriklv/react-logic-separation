import { Meta, StoryObj } from "@storybook/react";
import { ReminderItem } from "./ReminderItem";

const meta = {
  component: ReminderItem,
  title: "ReminderItem",
  tags: ["autodocs"],
} satisfies Meta<typeof ReminderItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const EmptyReminder: Story = {
  args: {
    reminder: {
      id: "1",
      text: "",
    },
  },
};

export const ShortReminder: Story = {
  args: {
    reminder: {
      id: "1",
      text: "Paint house",
    },
  },
};

export const LongReminder: Story = {
  args: {
    reminder: {
      id: "1",
      text: " This is a very long reminder. This is a very long reminder. This is a very long reminder. This is a very long reminder. This is a very long reminder. This is a very long reminder. This is a very long reminder. This is a very long reminder. This is a very long reminder. This is a very long reminder. This is a very long reminder. This is a very long reminder.",
    },
  },
};
