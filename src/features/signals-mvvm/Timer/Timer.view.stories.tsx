import { Meta, StoryObj } from "@storybook/react";
import { TimerContextInterface, TimerContext } from "./Timer.view.context";
import { Timer } from "./Timer.view";

const meta = {
  component: Timer,

  decorators: [
    (story, { parameters }) => {
      return (
        <TimerContext.Provider value={parameters.dependencies}>
          {story()}
        </TimerContext.Provider>
      );
    },
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof Timer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ZeroStoppedTimer: Story = {
  args: {},
  parameters: {
    dependencies: {
      useTimerViewModel: () => ({
        elapsedSeconds: 0,
        isRunning: false,
        startTimer: async () => {},
        stopTimer: async () => {},
      }),
    } satisfies TimerContextInterface,
  },
};

export const TenStoppedTimer: Story = {
  args: {},
  parameters: {
    dependencies: {
      useTimerViewModel: () => ({
        elapsedSeconds: 10,
        isRunning: false,
        startTimer: async () => {},
        stopTimer: async () => {},
      }),
    } satisfies TimerContextInterface,
  },
};

export const TenRunningTimer: Story = {
  args: {},
  parameters: {
    dependencies: {
      useTimerViewModel: () => ({
        elapsedSeconds: 10,
        isRunning: true,
        startTimer: async () => {},
        stopTimer: async () => {},
      }),
    } satisfies TimerContextInterface,
  },
};
