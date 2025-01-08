import { createStore } from "easy-peasy";
import { model } from "./model";

describe("toggle okay, safe and cool (commands)", () => {
  it("should work as expected when starting timer", async () => {
    // arrange
    const store = createStore(model);

    // act
    await store.getActions().toggleOkay();

    // assert
    expect(store.getState().isRunning).toEqual(false);
 
    // act
    await store.getActions().toggleSafe();

    // assert
    expect(store.getState().isRunning).toEqual(false);

    // act
    await store.getActions().toggleCool();

    // assert
    expect(store.getState().isRunning).toEqual(true);
  });
});

describe("reset timer (command)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should work as expected when resetting timer", async () => {
    // arrange
    const store = createStore(model);

    // Start the timer
    await store.getActions().toggleOkay();
    await store.getActions().toggleSafe();
    await store.getActions().toggleCool();

    // assert
    expect(store.getState().elapsedSeconds).toEqual(0);

    // Wait for two+ seconds so that the timer can increment twice
    await vi.advanceTimersByTimeAsync(2000);

    // assert
    expect(store.getState().elapsedSeconds).toEqual(2);

    // Reset the timer
    await store.getActions().resetTimer();

    // assert
    expect(store.getState().elapsedSeconds).toEqual(0);

    // Wait for two+ seconds so that the timer can increment twice
    await vi.advanceTimersByTimeAsync(2000);

    // assert
    expect(store.getState().elapsedSeconds).toEqual(2);
  });
});

describe("Timer auto-increment (effect)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should only increment the elapsed seconds while running", async () => {
    // arrange
    const store = createStore(model);

    // Start the timer by toggling all the necessary conditions on
    await store.getActions().toggleOkay();
    await store.getActions().toggleSafe();
    await store.getActions().toggleCool();

    // assert
    expect(store.getState().elapsedSeconds).toEqual(0);

    // Wait for two+ seconds so that the timer can increment twice
    await vi.advanceTimersByTimeAsync(2000);

    // assert
    expect(store.getState().elapsedSeconds).toEqual(2);

    // Stop the timer by toggling at least one of the conditions off
    await store.getActions().toggleOkay();

    // Wait for a long time to ensure that the timer does not continue
    await vi.advanceTimersByTimeAsync(10000);

    // assert
    expect(store.getState().elapsedSeconds).toEqual(2);
  });
});
