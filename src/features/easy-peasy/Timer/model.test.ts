import { model } from "./model";
import { createStore } from "easy-peasy";

describe("startTimer (command)", () => {
  it("should work as expected when starting timer", async () => {
    // arrange
    const store = createStore(model);

    // act
    await store.getActions().startTimer();

    // assert
    expect(store.getState().isRunning).toEqual(true);
  });
});

describe("Timer auto-increment (effect)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should only increment the timer while running", async () => {
    // arrange
    const store = createStore(model, {});

    // Start the timer
    await store.getActions().startTimer();

    // assert
    expect(store.getState().elapsedSeconds).toEqual(0);

    // Wait for two+ seconds so that the timer can increment twice
    await vi.advanceTimersByTimeAsync(2000);

    // assert
    expect(store.getState().elapsedSeconds).toEqual(2);

    // Stop the timer
    await store.getActions().stopTimer();

    // Wait for two+ seconds to ensure that the timer does not continue
    await vi.advanceTimersByTimeAsync(2000);

    // assert
    expect(store.getState().elapsedSeconds).toEqual(2);
  });
});
