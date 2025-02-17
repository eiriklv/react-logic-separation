import { Meta, StoryObj } from "@storybook/react";
import {
  CategorizedRemindersContextInterface,
  CategorizedRemindersContext,
} from "./CategorizedReminders.context";
import { CategorizedReminders } from "./CategorizedReminders";

const meta = {
  component: CategorizedReminders,
  title: "CategorizedReminders",
  decorators: [
    (story, { parameters }) => {
      return (
        <CategorizedRemindersContext.Provider value={parameters.dependencies}>
          {story()}
        </CategorizedRemindersContext.Provider>
      );
    },
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof CategorizedReminders>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    dependencies: {
      Topbar: () => <>Topbar</>,
      CategorySidebar: () => <>CategorySidebar</>,
      Reminders: () => <>Reminders</>,
    } satisfies CategorizedRemindersContextInterface,
  },
};
