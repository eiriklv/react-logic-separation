# Infield Code Structure Guidelines

This is a proposal for using a simplified version of [MVVM](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel) adapted to React to structure the application using layers and boundaries.

Note that this document doesn't explain concepts like dependency injection and testing, which is already documented in the general development guidelines for Fusion.

The examples used are simplified for brevity.

## Application Layers

- Views (components)
- View models (hooks)
- Domain models (hooks)
- Services (classes)

## General Rules

1. It is not allowed to cross more than a single boundary (with one notable exception)
2. It is not allowed to introduce additional layers (without sufficient justification)

## Explaining the separation of concerns

### Services

Services are represented as classes.

This is where we expose an internal service layer for the domain models to consume. These services will be responsible for any kind of external communications with the platform. It would for example be the place where we use the SDKs (like CogniteClient) and do any kind network calls (depending on how we are interfacing with the backend). These services would also be responsible for doing things like mapping raw platform types into DTOs to be consumed futher up in the application. Each service would normally map to a resource type, like "Observation" or "Checklist".

**Naming examples:**

- `ObservationService`
- `ChecklistService`

**Rules:**

1. A service is the only place where we are allowed to use SDKs or network calls
2. A service can only be consumed by the domain model layer

**Example:**

```ts
/**
 * What we depend on from CogniteClient (the SDK)
 */
export interface CogniteClientDependencies {
  instances: {
    retrieve: CogniteClient['instances']['retrieve'];
    upsert: CogniteClient['instances']['upsert'];
  };
}

/**
 * The service interface
 */
export interface IObservationService {
  fetchObservations(
    filter: Filter
  ): Promise<Observation | undefined>;

  createObservation(
    input: ObservationInput,
  ): Promise<Observation>;

  ...
}

/**
 * The service implementation
 */
export class ObservationService implements IObservationService {
  private cogniteClient: CogniteClientDependencies;

  constructor(client: CogniteClientDependencies) {
    this.cogniteClient = client;
  }

  public async fetchObservations(filter: Filter) {
    return this.cogniteClient.instances.retrieve(...);
  }

  public async createObservation(input: ObservationInput) {
    return this.cogniteClient.instances.upsert(...);
  }

  ...
}

/**
 * The service factory
 */
export const createObservationService = (
  client: CogniteClientDependencies
): IObservationService => new ObservationService(client);
```

### Domain models

Domain models are represented as hooks.

This is where we would group all the functionality for each domain in our application. Think of it as the internal domain interface on top of the services. For each domain we expose the necessary functionality. This is for example where you would wrap services into cached queries and mutations using `useQuery` and `useMutation`. Note that there isn't a 1:1 mapping between services and domains - a domain (hook) might consume multiple services. Domain models are shared and can be consumed by any view model.

**Naming examples:**

- `useObservationDomain`
- `useChecklistDomain`

**Rules:**

1. A domain model can only be consumed by view models
2. A domain model cannot do any direct networking or use SDKs like CogniteClient - that has to be exposed through a service

**Example:**

```ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useContext, useMemo } from "react";
import { Observation } from "./types";
import { ObservationDomainContext } from "./observation.context";

export const useObservationDomain = (filter: Filter) => {
  // Injected dependencies (services that the domain depends on)
  const { observationService } = useContext(ObservationDomainContext);

  // Query client
  const queryClient = useQueryClient();

  // Queries
  const {
    data: observations = [],
    error: failedToFetchObservationsError,
    isPending: isLoading,
  } = useQuery<Observation[]>({
    queryKey: ["observations"],
    queryFn: () => observationService.fetchObservations(filter),
    retry: false,
  });

  // Mutations
  const {
    mutateAsync: createObservationMutation,
    error: failedToCreateObservationError,
    isPending: isSaving,
  } = useMutation({
    mutationFn: (input: ObservationInput) =>
      observationService.createObservation(observationInput),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["observations"] });
    },
  });

  // Computed values
  const observationCount = useMemo(() => observations.length, [observations]);

  // Commands
  const createObservation = useCallback(
    async (input: ObservationInput) => {
      if (!input) {
        throw new Error("input missing");
      }

      await createObservationMutation(input);
    },
    [createObservationMutation],
  );

  /**
   * The output interface of the domain, which is what the view model(s) will consume
   */
  return {
    observations,
    observationCount,
    failedToFetchObservationsError,
    failedToCreateObservationError,
    isSaving,
    isLoading,
    createObservation,
  };
};
```

### View models

View models are represented as hooks and are owned by their respective view, so it should ideally be a 1:1 between a view model and a corresponding view.

This is where we map domain functionality (data and functions) from one or more domain models into the respective views. We would pick and choose whatever the view needs and do any kind of filtering, sorting, transformation or wrapping to enable the view to consume the domain data and functions as easily as possible.

**Naming examples:**

- `useObservationsListViewModel`
- `useChecklistFormViewModel`

**Rules:**

1. View models are owned by a single view and are not to be shared
2. View models are the only way for a view to be able to consume domain data and function

**Example:**

```ts
import { useContext } from "react";
import { ObservationsListViewModelContext } from "./ObservationsList.viewmodel.context";

/**
 * The main purpose of this file is to
 * bridge the domain logic and the React view
 */

export const useObservationsListViewModel = (filter: Filter) => {
  /**
   * Pull in the domain(s) the view cares about
   */
  const { useObservationDomain } = useContext(ObservationsListViewModelContext);

  /**
   * Initialize the domain using the filter coming from the view
   */
  const observationDomain = useObservationDomain(filter);

  /**
   * Expose the exact data and methods the view depends on,
   * which is only a subset of what the domain provides
   *
   * NOTE: Here is also where we would do additional
   * transformations to facilitate exactly what the view needs
   */
  return {
    observations: observationDomain.observations,
    observationCount: observationDomain.observationCount,
    failedToFetchObservationsError:
      observationDomain.failedToFetchObservationsError,
    isLoading: observationDomain.isLoading,
  };
};
```

**Exceptions**

To enable iterative improvement we allow the following (with sufficient justification); If domain models do not exist for a domain you want to use and you want to defer the creation of those domains, then it is possible to interface with the services directly in a view model, applying `useQuery` and `useMutation` and then later factoring out those parts when the domain model(s) are created. The reason for this is that it might be hard to know how to factor out a domain before there is a sufficient amount of use cases (view models using the domain).

### Views

The purspose of the view is to connect to whatever it needs from the domain(s) through a view model hook. It should not interface with the domain data or functions in any other way.

**Naming examples:**

- ObservationsList
- ChecklistForm

**Rules:**

1. Can only interface with domain data and functions through it's own view model hook.

**Example:**

```tsx
import { useContext } from "react";
import { ObservationItem } from "./components/ObservationItem";
import { ObservationsContext } from "./ObservationsList.context";

// Feature container
export function ObservationsList() {
  // Injected depedencies
  const { useObservationsListViewModel } = useContext(ObservationsListContext);

  // View model
  const {
    observations = [],
    observationCount,
    failedToFetchObservationsError,
    isLoading,
  } = useObservationsListViewModel(filter: 'all');

  if (isLoading) {
    return <div>Loading observations...</div>;
  }

  const observationElements = observations.map((observation) => (
    <ObservationItem
      key={observation.id}
      observation={observation}
    ></ObservationItem>
  ));

  return (
    <div>
      <ul>{observationElements}</ul>
      {failedToFetchObservationsError && (
        <div>
          Failed to fetch observations: {failedToFetchObservationsError.message}
        </div>
      )}
    </div>
  );
}
```
