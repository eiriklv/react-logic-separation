import {
  computed,
  effect,
  ReadOnlySignal,
  signal,
} from "../../../lib/solid-signals-wrapper";

// Model
export class ConditionalTimerModel {
  // State
  private _isOkay = signal<boolean>(false);
  private _isSafe = signal<boolean>(false);
  private _isCool = signal<boolean>(false);
  private _elapsedSeconds = signal<number>(0);

  // Computed
  private _isRunning = computed(
    () => this._isOkay.get() && this._isSafe.get() && this._isCool.get(),
  );

  // Effect disposal
  private _disposeEffects: () => void = () => {};

  // Constructor
  constructor() {
    // Effects
    this._disposeEffects = effect(
      // Dependencies
      () => {
        return this._isRunning.get();
      },
      // Effect
      (isRunning) => {
        if (!isRunning) {
          return;
        }

        const interval = setInterval(() => {
          this._incrementedElapsedSeconds();
        }, 1000);

        return () => {
          clearInterval(interval);
        };
      },
    );
  }

  // Events
  private _toggledOkay = () => {
    this._isOkay.set((value) => !value);
  };
  private _toggledSafe = () => {
    this._isSafe.set((value) => !value);
  };
  private _toggledCool = () => {
    this._isCool.set((value) => !value);
  };
  private _resettedTimer = () => {
    this._elapsedSeconds.set(0);
  };
  private _incrementedElapsedSeconds = () => {
    this._elapsedSeconds.set((value) => value + 1);
  };

  // Readonly signals
  public get isOkay(): ReadOnlySignal<boolean> {
    return this._isOkay;
  }
  public get isSafe(): ReadOnlySignal<boolean> {
    return this._isSafe;
  }
  public get isCool(): ReadOnlySignal<boolean> {
    return this._isCool;
  }
  public get elapsedSeconds(): ReadOnlySignal<number> {
    return this._elapsedSeconds;
  }
  public get isRunning(): ReadOnlySignal<boolean> {
    return this._isRunning;
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
    this._disposeEffects();
  }
}

// Model singleton
export const model = new ConditionalTimerModel();
