import {
  BaseInput,
  ButtonElement,
  HeadingElement,
  setContext,
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
import { conditionalTimerContext } from "./ConditionalTimer.context";

describe("ConditionalTimer Component", () => {
  it("Renders correctly", () => {
    // arrange
    const conditionalTimerModelMock: Partial<ConditionalTimerModel> = {
      elapsedSeconds: () => 10,
      isOkay: () => false,
      isSafe: () => false,
      isCool: () => false,
      isRunning: () => false,
      toggleOkay: vi.fn(),
      toggleSafe: vi.fn(),
      toggleCool: vi.fn(),
      resetTimer: vi.fn(),
    };

    setContext(conditionalTimerContext, {
      conditionalTimerModel: conditionalTimerModelMock,
    });

    const container = ConditionalTimer();

    // assert
    expect(
      container.getElementById(HeadingElement, TITLE_HEADING_ID).label(),
    ).toEqual("Conditional Timer");

    // assert
    expect(
      container.getElementById(TextElement, TIME_DISPLAY_ID).label(),
    ).toEqual("10");
  });

  it("Calls the correct handlers for toggling all the condition of the timer", async () => {
    // arrange

    const conditionalTimerModelMock: Partial<ConditionalTimerModel> = {
      elapsedSeconds: () => 10,
      isOkay: () => false,
      isSafe: () => false,
      isCool: () => false,
      isRunning: () => false,
      toggleOkay: vi.fn(),
      toggleSafe: vi.fn(),
      toggleCool: vi.fn(),
      resetTimer: vi.fn(),
    };

    setContext(conditionalTimerContext, {
      conditionalTimerModel: conditionalTimerModelMock,
    });

    const container = ConditionalTimer();

    // act
    container.getElementById(BaseInput, OKAY_CHECKBOX_ID).onValueChange(true);

    // assert
    expect(conditionalTimerModelMock.toggleOkay).toHaveBeenCalledTimes(1);

    // act
    container.getElementById(BaseInput, SAFE_CHECKBOX_ID).onValueChange(true);

    // assert
    expect(conditionalTimerModelMock.toggleSafe).toHaveBeenCalledTimes(1);

    // act
    container.getElementById(BaseInput, COOL_CHECKBOX_ID).onValueChange(true);

    // assert
    expect(conditionalTimerModelMock.toggleCool).toHaveBeenCalledTimes(1);

    // act
    container.getElementById(ButtonElement, RESET_BUTTON_ID).onApply();

    // assert
    expect(conditionalTimerModelMock.resetTimer).toHaveBeenCalledTimes(1);
  });
});
