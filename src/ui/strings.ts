import type { Difficulty, Language, TalkTopic, TriviaTopic } from "@/content/types";
import type { ReportReason } from "./deps";

/** Every piece of UI text. Both languages must fill every key, so a missing one is a type error. */
export type Strings = {
  home: string;
  settings: string;
  modes: string;
  trivia: { name: string; blurb: string };
  puzzles: { name: string; blurb: string };
  talk: { name: string; blurb: string };
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
  report: {
    open: string;
    title: string;
    reason: string;
    reasons: Record<ReportReason, string>;
    note: string;
    charactersLeft: (count: number) => string;
    send: string;
    sending: string;
    cancel: string;
    sent: string;
    failed: string;
    retry: string;
    backToCard: string;
  };
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
  report: {
    open: "Report",
    title: "Report this card",
    reason: "What's wrong?",
    reasons: {
      "wrong-answer": "Wrong answer",
      "bad-translation": "Bad translation",
      confusing: "Confusing",
      inappropriate: "Inappropriate",
      other: "Other",
    },
    note: "Note (optional)",
    charactersLeft: (count) => `${count} characters left`,
    send: "Send",
    sending: "Sending…",
    cancel: "Cancel",
    sent: "Thanks! Report sent.",
    failed: "Couldn't send the report. Check your signal and try again.",
    retry: "Retry",
    backToCard: "Back to the card",
  },
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
  reshuffled: "Ya jugaron todo, arrancamos de nuevo.",
  noCards: (mode) => `Todavía no hay tarjetas de ${mode}.`,
  previousCard: "Tarjeta anterior",
  nextCard: "Tarjeta siguiente",
  next: "Siguiente",
  reveal: "Respuesta",
  showOptions: "Ver opciones",
  options: "Opciones",
  correct: (answer) => `Correcta: ${answer}`,
  choices: "Alternativas",
  followUp: "Más",
  followUps: "Más preguntas",
  report: {
    open: "Reportar",
    title: "Reportar esta tarjeta",
    reason: "¿Qué está mal?",
    reasons: {
      "wrong-answer": "Respuesta incorrecta",
      "bad-translation": "Mala traducción",
      confusing: "Confusa",
      inappropriate: "Inapropiada",
      other: "Otra cosa",
    },
    note: "Nota (opcional)",
    charactersLeft: (count) => `Quedan ${count} caracteres`,
    send: "Enviar",
    sending: "Enviando…",
    cancel: "Cancelar",
    sent: "¡Gracias! Reporte enviado.",
    failed: "No se pudo enviar el reporte. Fijate si tenés señal y probá de nuevo.",
    retry: "Reintentar",
    backToCard: "Volver a la tarjeta",
  },
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
