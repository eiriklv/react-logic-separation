import { computed, effect, signal } from "@preact/signals-core";

// Model
export class ConditionalTimerModel {
  // State
  isOkay = signal<boolean>(false);
  isSafe = signal<boolean>(false);
  isCool = signal<boolean>(false);
  elapsedSeconds = signal<number>(0);

  // Computed
  isRunning = computed(
    () => this.isOkay.value && this.isSafe.value && this.isCool.value
  );

  // Effects
  incrementTimerWhileRunning = effect(() => {
    const isRunning = this.isRunning.value;

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
  incrementedElapsedSeconds = () => {
    this.elapsedSeconds.value = this.elapsedSeconds.value + 1;
  };

  // Commands
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
