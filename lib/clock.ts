/**
 * A single one-second tick shared by every countdown consumer.
 *
 * Exposed as an external store so components can read it with
 * `useSyncExternalStore`: the snapshot only changes when the interval fires,
 * which keeps render-time reads stable and hydration free of mismatches.
 */
let currentTick = 0;
let timer: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();

export function subscribeToClock(onTick: () => void): () => void {
  listeners.add(onTick);

  if (timer === undefined) {
    currentTick = Date.now();
    timer = setInterval(() => {
      currentTick = Date.now();
      for (const listener of listeners) listener();
    }, 1000);
  }

  return () => {
    listeners.delete(onTick);
    if (listeners.size === 0 && timer !== undefined) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

/** Milliseconds at the last tick, or 0 before the clock has been subscribed. */
export function readClock(): number {
  return currentTick;
}

/** The server has no clock: countdown values are client-only. */
export function readServerClock(): number {
  return 0;
}
