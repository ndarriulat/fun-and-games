export type Language = "en" | "es";

export type Mode = "trivia" | "puzzles" | "talk";

export const difficulties = ["easy", "medium", "hard"] as const;
export type Difficulty = (typeof difficulties)[number];

/** Trivia topic keys, each with the code used in its item IDs (`trv-<code>-00001`). */
export const triviaTopicCodes = {
  geography: "geo",
  history: "his",
  "science-nature": "sci",
  sport: "spo",
  football: "fbl",
  music: "mus",
  "film-tv": "ftv",
  "food-drink": "fdr",
  "language-words": "lan",
  technology: "tec",
  "art-literature": "art",
  uruguay: "uru",
  portugal: "por",
  general: "gen",
} as const;
export type TriviaTopic = keyof typeof triviaTopicCodes;

export type TriviaText = {
  question: string;
  answer: string;
  /** Exactly three wrong options. */
  options: [string, string, string];
  fact: string;
};

export type TriviaItem = {
  id: string;
  topic: TriviaTopic;
  difficulty: Difficulty;
  en: TriviaText;
  /** Missing while the item is pending translation. */
  es?: TriviaText;
};
