import { Meta, StoryObj } from "@storybook/react";
import {
  CategorizedRemindersContextInterface,
  CategorizedRemindersContext,
} from "./CategorizedReminders.view.context";
import { CategorizedReminders } from "./CategorizedReminders.view";
import { SelectedCategoryModel } from "./models/selected-category.model";
import { RemindersModel } from "./models/reminders.model";

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
      useCategorizedRemindersViewModel: () => ({
        categorySidebarViewModelDependencies: {
          selectedCategoryModel: {} as SelectedCategoryModel,
          remindersModel: {} as RemindersModel,
        },
        remindersViewModelDependencies: {
          selectedCategoryModel: {} as SelectedCategoryModel,
          remindersModel: {} as RemindersModel,
        },
        topbarViewModelDependencies: {
          selectedCategoryModel: {} as SelectedCategoryModel,
          remindersModel: {} as RemindersModel,
        },
      }),
      Topbar: () => <>Topbar</>,
      CategorySidebar: () => <>CategorySidebar</>,
      Reminders: () => <>Reminders</>,
    } satisfies CategorizedRemindersContextInterface,
  },
};
