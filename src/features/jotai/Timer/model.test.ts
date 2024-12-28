import { createStore } from "jotai";
import { noop, sleep } from "./utils";
import { TimerModel } from "./model";

describe("startedTimer (action)", () => {
  it("should work as expected when starting timer", () => {
    // arrange
    const model = new TimerModel();
    const store = createStore();

    // act
    store.set(model.startedTimer);

    // assert
    expect(store.get(model.isRunning)).toEqual(true);
  });
});

describe("startTimer (thunk)", () => {
  it("should work as expected when starting timer", async () => {
    // arrange
    const model = new TimerModel();
    const store = createStore();

    // act
    await store.set(model.startTimer);

    // assert
    expect(store.get(model.isRunning)).toEqual(true);
  });
});

describe("incrementTimerWhileRunning (effect)", () => {
  it("should only increment the timer while running", async () => {
    // arrange
    const model = new TimerModel();
    const store = createStore();

    // mount effects
    store.sub(model.incrementTimerWhileRunning, noop);

    // Start the timer
    await store.set(model.startTimer);

    // assert
    expect(store.get(model.elapsedSeconds)).toEqual(0);

    // Wait for two+ seconds so that the timer can increment twice
    await sleep(2500);

    // assert
    expect(store.get(model.elapsedSeconds)).toEqual(2);

    // Stop the timer
    await store.set(model.stopTimer);

    // Wait for 1+ second to ensure that the timer does not continue
    await sleep(1500);

    // assert
    expect(store.get(model.elapsedSeconds)).toEqual(2);
  });
});
