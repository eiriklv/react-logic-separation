import {
  effect,
  ReadOnlySignal,
  signal,
} from "../../../lib/solid-signals-wrapper";

// Model
export class TimerModel {
  // State
  private _elapsedSeconds = signal<number>(0);
  private _isRunning = signal<boolean>(false);

  // Events
  private _startedTimer = () => {
    this._isRunning.set(true);
  };
  private _stoppedTimer = () => {
    this._isRunning.set(false);
  };
  private _incrementedElapsedSeconds = () => {
    this._elapsedSeconds.set((currentValue) => currentValue + 1);
  };

  // Effect disposal
  private _disposeEffects: () => void = () => {};

  // Constructor
  constructor() {
    // Effects root
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

  // Readonly signals
  public get elapsedSeconds(): ReadOnlySignal<number> {
    return this._elapsedSeconds;
  }
  public get isRunning(): ReadOnlySignal<boolean> {
    return this._isRunning;
  }

  // Commands
  public startTimer = async () => {
    this._startedTimer();
  };
  public stopTimer = async () => {
    this._stoppedTimer();
  };

  // Disposal
  public dispose() {
    this._disposeEffects();
  }
}

// Model singleton
export const model = new TimerModel();
