import { createStore } from "./model";
import { sleep } from "./utils";

describe("startedTimer (action)", () => {
  it("should work as expected when starting timer", () => {
    // arrange
    const store = createStore();

    // act
    store.startedTimer();

    // assert
    expect(store.isRunning.value).toEqual(true);
  });
});

describe("startTimer (thunk)", () => {
  it("should work as expected when starting timer", async () => {
    // arrange
    const store = createStore();

    // act
    await store.startTimer();

    // assert
    expect(store.isRunning.value).toEqual(true);
  });
});

describe("incrementTimerWhileRunning (effect)", () => {
  it("should only increment the timer while running", async () => {
    // arrange
    const store = createStore();

    // Start the timer
    await store.startTimer();

    // assert
    expect(store.elapsedSeconds.value).toEqual(0);

    // Wait for two+ seconds so that the timer can increment twice
    await sleep(2500);

    // assert
    expect(store.elapsedSeconds.value).toEqual(2);

    // Stop the timer
    await store.stopTimer();

    // Wait for 1+ second to ensure that the timer does not continue
    await sleep(1500);

    // assert
    expect(store.elapsedSeconds.value).toEqual(2);
  });
});
