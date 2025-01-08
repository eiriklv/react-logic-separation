import {
  BaseInput,
  ButtonElement,
  signal,
  TextElement,
} from "@cognite/pulse";
import {
  ConditionalTimer,
  COOL_CHECKBOX_ID,
  OKAY_CHECKBOX_ID,
  RESET_BUTTON_ID,
  SAFE_CHECKBOX_ID,
  TIME_DISPLAY_ID,
  TITLE_HEADING_ID,
} from "./ConditionalTimer";
import { ConditionalTimerModel } from "./model";

describe("ConditionalTimer Component", () => {
  it("Renders correctly", () => {
    // arrange
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const timerModelMock: ConditionalTimerModel = {
      elapsedSeconds: signal(10),
      isOkay: signal(false),
      isSafe: signal(false),
      isCool: signal(false),
      isRunning: signal(false),
      toggleOkay: vi.fn(),
      toggleSafe: vi.fn(),
      toggleCool: vi.fn(),
      resetTimer: vi.fn(),
    };

    const container = ConditionalTimer(timerModelMock);

    // assert
    expect(
      container.getDescendantById(TextElement, TITLE_HEADING_ID).label()
    ).toEqual("Conditional Timer");

    // assert
    expect(
      container.getDescendantById(TextElement, TIME_DISPLAY_ID).label()
    ).toEqual("10");
  });

  it("Calls the correct handlers for toggling all the condition of the timer", async () => {
    // arrange
    const toggleOkay = vi.fn();
    const toggleSafe = vi.fn();
    const toggleCool = vi.fn();
    const resetTimer = vi.fn();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const timerModelMock: ConditionalTimerModel = {
      elapsedSeconds: signal(10),
      isOkay: signal(false),
      isSafe: signal(false),
      isCool: signal(false),
      isRunning: signal(false),
      toggleOkay,
      toggleSafe,
      toggleCool,
      resetTimer,
    };

    const container = ConditionalTimer(timerModelMock);

    // act
    container
      .getDescendantById(BaseInput, OKAY_CHECKBOX_ID)
      .onValueChange(true);

    // assert
    expect(toggleOkay).toHaveBeenCalledTimes(1);

    // act
    container
      .getDescendantById(BaseInput, SAFE_CHECKBOX_ID)
      .onValueChange(true);

    // assert
    expect(toggleSafe).toHaveBeenCalledTimes(1);

    // act
    container
      .getDescendantById(BaseInput, COOL_CHECKBOX_ID)
      .onValueChange(true);

    // assert
    expect(toggleCool).toHaveBeenCalledTimes(1);

    // act
    container.getDescendantById(ButtonElement, RESET_BUTTON_ID).onApply();

    // assert
    expect(resetTimer).toHaveBeenCalledTimes(1);
  });
});
