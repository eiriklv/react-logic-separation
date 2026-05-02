import {
  Accessor,
  createEffect,
  createMemo,
  createRoot,
  createSignal,
} from "@solidjs/signals";

// Model
export class ConditionalTimerModel {
  // State
  private _isOkay = createSignal<boolean>(false);
  private _isSafe = createSignal<boolean>(false);
  private _isCool = createSignal<boolean>(false);
  private _elapsedSeconds = createSignal<number>(0);

  // Computed
  private _isRunning = createMemo(
    () => this._isOkay[0]() && this._isSafe[0]() && this._isCool[0](),
  );

  // Effect disposal
  private _disposeEffects: () => void = () => {};

  // Constructor
  constructor() {
    // Effects root
    createRoot((disposer) => {
      this._disposeEffects = disposer;

      // Effects
      createEffect(
        // Dependencies
        () => {
          const isRunning = this._isRunning;
          return isRunning();
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
    });
  }

  // Events
  private _toggledOkay = () => {
    this._isOkay[1]((value) => !value);
  };
  private _toggledSafe = () => {
    this._isSafe[1]((value) => !value);
  };
  private _toggledCool = () => {
    this._isCool[1]((value) => !value);
  };
  private _resettedTimer = () => {
    this._elapsedSeconds[1](0);
  };
  private _incrementedElapsedSeconds = () => {
    this._elapsedSeconds[1]((value) => value + 1);
  };

  // Readonly signals
  public get isOkay(): Accessor<boolean> {
    return this._isOkay[0];
  }
  public get isSafe(): Accessor<boolean> {
    return this._isSafe[0];
  }
  public get isCool(): Accessor<boolean> {
    return this._isCool[0];
  }
  public get elapsedSeconds(): Accessor<number> {
    return this._elapsedSeconds[0];
  }
  public get isRunning() {
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
