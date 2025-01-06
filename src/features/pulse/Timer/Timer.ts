import {
  ContainerElement,
  button,
  heading,
  horizontalFlex,
  text,
  verticalFlex,
} from "@cognite/pulse";
import { model, TimerModel } from "./model";

export const TITLE_HEADING_ID = "title-heading";
export const START_BUTTON_ID = "start-button";
export const STOP_BUTTON_ID = "stop-button";
export const TIME_DISPLAY_ID = "time-display";
export const RUN_STATUS_ID = "run-status";

export function Timer(timerModel: TimerModel = model): ContainerElement {
  const { isRunning, elapsedSeconds, startTimer, stopTimer } = timerModel;

  return verticalFlex()
    .alignItems("center")
    .addChildren(
      text("pulse"),
      heading("Timer", 3).id(TITLE_HEADING_ID),
      heading(() => "Status: " + (isRunning() ? "running" : "stopped"), 4).id(
        RUN_STATUS_ID
      ),
      text(() => String(elapsedSeconds())).id(TIME_DISPLAY_ID),
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
          .setOnApply(stopTimer)
      )
    );
}
