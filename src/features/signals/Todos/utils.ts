import * as uuid from "uuid";

export async function sleep(timeInMs: number) {
  return new Promise((resolve) => setTimeout(resolve, timeInMs));
}

export function generateId() {
  return uuid.v4();
}

export function noop() {}
