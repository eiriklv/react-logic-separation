import { Meta, StoryObj } from "@storybook/react";
import {
  Reminders,
  RemindersContextInterface,
  RemindersContext,
} from "./Reminders";

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
      useRemindersModel: () => ({
        reminders: [],
        remindersCount: 0,
        addReminder: async () => {},
        isLoading: false,
        isSaving: false,
        isFetching: false,
      }),
      ReminderItem: ({ reminder }) => <li>{reminder.text}</li>,
    } satisfies RemindersContextInterface,
  },
};

export const EmptyList: Story = {
  args: {},
  parameters: {
    dependencies: {
      useRemindersModel: () => ({
        reminders: [],
        remindersCount: 0,
        addReminder: async () => {},
        isLoading: true,
        isSaving: false,
        isFetching: false,
      }),
      ReminderItem: ({ reminder }) => <li>{reminder.text}</li>,
    } satisfies RemindersContextInterface,
  },
};

export const ListWithItems: Story = {
  args: {},
  parameters: {
    dependencies: {
      useRemindersModel: () => ({
        reminders: [
          { id: "1", text: "Buy milk" },
          { id: "2", text: "Paint house" },
        ],
        remindersCount: 2,
        addReminder: async () => {},
        isLoading: true,
        isSaving: false,
        isFetching: false,
      }),
      ReminderItem: ({ reminder }) => <li>{reminder.text}</li>,
    } satisfies RemindersContextInterface,
  },
};

export const SavingReminders: Story = {
  args: {},
  parameters: {
    dependencies: {
      useRemindersModel: () => ({
        reminders: [
          { id: "1", text: "Buy milk" },
          { id: "2", text: "Paint house" },
        ],
        remindersCount: 2,
        addReminder: async () => {},
        isLoading: true,
        isSaving: true,
        isFetching: false,
      }),
      ReminderItem: ({ reminder }) => <li>{reminder.text}</li>,
    } satisfies RemindersContextInterface,
  },
};
