import { Accessor, createEffect, createRoot, createSignal } from "@solidjs/signals";

// Model
export class TimerModel {
  // State
  private _elapsedSeconds = createSignal<number>(0);
  private _isRunning = createSignal<boolean>(false);

  // Events
  private _startedTimer = () => {
    const [, setIsRunning] = this._isRunning;
    setIsRunning(true);
  };
  private _stoppedTimer = () => {
    const [, setIsRunning] = this._isRunning;
    setIsRunning(false);
  };
  private _incrementedElapsedSeconds = () => {
    const [, setElapsedSeconds] = this._elapsedSeconds;
    setElapsedSeconds((currentValue) => currentValue + 1);
  };

  // Effect disposal
  private _disposeEffects: () => void = () => { }

  // Constructor
  constructor() {
    // Effects root
    createRoot((disposer) => {
      this._disposeEffects = disposer;

      // Effects
      createEffect(
        // Dependencies
        () => this._isRunning[0](),
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
        });
    });
  }

  // Readonly signals
  public get elapsedSeconds(): Accessor<number> {
    return this._elapsedSeconds[0];
  }
  public get isRunning(): Accessor<boolean> {
    return this._isRunning[0];
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
