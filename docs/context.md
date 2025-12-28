# Context

- Two types
  - Unit context
    - Owned by the unit, not shared with anything else
    - Consumed using `useContext` by the unit
  - Shared context
    - Owned by the domain hook that exposes the context to consumers
    - Consumed using `useContext` by the that domain hook
    - Consumed using the domain hook by any other consumer

Separating the mechanism from the intended use
