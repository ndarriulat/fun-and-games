import { inMemoryContentBank, type ContentBank } from "./bank";
import type { TalkItem, TalkTopic, TriviaItem, TriviaTopic } from "./types";
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
import talkChildhoodMemories from "../../content/talk/childhood-memories.json";
import talkFood from "../../content/talk/food.json";
import talkHalloween from "../../content/talk/halloween.json"; // Halloween 2026
import talkHalloweenPortugal from "../../content/talk/halloween-portugal.json"; // Halloween 2026
import talkFriendshipRelationships from "../../content/talk/friendship-relationships.json";
import talkFutureTechnology from "../../content/talk/future-technology.json";
import talkHypotheticals from "../../content/talk/hypotheticals.json";
import talkLifePhilosophy from "../../content/talk/life-philosophy.json";
import talkPopCulture from "../../content/talk/pop-culture.json";
import talkPortugal from "../../content/talk/portugal.json";
import talkSocietyEthics from "../../content/talk/society-ethics.json";
import talkTravelPlaces from "../../content/talk/travel-places.json";
import talkUruguay from "../../content/talk/uruguay.json";
import talkWorkMoney from "../../content/talk/work-money.json";

// One import per topic file, per mode. The content check verifies the files and that none is missing here.
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

const talkFiles: Record<TalkTopic, unknown[]> = {
  "childhood-memories": talkChildhoodMemories,
  food: talkFood,
  "friendship-relationships": talkFriendshipRelationships,
  "future-technology": talkFutureTechnology,
  hypotheticals: talkHypotheticals,
  "life-philosophy": talkLifePhilosophy,
  "pop-culture": talkPopCulture,
  portugal: talkPortugal,
  "society-ethics": talkSocietyEthics,
  "travel-places": talkTravelPlaces,
  uruguay: talkUruguay,
  "work-money": talkWorkMoney,
  halloween: talkHalloween, // Halloween 2026
  "halloween-portugal": talkHalloweenPortugal, // Halloween 2026
};

/** The content bank bundled into the app at build time. */
export const bundledContentBank: ContentBank = inMemoryContentBank({
  trivia: Object.values(triviaFiles).flat() as TriviaItem[],
  talk: Object.values(talkFiles).flat() as TalkItem[],
});
