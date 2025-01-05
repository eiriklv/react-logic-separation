import { ConditionalTimerModel } from "./model";

describe("toggledOkay (event)", () => {
  it("should work as expected when toggling okay", () => {
    // arrange
    const model = new ConditionalTimerModel();

    // assert
    expect(model.isOkay.value).toEqual(false);

    // act
    model.toggledOkay();

    // assert
    expect(model.isOkay.value).toEqual(true);
  });
});

describe("toggle okay, safe and cool (command)", () => {
  it("should work as expected when starting timer", async () => {
    // arrange
    const model = new ConditionalTimerModel();

    // act
    await model.toggleOkay();

    // assert
    expect(model.isRunning.value).toEqual(false);
 
    // act
    await model.toggleSafe();

    // assert
    expect(model.isRunning.value).toEqual(false);

    // act
    await model.toggleCool();

    // assert
    expect(model.isRunning.value).toEqual(true);
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
    expect(model.elapsedSeconds.value).toEqual(0);

    // Wait for two+ seconds so that the timer can increment twice
    await vi.advanceTimersByTimeAsync(2000);

    // assert
    expect(model.elapsedSeconds.value).toEqual(2);

    // Reset the timer
    await model.resetTimer();

    // assert
    expect(model.elapsedSeconds.value).toEqual(0);

    // Wait for two+ seconds so that the timer can increment twice
    await vi.advanceTimersByTimeAsync(2000);

    // assert
    expect(model.elapsedSeconds.value).toEqual(2);
  });
});

describe("elapsedSeconds (relay)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should only increment the elapsed seconds while running", async () => {
    // arrange
    const model = new ConditionalTimerModel();

    // Start the timer
    await model.toggleOkay();
    await model.toggleSafe();
    await model.toggleCool();

    // assert
    expect(model.elapsedSeconds.value).toEqual(0);

    // Wait for two+ seconds so that the timer can increment twice
    await vi.advanceTimersByTimeAsync(2000);

    // assert
    expect(model.elapsedSeconds.value).toEqual(2);

    // Stop the timer by toggling at least one of the switches to false
    await model.toggleOkay();

    // Wait for two+ second to ensure that the timer does not continue
    await vi.advanceTimersByTimeAsync(2000);

    // assert
    expect(model.elapsedSeconds.value).toEqual(2);
  });
});
