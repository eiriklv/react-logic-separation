import { atom, getDefaultStore } from "jotai";
import { atomEffect } from "jotai-effect";

export class TimerModel {
  // State
  elapsedSeconds = atom<number>(0);
  isRunning = atom<boolean>(false);

  // Events
  startedTimer = atom<null, [], void>(null, (_get, set) => {
    set(this.isRunning, true);
  });

  stoppedTimer = atom<null, [], void>(null, (_get, set) => {
    set(this.isRunning, false);
  });

  incrementedElapsedSeconds = atom<null, [], void>(null, (_get, set) => {
    set(this.elapsedSeconds, (value) => value + 1);
  });

  // Commands
  startTimer = atom<null, [], Promise<void>>(null, async (_get, set) => {
    set(this.startedTimer);
  });

  stopTimer = atom<null, [], Promise<void>>(null, async (_get, set) => {
    set(this.stoppedTimer);
  });

  // Effects
  incrementTimerWhileRunning = atomEffect((get, set) => {
    const isRunningValue = get(this.isRunning);

    if (!isRunningValue) {
      return () => {};
    }

    const interval = setInterval(() => {
      set(this.incrementedElapsedSeconds);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });
}

// Model instance
export const model = new TimerModel();

// Store instance
export const store = getDefaultStore();
