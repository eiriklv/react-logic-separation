import {
  ContainerElement,
  button,
  heading,
  horizontalFlex,
  text,
  verticalFlex,
  boolInput,
  divider,
} from "@cognite/pulse";
import { ConditionalTimerModel, model } from "./model";

export const TITLE_HEADING_ID = "title-heading";
export const OKAY_CHECKBOX_ID = "okay-checkbox";
export const SAFE_CHECKBOX_ID = "safe-checkbox";
export const COOL_CHECKBOX_ID = "cool-checkbox";
export const RESET_BUTTON_ID = "reset-button";
export const TIME_DISPLAY_ID = "time-display";
export const RUN_STATUS_ID = "run-status";

export function ConditionalTimer(
  conditionalTimerModel: ConditionalTimerModel = model
): ContainerElement {
  const {
    isRunning,
    elapsedSeconds,
    isOkay,
    isSafe,
    isCool,
    toggleOkay,
    toggleSafe,
    toggleCool,
    resetTimer,
  } = conditionalTimerModel;

  return verticalFlex()
    .alignItems("center")
    .addChildren(
      text("pulse"),
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
