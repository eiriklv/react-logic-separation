import { computed, effect, ReadonlySignal, signal } from "@preact/signals-core";

// Model
export class ConditionalTimerModel {
  // State
  private _isOkay = signal<boolean>(false);
  private _isSafe = signal<boolean>(false);
  private _isCool = signal<boolean>(false);
  private _elapsedSeconds = signal<number>(0);

  // Computed
  private _isRunning = computed(
    () => this._isOkay.value && this._isSafe.value && this._isCool.value,
  );

  // Effects
  private _disposeIncrementTimerWhileRunning = effect(() => {
    const isRunning = this._isRunning.value;

    if (!isRunning) {
      return;
    }

    const interval = setInterval(() => {
      this._incrementedElapsedSeconds();
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
  private _incrementedElapsedSeconds = () => {
    this._elapsedSeconds.value = this._elapsedSeconds.value + 1;
  };

  // Getters
  public get isOkay(): ReadonlySignal<boolean> {
    return this._isOkay;
  }
  public get isSafe(): ReadonlySignal<boolean> {
    return this._isSafe;
  }
  public get isCool(): ReadonlySignal<boolean> {
    return this._isCool;
  }
  public get isRunning(): ReadonlySignal<boolean> {
    return this._isRunning;
  }
  public get elapsedSeconds(): ReadonlySignal<number> {
    return this._elapsedSeconds;
  }

  // Commands
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

  // Disposal
  public dispose() {
    this._disposeIncrementTimerWhileRunning();
  }
}

// Model singleton
export const model = new ConditionalTimerModel();
