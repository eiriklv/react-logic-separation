import {
  ContainerElement,
  button,
  effect,
  heading,
  horizontalFlex,
  signal,
  text,
  verticalFlex,
} from "@cognite/pulse";

export const TITLE_HEADING_ID = "title-heading";
export const START_BUTTON_ID = "start-button";
export const STOP_BUTTON_ID = "stop-button";
export const TIME_DISPLAY_ID = "time-display";
export const RUN_STATUS_ID = "run-status";

export function Timer(): ContainerElement {
  // State
  const elapsedSeconds = signal<number>(0);
  const isRunning = signal<boolean>(false);

  // Events
  const startedTimer = () => {
    isRunning(true);
  };
  const stoppedTimer = () => {
    isRunning(false);
  };
  const incrementedElapsedSeconds = () => {
    elapsedSeconds(elapsedSeconds() + 1);
  };

  // Effects
  effect(() => {
    // Get dependencies that triggered the effect
    const isRunningValue = isRunning();

    if (!isRunningValue) {
      return;
    }

    const interval = setInterval(() => {
      incrementedElapsedSeconds();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  // Commands
  const startTimer = async () => {
    startedTimer();
  };
  const stopTimer = async () => {
    stoppedTimer();
  };

  return verticalFlex()
    .alignItems("center")
    .addChildren(
      text("pulse-naive"),
      heading("Timer", 3).id(TITLE_HEADING_ID),
      heading(() => `Status: ${isRunning() ? "running" : "stopped"}`, 4).id(
        RUN_STATUS_ID,
      ),
      text(() => `${elapsedSeconds()}`).id(TIME_DISPLAY_ID),
      horizontalFlex().addChildren(
        button()
          .id(START_BUTTON_ID)
          .label("Start")
          .type("primary")
          .setOnApply(startTimer),
        button()
          .id(STOP_BUTTON_ID)
          .label("Stop")
          .type("primary")
          .setOnApply(stopTimer),
      ),
    );
}
