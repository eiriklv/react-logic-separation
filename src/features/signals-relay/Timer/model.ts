import { signal } from "@preact/signals-core";
import { relay } from "../../../lib/signals";

// Model
export class TimerModel {
  // State
  isRunning = signal<boolean>(false);

  // Relays (based on: https://www.pzuraq.com/blog/on-signal-relays)
  elapsedSeconds = relay<number>(0, (set, get) => {
    const isRunning = this.isRunning.value;

    if (!isRunning) {
      return;
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

  // Commands
  startTimer = async () => {
    this.startedTimer();
  };
  stopTimer = async () => {
    this.stoppedTimer();
  };
}

// Model singleton
export const model = new TimerModel();
