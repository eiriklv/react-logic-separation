import { Meta, StoryObj } from "@storybook/react";
import {
  RemindersContextInterface,
  RemindersContext,
} from "./Reminders.context";
import { Reminders } from "./Reminders";

const meta = {
  component: Reminders,
  title: "Reminders",
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

export const LoadingReminders: Story = {
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
        failedToAddReminderError: null,
        failedToFetchRemindersError: null,
      }),
    } satisfies RemindersContextInterface,
  },
};

export const EmptyReminders: Story = {
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
        failedToAddReminderError: null,
        failedToFetchRemindersError: null,
      }),
    } satisfies RemindersContextInterface,
  },
};

export const MultipleReminders: Story = {
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
        isLoading: false,
        isSaving: false,
        isFetching: false,
        failedToAddReminderError: null,
        failedToFetchRemindersError: null,
      }),
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
        isLoading: false,
        isSaving: true,
        isFetching: false,
        failedToAddReminderError: null,
        failedToFetchRemindersError: null,
      }),
    } satisfies RemindersContextInterface,
  },
};

export const ReFetchingReminders: Story = {
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
        isLoading: false,
        isSaving: false,
        isFetching: true,
        failedToAddReminderError: null,
        failedToFetchRemindersError: null,
      }),
    } satisfies RemindersContextInterface,
  },
};

export const FailedToFetchReminders: Story = {
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
        isLoading: false,
        isSaving: false,
        isFetching: false,
        failedToAddReminderError: null,
        failedToFetchRemindersError: new Error("Service unavailable"),
      }),
    } satisfies RemindersContextInterface,
  },
};

export const FailedToAddReminder: Story = {
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
        isLoading: false,
        isSaving: false,
        isFetching: false,
        failedToAddReminderError: new Error("Service unavailable"),
        failedToFetchRemindersError: null,
      }),
    } satisfies RemindersContextInterface,
  },
};
