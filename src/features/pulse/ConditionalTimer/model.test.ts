import { ConditionalTimerModel } from "./model";

describe("toggle okay, safe and cool (commands)", () => {
  it("should work as expected when starting timer", async () => {
    // arrange
    const model = new ConditionalTimerModel();

    // act
    await model.toggleOkay();

    // assert
    expect(model.isRunning()).toEqual(false);

    // act
    await model.toggleSafe();

    // assert
    expect(model.isRunning()).toEqual(false);

    // act
    await model.toggleCool();

    // assert
    expect(model.isRunning()).toEqual(true);
  });
});

describe("reset timer (command)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should work as expected when resetting timer", async () => {
    // arrange
    const model = new ConditionalTimerModel();

    // Start the timer
    await model.toggleOkay();
    await model.toggleSafe();
    await model.toggleCool();

    // assert
    expect(model.elapsedSeconds()).toEqual(0);

    // Wait for two+ seconds so that the timer can increment twice
    await vi.advanceTimersByTimeAsync(2000);

    // assert
    expect(model.elapsedSeconds()).toEqual(2);

    // Reset the timer
    await model.resetTimer();

    // assert
    expect(model.elapsedSeconds()).toEqual(0);

    // Wait for two+ seconds so that the timer can increment twice
    await vi.advanceTimersByTimeAsync(2000);

    // assert
    expect(model.elapsedSeconds()).toEqual(2);
  });
});

describe("Timer auto-increment (effect)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should only increment the elapsed seconds while running", async () => {
    // arrange
    const model = new ConditionalTimerModel();

    // Start the timer by toggling all the necessary conditions on
    await model.toggleOkay();
    await model.toggleSafe();
    await model.toggleCool();

    // assert
    expect(model.elapsedSeconds()).toEqual(0);

    // Wait for two+ seconds so that the timer can increment twice
    await vi.advanceTimersByTimeAsync(2000);

    // assert
    expect(model.elapsedSeconds()).toEqual(2);

    // Stop the timer by toggling at least one of the conditions off
    await model.toggleOkay();

    // Wait for a long time to ensure that the timer does not continue
    await vi.advanceTimersByTimeAsync(10000);

    // assert
    expect(model.elapsedSeconds()).toEqual(2);
  });
});
