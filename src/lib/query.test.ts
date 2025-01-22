import { signal } from "@preact/signals-core";
import { query, queryCache } from "./query";

describe("query", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    queryCache.clear();
  });

  it("should initialize and resolve correctly (promise)", async () => {
    const myQuery = query(() => ({
      queryKey: ["abc"],
      queryFn: () => Promise.resolve(10),
    }));

    expect(myQuery.isLoading.value).toBe(true);
    expect(myQuery.isPending.value).toBe(true);
    expect(myQuery.data.value).toEqual(undefined);
    expect(myQuery.error.value).toEqual(null);

    await vi.advanceTimersToNextTimerAsync();

    expect(myQuery.isLoading.value).toBe(false);
    expect(myQuery.isPending.value).toBe(false);
    expect(myQuery.data.value).toEqual(10);
    expect(myQuery.error.value).toEqual(null);
  });

  it("should initialize and resolve correctly (async)", async () => {
    const myQuery = query(() => ({
      queryKey: ["abc"],
      queryFn: async () => 10,
    }));

    expect(myQuery.isLoading.value).toBe(true);
    expect(myQuery.isPending.value).toBe(true);
    expect(myQuery.data.value).toEqual(undefined);
    expect(myQuery.error.value).toEqual(null);

    await vi.advanceTimersToNextTimerAsync();

    expect(myQuery.isLoading.value).toBe(false);
    expect(myQuery.isPending.value).toBe(false);
    expect(myQuery.data.value).toEqual(10);
    expect(myQuery.error.value).toEqual(null);
  });

  it("should update according to dependencies", async () => {
    const mySignal1 = signal("a");
    const mySignal2 = signal(10);
    const myQuery = query(() => ({
      queryKey: [`abc-${mySignal1.value}`],
      queryFn: async () => mySignal2.value,
    }));

    expect(myQuery.isLoading.value).toBe(true);
    expect(myQuery.isPending.value).toBe(true);
    expect(myQuery.data.value).toEqual(undefined);
    expect(myQuery.error.value).toEqual(null);

    await vi.advanceTimersToNextTimerAsync();

    expect(myQuery.isLoading.value).toBe(false);
    expect(myQuery.isPending.value).toBe(false);
    expect(myQuery.data.value).toEqual(10);
    expect(myQuery.error.value).toEqual(null);

    mySignal2.value = 20;

    expect(myQuery.isLoading.value).toBe(false);
    expect(myQuery.isPending.value).toBe(false);
    expect(myQuery.data.value).toEqual(10);
    expect(myQuery.error.value).toEqual(null);

    await vi.advanceTimersToNextTimerAsync();

    expect(myQuery.isLoading.value).toBe(false);
    expect(myQuery.isPending.value).toBe(false);
    expect(myQuery.data.value).toEqual(20);
    expect(myQuery.error.value).toEqual(null);

    mySignal1.value = "b";

    expect(myQuery.isLoading.value).toBe(true);
    expect(myQuery.isPending.value).toBe(true);
    expect(myQuery.data.value).toEqual(undefined);
    expect(myQuery.error.value).toEqual(null);

    await vi.advanceTimersToNextTimerAsync();

    expect(myQuery.isLoading.value).toBe(false);
    expect(myQuery.isPending.value).toBe(false);
    expect(myQuery.data.value).toEqual(20);
    expect(myQuery.error.value).toEqual(null);
  });
});
