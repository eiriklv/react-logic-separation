import { Meta, StoryObj } from "@storybook/react";
import {
  RemindersContextInterface,
  RemindersContext,
} from "./Reminders.context";
import { Reminders } from "./Reminders";

const meta = {
  component: Reminders,
  decorators: [
    (story, { parameters }) => {
      return (
        <RemindersContext.Provider value={parameters.dependencies}>
          {story()}
        </RemindersContext.Provider>
      );
    },
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Reminders>;

export default meta;

type Story = StoryObj<typeof meta>;

export const UninitializedList: Story = {
  args: {},
  parameters: {
    dependencies: {
      useReminders: () => [],
      useRemindersCount: () => 0,
      useAddReminder: () => async () => {},
      useIsLoading: () => true,
      useIsSaving: () => false,
      useIsFetching: () => false,
      ReminderItem: ({ reminder }) => <li>{reminder.text}</li>,
    } satisfies RemindersContextInterface,
  },
};

export const EmptyList: Story = {
  args: {},
  parameters: {
    dependencies: {
      useReminders: () => [],
      useRemindersCount: () => 0,
      useAddReminder: () => async () => {},
      useIsLoading: () => false,
      useIsSaving: () => false,
      useIsFetching: () => false,
      ReminderItem: ({ reminder }) => <li>{reminder.text}</li>,
    } satisfies RemindersContextInterface,
  },
};

export const ListWithItems: Story = {
  args: {},
  parameters: {
    dependencies: {
      useReminders: () => [
        { id: "1", text: "Buy milk" },
        { id: "2", text: "Paint house" },
      ],
      useRemindersCount: () => 2,
      useAddReminder: () => async () => {},
      useIsLoading: () => false,
      useIsSaving: () => false,
      useIsFetching: () => false,
      ReminderItem: ({ reminder }) => <li>{reminder.text}</li>,
    } satisfies RemindersContextInterface,
  },
};

export const SavingReminders: Story = {
  args: {},
  parameters: {
    dependencies: {
      useReminders: () => [
        { id: "1", text: "Buy milk" },
        { id: "2", text: "Paint house" },
      ],
      useRemindersCount: () => 2,
      useAddReminder: () => async () => {},
      useIsLoading: () => false,
      useIsSaving: () => true,
      useIsFetching: () => false,
      ReminderItem: ({ reminder }) => <li>{reminder.text}</li>,
    } satisfies RemindersContextInterface,
  },
};
