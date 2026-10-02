import type { Language, TriviaItem } from "@/content/types";

/** The items that can be dealt in a language: pending translations are left out of Spanish play. */
export function triviaPool(items: readonly TriviaItem[], language: Language): TriviaItem[] {
  return items.filter((item) => item[language] !== undefined);
}

/** Picks a random item, avoiding the one just shown when there's another choice. */
export function pickNext<T>(pool: readonly T[], current: T | undefined, random: () => number): T | undefined {
  const candidates = pool.length > 1 ? pool.filter((item) => item !== current) : pool;
  return candidates[Math.floor(random() * candidates.length)];
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
