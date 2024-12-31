import { signal } from "@preact/signals-core";
import { relay } from "./signals";

// Model
export class TimerModel {
  // State
  isRunning = signal<boolean>(false);

  // Relays
  elapsedSeconds = relay<number>(0, (set, get) => {
    const isRunning = this.isRunning.value;

    if (!isRunning) {
      return () => {};
    }

    const interval = setInterval(() => {
      set(get() + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  // Events
  startedTimer = () => {
    this.isRunning.value = true;
  };
  stoppedTimer = () => {
    this.isRunning.value = false;
  };
  resettedTimer = () => {
    this.elapsedSeconds.value = 0;
  };

  // Commands
  startTimer = async () => {
    this.startedTimer();
  };
  stopTimer = async () => {
    this.stoppedTimer();
  };
  resetTimer = async () => {
    this.resettedTimer();
  };
}

// Model instance
export const model = new TimerModel();
