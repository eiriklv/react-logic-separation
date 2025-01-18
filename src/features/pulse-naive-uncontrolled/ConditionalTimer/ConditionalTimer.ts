import {
  ContainerElement,
  button,
  computed,
  effect,
  heading,
  horizontalFlex,
  signal,
  text,
  verticalFlex,
  boolInput,
} from "@cognite/pulse";

export const TITLE_HEADING_ID = "title-heading";
export const OKAY_CHECKBOX_ID = "okay-checkbox";
export const SAFE_CHECKBOX_ID = "safe-checkbox";
export const COOL_CHECKBOX_ID = "cool-checkbox";
export const RESET_BUTTON_ID = "reset-button";
export const TIME_DISPLAY_ID = "time-display";
export const RUN_STATUS_ID = "run-status";

export function ConditionalTimer(): ContainerElement {
  // Inputs (both state and ui)
  const isOkayInput = boolInput()
    .id(OKAY_CHECKBOX_ID)
    .label("Okay")
    .isCheckbox(true);
  const isSafeInput = boolInput()
    .id(SAFE_CHECKBOX_ID)
    .label("Safe")
    .isCheckbox(true);
  const isCoolInput = boolInput()
    .id(COOL_CHECKBOX_ID)
    .label("Cool")
    .isCheckbox(true);

  // State
  const elapsedSeconds = signal<number>(0);

  // Computed
  const isRunning = computed(
    () => isOkayInput.value() && isSafeInput.value() && isCoolInput.value()
  );

  // Events
  const resettedTimer = () => {
    elapsedSeconds(0);
  };
  const incrementedElapsedSeconds = () => {
    elapsedSeconds(elapsedSeconds() + 1);
  };

  // Effects
  effect(() => {
    // Dependencies
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
  const resetTimer = async () => {
    resettedTimer();
  };

  return verticalFlex()
    .alignItems("center")
    .addChildren(
      text("pulse-naive-uncontrolled"),
      heading("Conditional Timer", 3).id(TITLE_HEADING_ID),
      heading(() => `Status: ${isRunning() ? "running" : "stopped"}`, 4).id(
        RUN_STATUS_ID
      ),
      text(() => `${elapsedSeconds()}`).id(TIME_DISPLAY_ID),
      verticalFlex()
        .alignItems("center")
        .addChildren(
          button()
            .id(RESET_BUTTON_ID)
            .label("Reset")
            .type("primary")
            .setOnApply(resetTimer),
          horizontalFlex().addChildren(isOkayInput, isSafeInput, isCoolInput)
        )
    );
}
