import { computed, signal } from "@preact/signals-core";
import { relay } from "../../../lib/signals";

// Model
export class ConditionalTimerModel {
  // State
  isOkay = signal<boolean>(false);
  isSafe = signal<boolean>(false);
  isCool = signal<boolean>(false);

  // Computed
  isRunning = computed(
    () => this.isOkay.value && this.isSafe.value && this.isCool.value
  );

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
  toggledOkay = () => {
    this.isOkay.value = !this.isOkay.value;
  };
  toggledSafe = () => {
    this.isSafe.value = !this.isSafe.value;
  };
  toggledCool = () => {
    this.isCool.value = !this.isCool.value;
  };
  resettedTimer = () => {
    this.elapsedSeconds.value = 0;
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
