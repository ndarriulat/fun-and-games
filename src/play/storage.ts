import type { Mode } from "@/content/types";
import { allTopics, isTopicVisibility, type TopicChanges } from "./topics";

/** A localStorage-like key/value store. */
export type KeyValueStore = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

const KEY = "vamos";
const VERSION = 1;

/** Everything Vamos remembers on this phone. Later tickets add language, theme and filters. */
export type SavedState = {
  /** IDs of the items played in each mode, keyed by item ID only (not language). */
  played: Record<Mode, string[]>;
  /** Only the player's changes from the default topic visibility. */
  topics: TopicChanges;
};

function defaults(): SavedState {
  return { played: { trivia: [], puzzles: [], talk: [] }, topics: {} };
}

/**
 * The single, versioned front for device storage. Missing, corrupt, outdated or throwing
 * storage falls back to defaults, so the app always works even if nothing is remembered.
 */
export type AppStorage = {
  load(): SavedState;
  save(state: SavedState): void;
  /** Loads, applies a change and saves, so other parts of the saved state are kept. */
  update(change: (state: SavedState) => SavedState): void;
};

export function appStorage(store: KeyValueStore): AppStorage {
  const storage: AppStorage = {
    load() {
      try {
        const raw = store.getItem(KEY);
        return raw === null ? defaults() : parse(JSON.parse(raw));
      } catch {
        return defaults();
      }
    },
    save(state) {
      try {
        store.setItem(KEY, JSON.stringify({ version: VERSION, ...state }));
      } catch {
        // Storage unavailable or full: carry on without saving.
      }
    },
    update(change) {
      storage.save(change(storage.load()));
    },
  };
  return storage;
}

/** Keeps whatever parts of the saved data are valid; anything else gets its default. */
function parse(data: unknown): SavedState {
  const state = defaults();
  if (!isRecord(data) || data.version !== VERSION) return state;
  if (isRecord(data.played)) {
    for (const mode of Object.keys(state.played) as Mode[]) {
      const ids = data.played[mode];
      if (Array.isArray(ids)) state.played[mode] = ids.filter((id): id is string => typeof id === "string");
    }
  }
  if (isRecord(data.topics)) {
    for (const topic of allTopics) {
      const change = data.topics[topic];
      if (isTopicVisibility(change)) state.topics[topic] = change;
    }
  }
  return state;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
