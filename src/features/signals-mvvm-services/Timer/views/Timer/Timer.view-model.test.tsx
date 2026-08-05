import { renderHook } from "@testing-library/react";
import React from "react";
import { useTimerViewModel } from "./Timer.view-model";
import { signal } from "@preact/signals-core";
import { TimerViewModelDependencies } from "./Timer.view-model.dependencies";

describe("useTimerViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const mockTimerModel: ReturnType<
      TimerViewModelDependencies["createTimerModel"]
    > = {
      elapsedSeconds: signal(0),
      isRunning: signal(true),
      startTimer: vi.fn(),
      stopTimer: vi.fn(),
      dispose: vi.fn(),
    };

    const dependencies: TimerViewModelDependencies = {
      createTimerModel: vi.fn(() => mockTimerModel),
    };

    const { result } = renderHook(() => useTimerViewModel({ dependencies }));

    // assert
    expect(result.current.elapsedSeconds).toEqual(
      mockTimerModel.elapsedSeconds.value,
    );
    expect(result.current.isRunning).toEqual(mockTimerModel.isRunning.value);
    expect(result.current.startTimer).toEqual(mockTimerModel.startTimer);
    expect(result.current.stopTimer).toEqual(mockTimerModel.stopTimer);
  });
});
