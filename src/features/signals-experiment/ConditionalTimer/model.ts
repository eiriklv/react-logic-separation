import { computed, signal } from "@preact/signals-core";
import { relay } from "../../../lib/signals";

// Model
export class ConditionalTimerModel {
  // State
  private _isOkay = signal<boolean>(false);
  private _isSafe = signal<boolean>(false);
  private _isCool = signal<boolean>(false);

  // Computed
  private _isRunning = computed(
    () => this._isOkay.value && this._isSafe.value && this._isCool.value
  );

  // Relays (based on: https://www.pzuraq.com/blog/on-signal-relays)
  private _elapsedSeconds = relay<number>(0, (set, get) => {
    const isRunning = this._isRunning.value;

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

  // Events (public for testing)
  toggledOkay = () => {
    this._isOkay.value = !this._isOkay.value;
  };
  toggledSafe = () => {
    this._isSafe.value = !this._isSafe.value;
  };
  toggledCool = () => {
    this._isCool.value = !this._isCool.value;
  };
  resettedTimer = () => {
    this._elapsedSeconds.value = 0;
  };

  // Read-only signals (public for consumption)
  readonly isOkay = computed(() => this._isOkay.value);
  readonly isSafe = computed(() => this._isSafe.value);
  readonly isCool = computed(() => this._isCool.value);
  readonly isRunning = computed(() => this._isRunning.value);
  readonly elapsedSeconds = computed(() => this._elapsedSeconds.value);

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
