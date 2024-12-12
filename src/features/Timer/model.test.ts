import { describe, it, expect } from "vitest";
import { model } from "./model";
import { createStore } from "easy-peasy";
import { sleep } from "./utils";
import { trackActionsMiddleware } from "../../test/utils";

describe("startedTimer (action)", () => {
  it("should work as expected when starting timer", () => {
    // arrange
    const store = createStore(model, {});

    // act
    store.getActions().startedTimer();

    // assert
    expect(store.getState().isRunning).toEqual(true);
  });
});

describe("startTimer (thunk)", () => {
  it("should work as expected when starting timer", () => {
    // arrange
    const store = createStore(model, {
      mockActions: true,
    });

    // act
    store.getActions().startTimer();

    // assert
    expect(store.getMockedActions()).toEqual([
      {
        type: "@thunk.startTimer(start)",
      },
      {
        type: "@action.startedTimer",
      },
    ]);
  });
});

describe("incrementTimerWhileRunning (effect)", () => {
  it("should only increment the timer while running", async () => {
    // arrange
    const actionTracker = trackActionsMiddleware();

    const store = createStore(model, {
      middleware: [actionTracker],
    });

    // Start the timer
    store.getActions().startTimer();

    // assert
    expect(actionTracker.actions).toEqual([
      {
        type: "@thunk.startTimer(start)",
      },
      {
        type: "@action.startedTimer",
      },
      {
        type: "@effectOn.incrementTimerWhileRunning(start)",
        change: {
          prev: [false],
          current: [true],
          action: {
            type: "@action.startedTimer",
          },
        },
      },
      {
        type: "@effectOn.incrementTimerWhileRunning(success)",
        change: {
          prev: [false],
          current: [true],
          action: {
            type: "@action.startedTimer",
          },
        },
      },
    ]);

    // Wait for two+ seconds so that the timer can increment twice
    await sleep(2500);

    // assert
    expect(actionTracker.actions).toEqual([
      {
        type: "@thunk.startTimer(start)",
      },
      {
        type: "@action.startedTimer",
      },
      {
        type: "@effectOn.incrementTimerWhileRunning(start)",
        change: {
          prev: [false],
          current: [true],
          action: {
            type: "@action.startedTimer",
          },
        },
      },
      {
        type: "@effectOn.incrementTimerWhileRunning(success)",
        change: {
          prev: [false],
          current: [true],
          action: {
            type: "@action.startedTimer",
          },
        },
      },
      {
        type: "@thunk.startTimer(success)",
      },
      {
        type: "@action.incrementedElapsedSeconds",
      },
      {
        type: "@action.incrementedElapsedSeconds",
      },
    ]);

    // Stop the timer
    store.getActions().stopTimer();

    // Wait for 1+ second to ensure that the timer does not continue
    await sleep(1500);

    // assert
    expect(actionTracker.actions).toEqual([
      {
        type: "@thunk.startTimer(start)",
      },
      {
        type: "@action.startedTimer",
      },
      {
        type: "@effectOn.incrementTimerWhileRunning(start)",
        change: {
          prev: [false],
          current: [true],
          action: {
            type: "@action.startedTimer",
          },
        },
      },
      {
        type: "@effectOn.incrementTimerWhileRunning(success)",
        change: {
          prev: [false],
          current: [true],
          action: {
            type: "@action.startedTimer",
          },
        },
      },
      {
        type: "@thunk.startTimer(success)",
      },
      {
        type: "@action.incrementedElapsedSeconds",
      },
      {
        type: "@action.incrementedElapsedSeconds",
      },
      {
        type: "@thunk.stopTimer(start)",
      },
      {
        type: "@action.stoppedTimer",
      },
      {
        type: "@effectOn.incrementTimerWhileRunning(start)",
        change: {
          prev: [true],
          current: [false],
          action: {
            type: "@action.stoppedTimer",
          },
        },
      },
      {
        type: "@effectOn.incrementTimerWhileRunning(success)",
        change: {
          prev: [true],
          current: [false],
          action: {
            type: "@action.stoppedTimer",
          },
        },
      },
      {
        type: "@thunk.stopTimer(success)",
      },
    ]);
  });
});
