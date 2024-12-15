import { describe, it, expect } from "vitest";
import { model } from "./model";
import { createStore } from "easy-peasy";
import { sleep } from "./utils";

describe("startedTimer (action)", () => {
  it("should work as expected when starting timer", () => {
    // arrange
    const store = createStore(model);

    // act
    store.getActions().startedTimer();

    // assert
    expect(store.getState().isRunning).toEqual(true);
  });
});

describe("startTimer (thunk)", () => {
  it("should work as expected when starting timer", async () => {
    // arrange
    const store = createStore(model);

    // act
    await store.getActions().startTimer();

    // assert
    expect(store.getState().isRunning).toEqual(true);
  });
});

describe("incrementTimerWhileRunning (effect)", () => {
  it("should only increment the timer while running", async () => {
    // arrange
    const store = createStore(model, {});

    // Start the timer
    store.getActions().startTimer();

    // assert
    expect(store.getState().elapsedSeconds).toEqual(0);

    // Wait for two+ seconds so that the timer can increment twice
    await sleep(2500);

    // assert
    expect(store.getState().elapsedSeconds).toEqual(2);

    // Stop the timer
    store.getActions().stopTimer();

    // Wait for 1+ second to ensure that the timer does not continue
    await sleep(1500);

    // assert
    expect(store.getState().elapsedSeconds).toEqual(2);
  });
});
