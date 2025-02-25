import { renderHook } from "@testing-library/react";
import React from "react";
import {
  TimerViewModelContextInterface,
  TimerViewModelContext,
} from "./Timer.view-model.context";
import { useTimerViewModel } from "./Timer.view-model";
import { signal } from "@preact/signals-core";
import type { PartialDeep } from "type-fest";

describe("useTimerViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const startTimer = vi.fn();
    const stopTimer = vi.fn();

    const mockDependencies: PartialDeep<TimerViewModelContextInterface> = {
      timerModel: {
        elapsedSeconds: signal(0),
        isRunning: signal(true),
        startTimer,
        stopTimer,
      },
    };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <TimerViewModelContext.Provider
        value={mockDependencies as TimerViewModelContextInterface}
      >
        {children}
      </TimerViewModelContext.Provider>
    );

    const { result } = renderHook(() => useTimerViewModel(), { wrapper });

    // assert
    expect(result.current).toEqual({
      elapsedSeconds: 0,
      isRunning: true,
      startTimer,
      stopTimer,
    });
  });
});
