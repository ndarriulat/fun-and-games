import { inMemoryContentBank, type ContentBank } from "./bank";
import type { TriviaItem, TriviaTopic } from "./types";
import artLiterature from "../../content/trivia/art-literature.json";
import filmTv from "../../content/trivia/film-tv.json";
import foodDrink from "../../content/trivia/food-drink.json";
import football from "../../content/trivia/football.json";
import general from "../../content/trivia/general.json";
import geography from "../../content/trivia/geography.json";
import history from "../../content/trivia/history.json";
import languageWords from "../../content/trivia/language-words.json";
import music from "../../content/trivia/music.json";
import portugal from "../../content/trivia/portugal.json";
import scienceNature from "../../content/trivia/science-nature.json";
import sport from "../../content/trivia/sport.json";
import technology from "../../content/trivia/technology.json";
import uruguay from "../../content/trivia/uruguay.json";

// One import per topic file. The content check verifies the files and that none is missing here.
const triviaFiles: Record<TriviaTopic, unknown[]> = {
  "art-literature": artLiterature,
  "film-tv": filmTv,
  "food-drink": foodDrink,
  football,
  general,
  geography,
  history,
  "language-words": languageWords,
  music,
  portugal,
  "science-nature": scienceNature,
  sport,
  technology,
  uruguay,
};

/** The content bank bundled into the app at build time. */
export const bundledContentBank: ContentBank = inMemoryContentBank({
  trivia: Object.values(triviaFiles).flat() as TriviaItem[],
});
