import type { TalkItem, TriviaItem } from "./types";

/**
 * Where the app gets its items. Async so content can later be loaded lazily
 * per mode and language without changing callers.
 */
export type ContentBank = {
  trivia(): Promise<readonly TriviaItem[]>;
  talk(): Promise<readonly TalkItem[]>;
};

export function inMemoryContentBank(items: { trivia: readonly TriviaItem[]; talk: readonly TalkItem[] }): ContentBank {
  return {
    trivia: () => Promise.resolve(items.trivia),
    talk: () => Promise.resolve(items.talk),
  };
}
