import { atom, getDefaultStore } from "jotai";
import { atomEffect } from "jotai-effect";
import { noop } from "./utils";

// Store instance (required by jotai to be able to to anything to atoms)
export const defaultStore = getDefaultStore();

export class TimerModel {
  constructor(store: typeof defaultStore = defaultStore) {
    // initialize store
    this.store = store;

    // attach effects (does not happen automatically for jotai...)
    this.store.sub(this.incrementTimerWhileRunning, noop);
  }

  // Store (required by jotai to be able to interact with atoms)
  store: typeof defaultStore = defaultStore;

  // State
  elapsedSeconds = atom<number>(0);
  isRunning = atom<boolean>(false);

  // Events
  startedTimer = () => {
    this.store.set(this.isRunning, true);
  }
  stoppedTimer = () => {
    this.store.set(this.isRunning, false);
  };
  incrementedElapsedSeconds = () => {
    this.store.set(this.elapsedSeconds, (value) => value + 1);
  };

  // Commands
  startTimer = async () => {
    this.startedTimer();
  };

  stopTimer = async () => {
    this.stoppedTimer();
  };

  // Effects
  incrementTimerWhileRunning = atomEffect((get) => {
    const isRunning = get(this.isRunning);

    if (!isRunning) {
      return () => {};
    }

    const interval = setInterval(() => {
      this.incrementedElapsedSeconds();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });
}

// Model instance
export const model = new TimerModel();
