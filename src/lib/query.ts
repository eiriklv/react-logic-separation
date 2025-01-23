import { batch, computed, effect, Signal, signal } from "@preact/signals-core";
import {
  MutateOptions,
  MutationObserver,
  MutationObserverOptions,
  QueryClient,
  QueryObserver,
  QueryObserverOptions,
} from "@tanstack/query-core";

/**
 * Create default query client
 */
const activeQueryClient: Signal<QueryClient> = signal(new QueryClient());

/**
 * Mount default query client
 */
activeQueryClient.value.mount();

/**
 * Export setter for query client
 */
export const setQueryClient = (newQueryClient: QueryClient) => {
  activeQueryClient.value.unmount();
  activeQueryClient.value = newQueryClient;
  activeQueryClient.value.mount();
};

/**
 * Export getter for query client
 */
export const getQueryClient = () => activeQueryClient.value;

/**
 * NOTE: This is a simplified version of the tanstack-query query interface
 */
export function query<T>(getQueryConfig: () => QueryObserverOptions<T>) {
  const queryClient = computed(() => getQueryClient());
  const queryConfig = computed(() => getQueryConfig());
  const queryObserver = computed(
    () => new QueryObserver(queryClient.value, queryConfig.value),
  );

  /**
   * NOTE: At the moment we only expose a subset of the query results,
   * but this can be extended to include everything (as signals when applicable)
   */
  const data: Signal<T | undefined> = signal(undefined);
  const isLoading: Signal<boolean> = signal(false);
  const isPending: Signal<boolean> = signal(false);
  const isFetching: Signal<boolean> = signal(false);
  const isSuccess: Signal<boolean> = signal(false);
  const error: Signal<unknown> = signal(null);

  effect(() => {
    const disposeQuerySubscription = queryObserver.value.subscribe((result) => {
      batch(() => {
        data.value = result.data;
        isLoading.value = result.isLoading;
        isPending.value = result.isPending;
        isFetching.value = result.isFetching;
        isSuccess.value = result.isSuccess;
        error.value = result.error;
      });
    });

    return () => {
      disposeQuerySubscription();
    };
  });

  return { data, isLoading, isPending, isFetching, isSuccess, error };
}

/**
 * NOTE: This is a simplified version of the tanstack-query mutation interface
 */
export function mutation<T, U, V, X>(
  getMutationConfig: () => MutationObserverOptions<T, U, V, X>,
) {
  const queryClient = computed(() => getQueryClient());
  const mutationConfig = computed(() => getMutationConfig());
  const mutationObserver = computed(
    () => new MutationObserver(queryClient.value, mutationConfig.value),
  );

  /**
   * NOTE: At the moment we only expose a subset of the query results,
   * but this can be extended to include everything (as signals when applicable)
   */
  const data: Signal<T | undefined> = signal(undefined);
  const isSuccess: Signal<boolean> = signal(false);
  const isPending: Signal<boolean> = signal(false);
  const error: Signal<unknown> = signal(null);

  effect(() => {
    const disposeMutationSubscription = mutationObserver.value.subscribe(
      (result) => {
        batch(() => {
          data.value = result.data;
          isSuccess.value = result.isSuccess;
          isPending.value = result.isPending;
          error.value = result.error;
        });
      },
    );

    return () => {
      disposeMutationSubscription();
    };
  });

  const mutate = (variables: V, options?: MutateOptions<T, U, V, X>) => {
    return mutationObserver.value.mutate(variables, options);
  };

  return { mutate, data, isSuccess, isPending, error };
}
