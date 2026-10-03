export const languages = ["en", "es"] as const;
export type Language = (typeof languages)[number];

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

/** Talk topic keys, each with the code used in its item IDs (`tlk-<code>-00001`). */
export const talkTopicCodes = {
  hypotheticals: "hyp",
  "life-philosophy": "lif",
  "society-ethics": "soc",
  "future-technology": "fut",
  "travel-places": "tra",
  food: "fod",
  "friendship-relationships": "fri",
  "work-money": "wrk",
  "childhood-memories": "chi",
  "pop-culture": "pop",
  uruguay: "uru",
  portugal: "por",
} as const;
export type TalkTopic = keyof typeof talkTopicCodes;

export const talkTypes = ["question", "would-you-rather"] as const;
export type TalkType = (typeof talkTypes)[number];

export const intensities = ["light", "deep"] as const;
export type Intensity = (typeof intensities)[number];

export type TalkText = {
  question: string;
  /** One or two follow-up questions, revealed in order. */
  followUps: [string] | [string, string];
  /** Would-you-rather cards only: the two choices. */
  optionA?: string;
  optionB?: string;
};

export type TalkItem = {
  id: string;
  topic: TalkTopic;
  type: TalkType;
  intensity: Intensity;
  en: TalkText;
  /** Missing while the item is pending translation. */
  es?: TalkText;
};
