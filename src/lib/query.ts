import { batch, computed, effect, Signal, signal } from "@preact/signals-core";
import {
  MutateOptions,
  MutationObserver,
  QueryClient,
  QueryObserver,
} from "@tanstack/query-core";

/**
 * Simplified query config type
 */
export type QueryConfig<T> = {
  queryKey: string[];
  queryFn: () => Promise<T>;
};

/**
 * Simplified mutation config type
 */
export type MutationConfig<T, U> = {
  queryKey?: string[];
  mutationFn: (variables: U) => Promise<T>;
  onSuccess?: () => void;
  onError?: () => void;
};

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
export function query<T>(getQueryConfig: () => QueryConfig<T>) {
  const queryClient = computed(() => getQueryClient());
  const queryConfig = computed(() => getQueryConfig());
  const queryObserver = computed(
    () => new QueryObserver(queryClient.value, queryConfig.value),
  );

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
export function mutation<T, U>(getMutationConfig: () => MutationConfig<T, U>) {
  const queryClient = computed(() => getQueryClient());
  const mutationConfig = computed(() => getMutationConfig());
  const mutationObserver = computed(
    () => new MutationObserver(queryClient.value, mutationConfig.value),
  );

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

  const mutate = (
    variables: U,
    options?: MutateOptions<T, Error, U, unknown> | undefined,
  ) => {
    mutationObserver.value.mutate(variables, options);
  };

  return { mutate, data, isSuccess, isPending, error };
}
