import {
  ButtonElement,
  HeadingElement,
  setContext,
  signal,
  TextElement,
} from "@cognite/pulse";
import {
  START_BUTTON_ID,
  STOP_BUTTON_ID,
  TIME_DISPLAY_ID,
  Timer,
  TITLE_HEADING_ID,
} from "./Timer";
import { TimerModel } from "./model";
import { timerContext } from "./Timer.context";

describe("Timer Component", () => {
  it("Renders correctly", () => {
    // arrange
    const timerModelMock: Partial<TimerModel> = {
      elapsedSeconds: () => 10,
      isRunning: () => false,
      startTimer: vi.fn(),
      stopTimer: vi.fn(),
    };

    setContext(timerContext, {
      timerModel: timerModelMock,
    });

    const container = Timer();

    // assert
    expect(
      container.getElementById(TextElement, TIME_DISPLAY_ID).label()
    ).toEqual("10");

    // assert
    expect(
      container.getElementById(HeadingElement, TITLE_HEADING_ID).label()
    ).toEqual("Timer");
  });

  it("Calls the correct handlers for start and stop", async () => {
    // arrange
    const timerModelMock: Partial<TimerModel> = {
      elapsedSeconds: signal(10),
      isRunning: signal(false),
      startTimer: vi.fn(),
      stopTimer: vi.fn(),
    };

    setContext(timerContext, {
      timerModel: timerModelMock,
    });

    const container = Timer();

    // act
    container.getElementById(ButtonElement, START_BUTTON_ID).onApply();

    // assert
    expect(timerModelMock.startTimer).toHaveBeenCalledTimes(1);

    // act
    container.getElementById(ButtonElement, STOP_BUTTON_ID).onApply();

    // assert
    expect(timerModelMock.startTimer).toHaveBeenCalledTimes(1);
  });
});
