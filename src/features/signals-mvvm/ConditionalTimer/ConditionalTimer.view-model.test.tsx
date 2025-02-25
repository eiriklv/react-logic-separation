import { renderHook } from "@testing-library/react";
import React from "react";
import {
  ConditionalTimerViewModelContextInterface,
  ConditionalTimerViewModelContext,
} from "./ConditionalTimer.view-model.context";
import { useConditionalTimerViewModel } from "./ConditionalTimer.view-model";
import { signal } from "@preact/signals-core";
import type { PartialDeep } from "type-fest";

describe("useConditionalTimerViewModel", () => {
  it("should map domain models correctly to view model", async () => {
    // arrange
    const toggleOkay = vi.fn();
    const toggleSafe = vi.fn();
    const toggleCool = vi.fn();
    const resetTimer = vi.fn();

    const mockDependencies: PartialDeep<ConditionalTimerViewModelContextInterface> =
      {
        conditionalTimerModel: {
          elapsedSeconds: signal(0),
          isRunning: signal(true),
          isOkay: signal(true),
          isSafe: signal(true),
          isCool: signal(true),
          toggleOkay,
          toggleSafe,
          toggleCool,
          resetTimer,
        },
      };

    const wrapper: React.FC<{
      children?: React.ReactNode;
    }> = ({ children }) => (
      <ConditionalTimerViewModelContext.Provider
        value={mockDependencies as ConditionalTimerViewModelContextInterface}
      >
        {children}
      </ConditionalTimerViewModelContext.Provider>
    );

    const { result } = renderHook(() => useConditionalTimerViewModel(), {
      wrapper,
    });

    // assert
    expect(result.current).toEqual({
      elapsedSeconds: 0,
      isRunning: true,
      isOkay: true,
      isSafe: true,
      isCool: true,
      toggleOkay,
      toggleSafe,
      toggleCool,
      resetTimer,
    });
  });
});
