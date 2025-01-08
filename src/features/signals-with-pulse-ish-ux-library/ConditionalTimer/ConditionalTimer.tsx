import { useContext } from "react";
import { ConditionalTimerContext } from "./ConditionalTimer.context";

export function ConditionalTimer() {
  // Get injected dependencies from context
  const {
    useElapsedSeconds,
    useIsOkay,
    useIsSafe,
    useIsCool,
    useIsRunning,
    useToggleOkay,
    useToggleSafe,
    useToggleCool,
    useResetTimer,
  } = useContext(ConditionalTimerContext);

  // Use injected dependencies (domain state/actions, components, etc)
  const elapsedSeconds = useElapsedSeconds();
  const isOkay = useIsOkay();
  const isSafe = useIsSafe();
  const isCool = useIsCool();
  const isRunning = useIsRunning();
  const toggleOkay = useToggleOkay();
  const toggleSafe = useToggleSafe();
  const toggleCool = useToggleCool();
  const resetTimer = useResetTimer();

  return (
    <VerticalFlex>
      <Text>signals</Text>
      <Heading size={3}>Conditional Timer</Heading>
      <Heading size={4}>Status: {isRunning ? "running" : "stopped"}</Heading>
      <Text>{elapsedSeconds}</Text>
      <Button onApply={resetTimer}>Reset</Button>
      <BoolInput label="Okay" isCheckbox value={isOkay} onChange={toggleOkay} />
      <BoolInput label="Safe" isCheckbox value={isSafe} onChange={toggleSafe} />
      <BoolInput label="Cool" isCheckbox value={isCool} onChange={toggleCool} />
    </VerticalFlex>
  );
}
