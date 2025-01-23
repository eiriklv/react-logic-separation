import { signal } from "@preact/signals-core";
import { query, getQueryClient, mutation } from "./query";
import { sleep } from "./utils";

describe("query", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    getQueryClient().getQueryCache().clear();
    getQueryClient().getMutationCache().clear();
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

    // This changes the query function
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

    // This changes the cache key
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

describe("mutation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    getQueryClient().getQueryCache().clear();
    getQueryClient().getMutationCache().clear();
  });

  it("should trigger re-fetching of query when mutation invalidates cache", async () => {
    let count = 10;
    const getNextCount = () => count++;

    const queryKey = ["abc"];

    const myQuery = query(() => ({
      queryKey,
      queryFn: async () => {
        await sleep(100);
        return getNextCount();
      },
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

    const myMutation = mutation<number, void, void, void>(() => ({
      mutationFn: async () => {
        await sleep(100);
        return 50;
      },
      onSuccess: () => {
        getQueryClient().invalidateQueries({ queryKey });
      },
    }));

    const resultPromise = myMutation.mutate();

    expect(myMutation.isSuccess.value).toBe(false);
    expect(myMutation.isPending.value).toBe(true);
    expect(myMutation.data.value).toEqual(undefined);
    expect(myMutation.error.value).toEqual(null);

    expect(myQuery.isFetching.value).toBe(false);
    expect(myQuery.isSuccess.value).toBe(true);
    expect(myQuery.isLoading.value).toBe(false);
    expect(myQuery.isPending.value).toBe(false);
    expect(myQuery.data.value).toEqual(10);
    expect(myQuery.error.value).toEqual(null);

    await vi.advanceTimersToNextTimerAsync();

    expect(myMutation.isSuccess.value).toBe(true);
    expect(myMutation.isPending.value).toBe(false);
    expect(myMutation.data.value).toEqual(50);
    expect(myMutation.error.value).toEqual(null);

    const result = await resultPromise;
    expect(result).toEqual(50);

    expect(myQuery.isFetching.value).toBe(true);
    expect(myQuery.isSuccess.value).toBe(true);
    expect(myQuery.isLoading.value).toBe(false);
    expect(myQuery.isPending.value).toBe(false);
    expect(myQuery.data.value).toEqual(10);
    expect(myQuery.error.value).toEqual(null);

    await vi.advanceTimersToNextTimerAsync();

    expect(myMutation.isSuccess.value).toBe(true);
    expect(myMutation.isPending.value).toBe(false);
    expect(myMutation.data.value).toEqual(50);
    expect(myMutation.error.value).toEqual(null);

    expect(myQuery.isFetching.value).toBe(false);
    expect(myQuery.isSuccess.value).toBe(true);
    expect(myQuery.isLoading.value).toBe(false);
    expect(myQuery.isPending.value).toBe(false);
    expect(myQuery.data.value).toEqual(11);
    expect(myQuery.error.value).toEqual(null);
  });
});
