import type { Difficulty, TriviaTopic } from "@/content/types";

export const triviaTopicLabels: Record<TriviaTopic, string> = {
  geography: "Geography",
  history: "History",
  "science-nature": "Science & Nature",
  sport: "Sport",
  football: "Football",
  music: "Music",
  "film-tv": "Film & TV",
  "food-drink": "Food & Drink",
  "language-words": "Language & Words",
  technology: "Technology",
  "art-literature": "Art & Literature",
  uruguay: "Uruguay 🇺🇾",
  portugal: "Portugal 🇵🇹",
  general: "General",
};

export const difficultyLabels: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};
