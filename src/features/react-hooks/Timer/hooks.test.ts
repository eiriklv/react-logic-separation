import { renderHook, act } from '@testing-library/react'
import { useTimerModel } from './hooks'

describe("startedTimer (event)", () => {
  it("should work as expected when starting timer", () => {
    // arrange
    const { result } = renderHook(useTimerModel);

    // act
    act(() => result.current.startedTimer());

    // assert
    expect(result.current.isRunning).toEqual(true);
  });
});

describe("startTimer (command)", () => {
  it("should work as expected when starting timer", async () => {
    // arrange
    const { result } = renderHook(useTimerModel);

    // act
    await act(() => result.current.startTimer());

    // assert
    expect(result.current.isRunning).toEqual(true);
  });
});

describe("incrementTimerWhileRunning (effect)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should only increment the timer while running", async () => {
    // arrange
    const { result } = renderHook(useTimerModel);

    // Start the timer
    await act(() => result.current.startTimer());

    // assert
    expect(result.current.elapsedSeconds).toEqual(0);

    // Wait for two+ seconds so that the timer can increment twice
    await vi.advanceTimersByTimeAsync(2000);

    // assert
    expect(result.current.elapsedSeconds).toEqual(2);

    // Stop the timer
    await act(() => result.current.stopTimer());

    // Wait for two+ second to ensure that the timer does not continue
    await vi.advanceTimersByTimeAsync(2000);

    // assert
    expect(result.current.elapsedSeconds).toEqual(2);
  });
});
