import { TimerModel } from "./model";

describe("startTimer (command)", () => {
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
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should only increment the timer while running", async () => {
    // arrange
    const model = new TimerModel();

    // Start the timer
    await model.startTimer();

    // assert
    expect(model.elapsedSeconds.value).toEqual(0);

    // Wait for two+ seconds so that the timer can increment twice
    await vi.advanceTimersByTimeAsync(2000);

    // assert
    expect(model.elapsedSeconds.value).toEqual(2);

    // Stop the timer
    await model.stopTimer();

    // Wait for two+ second to ensure that the timer does not continue
    await vi.advanceTimersByTimeAsync(2000);

    // assert
    expect(model.elapsedSeconds.value).toEqual(2);
  });
});
