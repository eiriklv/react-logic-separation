import { createStore } from "jotai";
import { sleep } from "./utils";
import { TimerModel } from "./model";

describe("startedTimer (action)", () => {
  it("should work as expected when starting timer", () => {
    // arrange
    const store = createStore();
    const model = new TimerModel(store);

    // act
    model.startedTimer();

    // assert
    expect(store.get(model.isRunning)).toEqual(true);
  });
});

describe("startTimer (thunk)", () => {
  it("should work as expected when starting timer", async () => {
    // arrange
    const store = createStore();
    const model = new TimerModel(store);

    // act
    await model.startTimer();

    // assert
    expect(store.get(model.isRunning)).toEqual(true);
  });
});

describe("incrementTimerWhileRunning (effect)", () => {
  it("should only increment the timer while running", async () => {
    // arrange
    const store = createStore();
    const model = new TimerModel(store);

    // Start the timer
    await model.startTimer();

    // assert
    expect(store.get(model.elapsedSeconds)).toEqual(0);

    // Wait for two+ seconds so that the timer can increment twice
    await sleep(2500);

    // assert
    expect(store.get(model.elapsedSeconds)).toEqual(2);

    // Stop the timer
    await model.stopTimer();

    // Wait for 1+ second to ensure that the timer does not continue
    await sleep(1500);

    // assert
    expect(store.get(model.elapsedSeconds)).toEqual(2);
  });
});
