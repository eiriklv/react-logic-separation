import { Meta, StoryObj } from "@storybook/react";
import {
  ConditionalTimerContextInterface,
  ConditionalTimerContext,
} from "./ConditionalTimer.context";
import { ConditionalTimer } from "./ConditionalTimer";

const meta = {
  component: ConditionalTimer,
  title: "Timer",
  decorators: [
    (story, { parameters }) => {
      return (
        <ConditionalTimerContext.Provider value={parameters.dependencies}>
          {story()}
        </ConditionalTimerContext.Provider>
      );
    },
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof ConditionalTimer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ZeroStoppedTimer: Story = {
  args: {},
  parameters: {
    dependencies: {
      useConditionalTimerViewModel: () => ({
        elapsedSeconds: 0,
        isOkay: false,
        isSafe: false,
        isCool: false,
        isRunning: false,
        toggleOkay: async () => {},
        toggleSafe: async () => {},
        toggleCool: async () => {},
        resetTimer: async () => {},
      }),
    } satisfies ConditionalTimerContextInterface,
  },
};

export const TenStoppedTimer: Story = {
  args: {},
  parameters: {
    dependencies: {
      useConditionalTimerViewModel: () => ({
        elapsedSeconds: 10,
        isOkay: false,
        isSafe: false,
        isCool: false,
        isRunning: false,
        toggleOkay: async () => {},
        toggleSafe: async () => {},
        toggleCool: async () => {},
        resetTimer: async () => {},
      }),
    } satisfies ConditionalTimerContextInterface,
  },
};

export const TenRunningTimer: Story = {
  args: {},
  parameters: {
    dependencies: {
      useConditionalTimerViewModel: () => ({
        elapsedSeconds: 0,
        isOkay: true,
        isSafe: true,
        isCool: true,
        isRunning: true,
        toggleOkay: async () => {},
        toggleSafe: async () => {},
        toggleCool: async () => {},
        resetTimer: async () => {},
      }),
    } satisfies ConditionalTimerContextInterface,
  },
};
