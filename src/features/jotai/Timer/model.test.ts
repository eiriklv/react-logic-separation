import { createStore } from "jotai";
import { noop, sleep } from "./utils";
import {
  elapsedSecondsAtom,
  incrementTimerWhileRunningAtom,
  isRunningAtom,
  startedTimerAtom,
  startTimerAtom,
  stopTimerAtom,
} from "./model";

describe("startedTimer (action)", () => {
  it("should work as expected when starting timer", () => {
    // arrange
    const store = createStore();

    // act
    store.set(startedTimerAtom);

    // assert
    expect(store.get(isRunningAtom)).toEqual(true);
  });
});

describe("startTimer (thunk)", () => {
  it("should work as expected when starting timer", async () => {
    // arrange
    const store = createStore();

    // act
    await store.set(startTimerAtom);

    // assert
    expect(store.get(isRunningAtom)).toEqual(true);
  });
});

describe("incrementTimerWhileRunning (effect)", () => {
  it("should only increment the timer while running", async () => {
    // arrange
    const store = createStore();

    // mount effects
    store.sub(incrementTimerWhileRunningAtom, noop);

    // Start the timer
    await store.set(startTimerAtom);

    // assert
    expect(store.get(elapsedSecondsAtom)).toEqual(0);

    // Wait for two+ seconds so that the timer can increment twice
    await sleep(2500);

    // assert
    expect(store.get(elapsedSecondsAtom)).toEqual(2);

    // Stop the timer
    await store.set(stopTimerAtom);

    // Wait for 1+ second to ensure that the timer does not continue
    await sleep(1500);

    // assert
    expect(store.get(elapsedSecondsAtom)).toEqual(2);
  });
});
