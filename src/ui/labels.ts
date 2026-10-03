import type { Difficulty, TalkTopic, TriviaTopic } from "@/content/types";

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

export const talkTopicLabels: Record<TalkTopic, string> = {
  hypotheticals: "Hypotheticals",
  "life-philosophy": "Life & Philosophy",
  "society-ethics": "Society & Ethics",
  "future-technology": "Future & Technology",
  "travel-places": "Travel & Places",
  food: "Food",
  "friendship-relationships": "Friendship & Relationships",
  "work-money": "Work & Money",
  "childhood-memories": "Childhood & Memories",
  "pop-culture": "Pop Culture",
  uruguay: "Uruguay 🇺🇾",
  portugal: "Portugal 🇵🇹",
};
