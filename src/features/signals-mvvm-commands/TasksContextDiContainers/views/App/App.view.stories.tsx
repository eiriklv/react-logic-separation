import { Meta, StoryObj } from "@storybook/react";
import { AppContextInterface, AppContext } from "./App.view.context";
import { App } from "./App.view";
import { useAppViewModel } from "./App.view-model";

const meta = {
  component: App,
  decorators: [
    (story, { parameters }) => {
      return (
        <AppContext.Provider value={parameters.dependencies}>
          {story()}
        </AppContext.Provider>
      );
    },
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof App>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    dependencies: {
      useAppViewModel: () =>
        ({
          models: {},
        }) as ReturnType<typeof useAppViewModel>,
      Actions: () => <>Actions</>,
      Filters: () => <>Filters</>,
      TaskList: () => <>TaskList</>,
    } satisfies AppContextInterface,
  },
};
