import { useRef } from 'react';

export function useStableEnvelope<T extends Record<string, unknown>>(value: T): T {
  const ref = useRef<T | null>(null);

  if (ref.current === null) {
    ref.current = { ...value };
  } else {
    Object.assign(ref.current, value);
  }

  return ref.current;
}