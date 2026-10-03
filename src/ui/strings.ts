import type { Difficulty, Language, TalkTopic, TriviaTopic } from "@/content/types";

/** Every piece of UI text. Both languages must fill every key, so a missing one is a type error. */
export type Strings = {
  home: string;
  settings: string;
  modes: string;
  trivia: { name: string; blurb: string };
  puzzles: { name: string; blurb: string };
  talk: { name: string; blurb: string };
  allTopics: string;
  reshuffled: string;
  noCards: (mode: string) => string;
  previousCard: string;
  nextCard: string;
  next: string;
  reveal: string;
  showOptions: string;
  options: string;
  correct: (answer: string) => string;
  choices: string;
  followUp: string;
  followUps: string;
  language: string;
  languageNames: Record<Language, string>;
  difficulties: Record<Difficulty, string>;
  triviaTopics: Record<TriviaTopic, string>;
  talkTopics: Record<TalkTopic, string>;
};

/** Each language's name in its own language, so either can be found whatever the app is in. */
const languageNames: Record<Language, string> = { en: "English", es: "Español" };

const en: Strings = {
  home: "Home",
  settings: "Settings",
  modes: "Modes",
  trivia: { name: "Trivia", blurb: "Guess the answer, then reveal" },
  puzzles: { name: "Puzzles", blurb: "Coming soon" },
  talk: { name: "Talk", blurb: "Questions to get everyone talking" },
  allTopics: "all topics",
  reshuffled: "You've played everything, starting again.",
  noCards: (mode) => `No ${mode} cards yet.`,
  previousCard: "Previous card",
  nextCard: "Next card",
  next: "Next",
  reveal: "Reveal",
  showOptions: "Show options",
  options: "Options",
  correct: (answer) => `Correct: ${answer}`,
  choices: "Choices",
  followUp: "Follow-up",
  followUps: "Follow-ups",
  language: "Language",
  languageNames,
  difficulties: { easy: "Easy", medium: "Medium", hard: "Hard" },
  triviaTopics: {
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
  },
  talkTopics: {
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
  },
};

/** Uruguayan Spanish: voseo and local vocabulary. */
const es: Strings = {
  home: "Inicio",
  settings: "Configuración",
  modes: "Modos",
  trivia: { name: "Trivia", blurb: "Adiviná la respuesta y después mirala" },
  puzzles: { name: "Acertijos", blurb: "Próximamente" },
  talk: { name: "Charla", blurb: "Preguntas para que charlen todos" },
  allTopics: "todos los temas",
  reshuffled: "Ya jugaron todo, arrancamos de nuevo.",
  noCards: (mode) => `Todavía no hay tarjetas de ${mode}.`,
  previousCard: "Tarjeta anterior",
  nextCard: "Tarjeta siguiente",
  next: "Siguiente",
  reveal: "Revelar",
  showOptions: "Ver opciones",
  options: "Opciones",
  correct: (answer) => `Correcta: ${answer}`,
  choices: "Alternativas",
  followUp: "Otra pregunta",
  followUps: "Más preguntas",
  language: "Idioma",
  languageNames,
  difficulties: { easy: "Fácil", medium: "Media", hard: "Difícil" },
  triviaTopics: {
    geography: "Geografía",
    history: "Historia",
    "science-nature": "Ciencia y naturaleza",
    sport: "Deporte",
    football: "Fútbol",
    music: "Música",
    "film-tv": "Cine y tele",
    "food-drink": "Comida y bebida",
    "language-words": "Lengua y palabras",
    technology: "Tecnología",
    "art-literature": "Arte y literatura",
    uruguay: "Uruguay 🇺🇾",
    portugal: "Portugal 🇵🇹",
    general: "Cultura general",
  },
  talkTopics: {
    hypotheticals: "Qué pasaría si",
    "life-philosophy": "Vida y filosofía",
    "society-ethics": "Sociedad y ética",
    "future-technology": "Futuro y tecnología",
    "travel-places": "Viajes y lugares",
    food: "Comida",
    "friendship-relationships": "Amistad y relaciones",
    "work-money": "Trabajo y plata",
    "childhood-memories": "Infancia y recuerdos",
    "pop-culture": "Cultura pop",
    uruguay: "Uruguay 🇺🇾",
    portugal: "Portugal 🇵🇹",
  },
};

export const strings: Record<Language, Strings> = { en, es };

/**
 * The first-launch suggestion on a Spanish phone. Deliberately in both languages at once:
 * asked in Spanish, with the way out in English, the language the app is still in.
 */
export const spanishSuggestion = {
  title: "¿Jugamos en español?",
  accept: "Sí, en español",
  decline: "Keep English",
};
