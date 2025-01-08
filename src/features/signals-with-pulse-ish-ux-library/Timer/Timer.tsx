import { useContext } from "react";
import { TimerContext } from "./Timer.context";

export function Timer() {
  // Get injected dependencies from context
  const { useElapsedSeconds, useIsRunning, useStartTimer, useStopTimer } =
    useContext(TimerContext);

  // Use injected dependencies (domain state/actions, components, etc)
  const elapsedSeconds = useElapsedSeconds();
  const isRunning = useIsRunning();
  const startTimer = useStartTimer();
  const stopTimer = useStopTimer();

  return (
    <VerticalFlex>
      <Text>signals</Text>
      <Heading size={3}>Timer</Heading>
      <Heading size={4}>Status: {isRunning ? "running" : "stopped"}</Heading>
      <Text>{elapsedSeconds}</Text>
      <Button onApply={startTimer}>Start</Button>
      <Button onApply={stopTimer}>Stop</Button>
    </VerticalFlex>
  );
}
