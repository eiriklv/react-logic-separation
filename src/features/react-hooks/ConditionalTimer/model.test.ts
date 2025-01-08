import { renderHook, act } from '@testing-library/react'
import { useConditionalTimerModel } from "./model";

describe("toggle okay, safe and cool (commands)", () => {
  it("should work as expected when starting timer", async () => {
    // arrange
    const { result } = renderHook(useConditionalTimerModel);

    // act
    await act(() => result.current.toggleOkay());

    // assert
    expect(result.current.isRunning).toEqual(false);
 
    // act
    await act(() => result.current.toggleSafe());

    // assert
    expect(result.current.isRunning).toEqual(false);

    // act
    await act(() => result.current.toggleCool());

    // assert
    expect(result.current.isRunning).toEqual(true);
  });
});

describe("reset timer (command)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should work as expected when resetting timer", async () => {
    // arrange
    const { result } = renderHook(useConditionalTimerModel);

    // Start the timer
    await act(() => result.current.toggleOkay());
    await act(() => result.current.toggleSafe());
    await act(() => result.current.toggleCool());

    // assert
    expect(result.current.elapsedSeconds).toEqual(0);

    // Wait for two+ seconds so that the timer can increment twice
    await act(() => vi.advanceTimersByTimeAsync(2000));

    // assert
    expect(result.current.elapsedSeconds).toEqual(2);

    // Reset the timer
    await act(() => result.current.resetTimer());

    // assert
    expect(result.current.elapsedSeconds).toEqual(0);

    // Wait for two+ seconds so that the timer can increment twice
    await act(() => vi.advanceTimersByTimeAsync(2000));

    // assert
    expect(result.current.elapsedSeconds).toEqual(2);
  });
});

describe("Timer auto-increment (effect)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should only increment the elapsed seconds while running", async () => {
    // arrange
    const { result } = renderHook(useConditionalTimerModel);

    // Start the timer by toggling all the necessary conditions on
    await act(() => result.current.toggleOkay());
    await act(() => result.current.toggleSafe());
    await act(() => result.current.toggleCool());

    // assert
    expect(result.current.elapsedSeconds).toEqual(0);

    // Wait for two+ seconds so that the timer can increment twice
    await act(() => vi.advanceTimersByTimeAsync(2000));

    // assert
    expect(result.current.elapsedSeconds).toEqual(2);

    // Stop the timer by toggling at least one of the conditions off
    await act(() => result.current.toggleOkay());

    // Wait for a long time to ensure that the timer does not continue
    await act(() => vi.advanceTimersByTimeAsync(10000));

    // assert
    expect(result.current.elapsedSeconds).toEqual(2);
  });
});
