import { Meta, StoryObj } from "@storybook/react";
import {
  CategorizedRemindersContextInterface,
  CategorizedRemindersContext,
} from "./CategorizedReminders.view.context";
import { CategorizedReminders } from "./CategorizedReminders.view";

const meta = {
  component: CategorizedReminders,

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
