import { ButtonElement, signal, TextElement } from "@cognite/pulse";
import {
  START_BUTTON_ID,
  STOP_BUTTON_ID,
  TIME_DISPLAY_ID,
  Timer,
  TITLE_HEADING_ID,
} from "./Timer";
import { TimerModel } from "./model";

describe("Timer Component", () => {
  it("Renders correctly", () => {
    // arrange
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const timerModelMock: TimerModel = {
      elapsedSeconds: signal(10),
      isRunning: signal(false),
      startTimer: vi.fn(),
      stopTimer: vi.fn(),
    };

    const container = Timer(timerModelMock);

    // assert
    expect(
      container.getDescendantById(TextElement, TIME_DISPLAY_ID).label()
    ).toEqual("10");

    // assert
    expect(
      container.getDescendantById(TextElement, TITLE_HEADING_ID).label()
    ).toEqual("Timer");
  });

  it("Calls the correct handlers for start and stop", async () => {
    // arrange
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const timerModelMock: TimerModel = {
      elapsedSeconds: signal(10),
      isRunning: signal(false),
      startTimer: vi.fn(),
      stopTimer: vi.fn(),
    };

    const container = Timer(timerModelMock);

    // act
    container.getDescendantById(ButtonElement, START_BUTTON_ID).onApply();

    // assert
    expect(timerModelMock.startTimer).toHaveBeenCalledTimes(1);

    // act
    container.getDescendantById(ButtonElement, STOP_BUTTON_ID).onApply();

    // assert
    expect(timerModelMock.startTimer).toHaveBeenCalledTimes(1);
  });
});
