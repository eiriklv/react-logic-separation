import { atom, getDefaultStore } from "jotai";
import { atomEffect } from "jotai-effect";
import { noop } from "../../../lib/utils";

// Store instance (required by jotai to be able to to anything to atoms)
export const defaultStore = getDefaultStore();

// Model
export class ConditionalTimerModel {
  constructor(store: typeof defaultStore = defaultStore) {
    // initialize store
    this.store = store;

    // attach effects (does not happen automatically for jotai...)
    this.store.sub(this.incrementTimerWhileRunning, noop);
  }

  // Store (required by jotai to be able to interact with atoms)
  store: typeof defaultStore = defaultStore;

  // State
  isOkay = atom<boolean>(false);
  isSafe = atom<boolean>(false);
  isCool = atom<boolean>(false);
  elapsedSeconds = atom<number>(0);

  // Computed
  isRunning = atom(
    (get) => get(this.isOkay) && get(this.isSafe) && get(this.isCool)
  );

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

  // Events
  toggledOkay = () => {
    this.store.set(this.isOkay, (value) => !value);
  };
  toggledSafe = () => {
    this.store.set(this.isSafe, (value) => !value);
  };
  toggledCool = () => {
    this.store.set(this.isCool, (value) => !value);
  };
  resettedTimer = () => {
    this.store.set(this.elapsedSeconds, 0);
  };
  incrementedElapsedSeconds = () => {
    this.store.set(this.elapsedSeconds, (value) => value + 1);
  };

  // Commands (public for consumption)
  toggleOkay = async () => {
    this.toggledOkay();
  };
  toggleSafe = async () => {
    this.toggledSafe();
  };
  toggleCool = async () => {
    this.toggledCool();
  };
  resetTimer = async () => {
    this.resettedTimer();
  };
}

// Model instance
export const model = new ConditionalTimerModel();
