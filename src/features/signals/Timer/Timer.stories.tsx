import { Meta, StoryObj } from "@storybook/react";
import { TimerContextInterface, TimerContext } from "./context";
import { Timer } from "./Timer";

const meta = {
  component: Timer,
  title: "Timer",
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
      useElapsedSeconds: () => 0,
      useIsRunning: () => false,
      useStartTimer: () => async () => {},
      useStopTimer: () => async () => {},
    } satisfies TimerContextInterface,
  },
};

export const TenStoppedTimer: Story = {
  args: {},
  parameters: {
    dependencies: {
      useElapsedSeconds: () => 10,
      useIsRunning: () => false,
      useStartTimer: () => async () => {},
      useStopTimer: () => async () => {},
    } satisfies TimerContextInterface,
  },
};

export const TenRunningTimer: Story = {
  args: {},
  parameters: {
    dependencies: {
      useElapsedSeconds: () => 10,
      useIsRunning: () => true,
      useStartTimer: () => async () => {},
      useStopTimer: () => async () => {},
    } satisfies TimerContextInterface,
  },
};