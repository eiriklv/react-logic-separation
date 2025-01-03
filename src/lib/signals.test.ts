import { signal } from "@preact/signals-core";
import { debounced, previous, relay } from "./signals";

describe("relay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  })

  it("should initialize correctly", () => {
    // arrange
    const timeoutInMs = 1000;
    
    const myRelaySignal = relay(0, (set) => {
      setTimeout(() => {
        set(10);
      }, timeoutInMs);
    });

    // assert
    expect(myRelaySignal.value).toEqual(0);

    // act
    vi.advanceTimersByTime(timeoutInMs);

    // assert
    expect(myRelaySignal.value).toEqual(10);
  });

  it("should continue to update correctly", () => {
    // arrange
    const intervalInMs = 1000;
    
    const myRelaySignal = relay(0, (set, get) => {
      setInterval(() => {
        set(get() + 1);
      }, intervalInMs);
    });

    // assert
    expect(myRelaySignal.value).toEqual(0);

    // act
    vi.advanceTimersByTime(intervalInMs);

    // assert
    expect(myRelaySignal.value).toEqual(1);

    // act
    vi.advanceTimersByTime(intervalInMs);

    // assert
    expect(myRelaySignal.value).toEqual(2);

    // act
    vi.advanceTimersByTime(intervalInMs);

    // assert
    expect(myRelaySignal.value).toEqual(3);
  });

  it("should trigger on dependency changes correctly", () => {
    // arrange
    const intervalInMs = 1000;
    const mySignal = signal(0);
    
    const myRelaySignal = relay(0, (set, get) => {
      const signalValue = mySignal.value;
      set(signalValue);
      
      const relayInterval = setInterval(() => {
        set(get() + 1);
      }, intervalInMs);

      return () => {
        clearInterval(relayInterval);
      }
    });

    // assert
    expect(myRelaySignal.value).toEqual(0);

    // act
    vi.advanceTimersByTime(intervalInMs);

    // assert
    expect(myRelaySignal.value).toEqual(1);

    // act
    vi.advanceTimersByTime(intervalInMs);

    // assert
    expect(myRelaySignal.value).toEqual(2);

    // act
    mySignal.value = 10;

    // assert
    expect(myRelaySignal.value).toEqual(10);

    // act
    vi.advanceTimersByTime(intervalInMs);

    // assert
    expect(myRelaySignal.value).toEqual(11);

    // act
    vi.advanceTimersByTime(intervalInMs);

    // assert
    expect(myRelaySignal.value).toEqual(12);
  });
});

describe("previous", () => {
  it("should contain previous value of input signal", () => {
    // arrange
    const mySignal = signal(1);
    const myPreviousSignal = previous(mySignal);

    // assert
    expect(mySignal.value).toEqual(1);
    expect(myPreviousSignal.value).toEqual(1);

    // act
    mySignal.value = 2;

    // assert
    expect(mySignal.value).toEqual(2);
    expect(myPreviousSignal.value).toEqual(1);

    // act
    mySignal.value = 3;

    // assert
    expect(mySignal.value).toEqual(3);
    expect(myPreviousSignal.value).toEqual(2);
  });
});

describe("debounced", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it("should not update value before debounce time", () => {
      // arrange
      const debounceTime = 1000;
      const mySignal = signal(1);
      const myDebouncedSignal = debounced(mySignal, debounceTime);
  
      // assert
      expect(mySignal.value).toEqual(1);
      expect(myDebouncedSignal.value).toEqual(1);
  
      // act
      mySignal.value = 2;
  
      // assert
      expect(mySignal.value).toEqual(2);
      expect(myDebouncedSignal.value).toEqual(1);
  
      // act
      vi.advanceTimersByTime(debounceTime);
  
      // assert
      expect(mySignal.value).toEqual(2);
      expect(myDebouncedSignal.value).toEqual(2);
    });
  });
