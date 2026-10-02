import type { TriviaItem } from "./types";

/**
 * Where the app gets its items. Async so content can later be loaded lazily
 * per mode and language without changing callers.
 */
export type ContentBank = {
  trivia(): Promise<readonly TriviaItem[]>;
};

export function inMemoryContentBank(items: { trivia: readonly TriviaItem[] }): ContentBank {
  return {
    trivia: () => Promise.resolve(items.trivia),
  };
}
