import { TimerModel } from "./model";
import { sleep } from "./utils";

describe("startedTimer (action)", () => {
  it("should work as expected when starting timer", () => {
    // arrange
    const model = new TimerModel();

    // act
    model.startedTimer();

    // assert
    expect(model.isRunning.value).toEqual(true);
  });
});

describe("startTimer (thunk)", () => {
  it("should work as expected when starting timer", async () => {
    // arrange
    const model = new TimerModel();

    // act
    await model.startTimer();

    // assert
    expect(model.isRunning.value).toEqual(true);
  });
});

describe("incrementTimerWhileRunning (effect)", () => {
  it("should only increment the timer while running", async () => {
    // arrange
    const model = new TimerModel();

    // Start the timer
    await model.startTimer();

    // assert
    expect(model.elapsedSeconds.value).toEqual(0);

    // Wait for two+ seconds so that the timer can increment twice
    await sleep(2500);

    // assert
    expect(model.elapsedSeconds.value).toEqual(2);

    // Stop the timer
    await model.stopTimer();

    // Wait for 1+ second to ensure that the timer does not continue
    await sleep(1500);

    // assert
    expect(model.elapsedSeconds.value).toEqual(2);
  });
});
