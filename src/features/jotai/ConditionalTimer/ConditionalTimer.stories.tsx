import { Meta, StoryObj } from "@storybook/react";
import {
  ConditionalTimerContextInterface,
  ConditionalTimerContext,
} from "./context";
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
      useElapsedSeconds: () => 0,
      useIsOkay: () => false,
      useIsSafe: () => false,
      useIsCool: () => false,
      useIsRunning: () => false,
      useToggleOkay: () => async () => {},
      useToggleSafe: () => async () => {},
      useToggleCool: () => async () => {},
      useResetTimer: () => async () => {},
    } satisfies ConditionalTimerContextInterface,
  },
};

export const TenStoppedTimer: Story = {
  args: {},
  parameters: {
    dependencies: {
      useElapsedSeconds: () => 10,
      useIsOkay: () => false,
      useIsSafe: () => false,
      useIsCool: () => false,
      useIsRunning: () => false,
      useToggleOkay: () => async () => {},
      useToggleSafe: () => async () => {},
      useToggleCool: () => async () => {},
      useResetTimer: () => async () => {},
    } satisfies ConditionalTimerContextInterface,
  },
};

export const TenRunningTimer: Story = {
  args: {},
  parameters: {
    dependencies: {
      useElapsedSeconds: () => 10,
      useIsOkay: () => true,
      useIsSafe: () => true,
      useIsCool: () => true,
      useIsRunning: () => true,
      useToggleOkay: () => async () => {},
      useToggleSafe: () => async () => {},
      useToggleCool: () => async () => {},
      useResetTimer: () => async () => {},
    } satisfies ConditionalTimerContextInterface,
  },
};
