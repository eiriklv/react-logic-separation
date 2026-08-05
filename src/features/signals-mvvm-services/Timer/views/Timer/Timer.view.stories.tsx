import { Meta, StoryObj } from "@storybook/react";
import { Timer } from "./Timer.view";

const meta = {
  component: Timer,
  tags: ["autodocs"],
} satisfies Meta<typeof Timer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ZeroStoppedTimer: Story = {
  args: {
    dependencies: {
      useTimerViewModel: () => ({
        elapsedSeconds: 0,
        isRunning: false,
        startTimer: async () => {},
        stopTimer: async () => {},
      }),
    },
  },
};

export const TenStoppedTimer: Story = {
  args: {
    dependencies: {
      useTimerViewModel: () => ({
        elapsedSeconds: 10,
        isRunning: false,
        startTimer: async () => {},
        stopTimer: async () => {},
      }),
    },
  },
};

export const TenRunningTimer: Story = {
  args: {
    dependencies: {
      useTimerViewModel: () => ({
        elapsedSeconds: 10,
        isRunning: true,
        startTimer: async () => {},
        stopTimer: async () => {},
      }),
    },
  },
};
