// Halloween 2026: remove in ticket 03, with everything marked "Halloween 2026".
import type { KeyValueStore } from "./storage";

/**
 * A Halloween game's saved state, under its own key so it can be deleted with the games. Like the
 * main storage, it never throws: missing, corrupt or unavailable storage just means nothing to resume.
 */
export type GameSave<T> = {
  load(): T | null;
  save(state: T | null): void;
};

export function gameSave<T>(store: KeyValueStore, name: string, isValid: (value: unknown) => value is T): GameSave<T> {
  const key = `vamos-halloween-${name}`;
  return {
    load() {
      try {
        const raw = store.getItem(key);
        if (raw === null) return null;
        const value: unknown = JSON.parse(raw);
        return isValid(value) ? value : null;
      } catch {
        return null;
      }
    },
    save(state) {
      try {
        store.setItem(key, JSON.stringify(state));
      } catch {
        // Storage unavailable or full: the game carries on, it just won't survive a refresh.
      }
    },
  };
}

/** A shuffled list of the indexes 0 to length - 1. */
export function shuffledIndexes(length: number, random: () => number): number[] {
  const order = Array.from({ length }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}
