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
  private _toggledOkay = () => {
    this._isOkay.value = !this._isOkay.value;
  };
  private _toggledSafe = () => {
    this._isSafe.value = !this._isSafe.value;
  };
  private _toggledCool = () => {
    this._isCool.value = !this._isCool.value;
  };
  private _resettedTimer = () => {
    this._elapsedSeconds.value = 0;
  };

  // Read-only signals (public for consumption)
  public get isOkay() {
    return computed(() => this._isOkay.value);
  }
  public get isSafe() {
    return computed(() => this._isSafe.value);
  }
  public get isCool() {
    return computed(() => this._isCool.value);
  }
  public get isRunning() {
    return computed(() => this._isRunning.value);
  }
  public get elapsedSeconds() {
    return computed(() => this._elapsedSeconds.value);
  }

  // Commands (public for consumption)
  public toggleOkay = async () => {
    this._toggledOkay();
  };
  public toggleSafe = async () => {
    this._toggledSafe();
  };
  public toggleCool = async () => {
    this._toggledCool();
  };
  public resetTimer = async () => {
    this._resettedTimer();
  };
}

// Model singleton
export const model = new ConditionalTimerModel();
