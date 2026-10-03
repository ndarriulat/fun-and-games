import type { Language } from "@/content/types";
import { isTopicHidden, type Topic, type TopicChanges } from "./topics";

/**
 * The items that can be dealt: hidden topics are left out, and so are pending translations
 * when playing in Spanish.
 */
export function playablePool<T extends { topic: Topic; en: unknown; es?: unknown }>(
  items: readonly T[],
  language: Language,
  topicChanges: TopicChanges,
): T[] {
  return items.filter((item) => item[language] !== undefined && !isTopicHidden(item.topic, topicChanges));
}

export type Dealt<T> = {
  item: T;
  /** The mode's played history after this deal, including the dealt item. */
  played: string[];
  /** True when every item in the pool had been played, so the pool's history was cleared first. */
  reshuffled: boolean;
};

/**
 * Deals a random unplayed item from the pool. When none are left, clears the history for this
 * pool's items only and deals again, avoiding the card just shown when there's another choice.
 */
export function deal<T extends { id: string }>(
  pool: readonly T[],
  played: readonly string[],
  currentId: string | undefined,
  random: () => number,
): Dealt<T> | undefined {
  if (pool.length === 0) return undefined;
  const playedIds = new Set(played);
  const unplayed = pool.filter((item) => !playedIds.has(item.id));
  const reshuffled = unplayed.length === 0;

  let candidates = unplayed;
  let history = [...played];
  if (reshuffled) {
    const poolIds = new Set(pool.map((item) => item.id));
    history = played.filter((id) => !poolIds.has(id));
    candidates = pool.length > 1 ? pool.filter((item) => item.id !== currentId) : [...pool];
  }

  const item = candidates[Math.floor(random() * candidates.length)];
  return { item, played: [...history, item.id], reshuffled };
}

/** Fisher–Yates shuffle into a new array. */
export function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
