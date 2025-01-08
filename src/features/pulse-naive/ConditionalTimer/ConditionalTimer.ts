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
  // State
  const isOkay = signal<boolean>(false);
  const isSafe = signal<boolean>(false);
  const isCool = signal<boolean>(false);
  const elapsedSeconds = signal<number>(0);

  // Computed
  const isRunning = computed(() => isOkay() && isSafe() && isCool());

  // Events
  const toggledOkay = () => {
    isOkay(!isOkay());
  };
  const toggledSafe = () => {
    isSafe(!isSafe());
  };
  const toggledCool = () => {
    isCool(!isCool());
  };
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
  const toggleOkay = async () => {
    toggledOkay();
  };
  const toggleSafe = async () => {
    toggledSafe();
  };
  const toggleCool = async () => {
    toggledCool();
  };
  const resetTimer = async () => {
    resettedTimer();
  };

  return verticalFlex()
    .alignItems("center")
    .addChildren(
      text("pulse-naive"),
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
          horizontalFlex().addChildren(
            boolInput()
              .id(OKAY_CHECKBOX_ID)
              .label("Okay")
              .isCheckbox(true)
              .value(() => isOkay())
              .setOnValueChange(toggleOkay),
            boolInput()
              .id(SAFE_CHECKBOX_ID)
              .label("Safe")
              .isCheckbox(true)
              .value(() => isSafe())
              .setOnValueChange(toggleSafe),
            boolInput()
              .id(COOL_CHECKBOX_ID)
              .label("Cool")
              .isCheckbox(true)
              .value(() => isCool())
              .setOnValueChange(toggleCool)
          )
        )
    );
}
