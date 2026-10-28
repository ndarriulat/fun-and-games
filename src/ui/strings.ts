import type { Difficulty, Language, TalkTopic, TriviaTopic } from "@/content/types";
import type { ReportReason } from "./deps";

/** Halloween 2026: the games in the Halloween menu. */
export type HalloweenGame = "talk" | "trivia" | "taboo" | "categories";

/** Every piece of UI text. Both languages must fill every key, so a missing one is a type error. */
export type Strings = {
  home: string;
  settings: string;
  modes: string;
  trivia: { name: string; blurb: string };
  puzzles: { name: string; blurb: string };
  talk: { name: string; blurb: string };
  // Halloween 2026
  halloween: {
    name: string;
    blurb: string;
    ribbon: string;
    menu: string;
    /** Each game's card in the Halloween menu, and its title once playing. */
    games: Record<HalloweenGame, { name: string; blurb: string; title: string }>;
    pause: string;
    resume: string;
    paused: (seconds: number) => string;
    secondsLeft: (seconds: number) => string;
    menuBack: string;
    sounds: string;
    newGame: string;
    continueGame: string;
    endGame: string;
    keepPlaying: string;
    endGameTitle: string;
    endGameBody: string;
    newGameTitle: string;
    newGameBody: string;
    taboo: {
      rules: string;
      newGame: string;
      continueGame: (turn: number, scores: string) => string;
      team: (team: number) => string;
      turnOf: (team: number, turn: number, turns: number) => string;
      passPhone: (team: number, other: number) => string;
      startTurn: string;
      dontSay: string;
      correct: string;
      buzz: string;
      skip: (left: number) => string;
      timeUp: string;
      turnScore: (team: number, points: number) => string;
      nextTurn: (team: number) => string;
      wins: (team: number) => string;
      tie: string;
      playAgain: string;
      score: string;
    };
    categories: {
      whoIsPlaying: string;
      back: string;
      playerName: (n: number) => string;
      addPlayer: string;
      removePlayer: (name: string) => string;
      needTwo: string;
      startGame: string;
      scores: string;
      whoBid: string;
      startDuel: (bid: number) => string;
      duelNow: (names: string, bid: number) => string;
      duelWho: (bid: number) => string;
      nobodyReached: string;
      bidderWon: (name: string) => string;
      othersWon: (name: string) => string;
      whoWon: string;
      givePoints: string;
      noWinner: string;
      skip: string;
      skipTitle: string;
      skipBody: string;
      skipConfirm: string;
      winners: (names: string) => string;
      finalScores: string;
      rules: string;
      bid: string;
      write: string;
      another: string;
      bidHelp: string;
      topBid: string;
      lower: string;
      higher: string;
      startBid: (bid: number) => string;
      nameThem: (bid: number) => string;
      named: (named: number, bid: number) => string;
      gotOne: string;
      undo: string;
      writeNow: string;
      made: (bid: number) => string;
      missed: (named: number, bid: number) => string;
      pensDown: string;
      compare: string;
      nextCategory: string;
    };
  };
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
  // Halloween 2026
  halloween: {
    name: "Halloween",
    blurb: "Spooky games for the group",
    ribbon: "Special edition",
    menu: "Halloween games",
    games: {
      talk: { name: "Talk", blurb: "Spooky and creepy questions", title: "Halloween Talk" },
      trivia: { name: "Trivia", blurb: "How much do you know?", title: "Halloween Trivia" },
      taboo: { name: "Taboo", blurb: "Two teams, forbidden words", title: "Halloween Taboo" },
      categories: { name: "Categories", blurb: "Bid or write, beat the clock", title: "Halloween Categories" },
    },
    pause: "Pause",
    resume: "Resume",
    paused: (seconds) => `Paused with ${seconds} seconds left.`,
    secondsLeft: (seconds) => `${seconds} seconds left`,
    menuBack: "Halloween games",
    sounds: "Spooky sounds",
    newGame: "New game",
    continueGame: "Continue game",
    endGame: "End game",
    keepPlaying: "Keep playing",
    endGameTitle: "End this game?",
    endGameBody: "The game and its scores will be lost. This can't be undone.",
    newGameTitle: "Start a new game?",
    newGameBody: "The game you were playing and its scores will be lost. This can't be undone.",
    taboo: {
      rules:
        "Two teams. On your turn, one player describes the word without saying it or any of the forbidden words. Each team plays 2 turns of 60 seconds.",
      newGame: "New game",
      continueGame: (turn, scores) => `Continue game (turn ${turn} of 4, ${scores})`,
      team: (team) => `Team ${team}`,
      turnOf: (team, turn, turns) => `Team ${team} · turn ${turn} of ${turns}`,
      passPhone: (team, other) =>
        `Pass the phone to Team ${team}'s clue-giver. Someone from Team ${other} watches the screen for forbidden words.`,
      startTurn: "Start turn",
      dontSay: "Don't say",
      correct: "Correct",
      buzz: "Said it!",
      skip: (left) => `Skip (${left})`,
      timeUp: "Time's up!",
      turnScore: (team, points) => `Team ${team} scored ${points} this turn.`,
      nextTurn: (team) => `Next: Team ${team}`,
      wins: (team) => `Team ${team} wins!`,
      tie: "It's a tie!",
      playAgain: "Play again",
      score: "Score",
    },
    categories: {
      whoIsPlaying: "Who's playing?",
      back: "Back",
      playerName: (n) => `Player ${n}`,
      addPlayer: "Add a player",
      removePlayer: (name) => `Remove ${name}`,
      needTwo: "Add at least two names to start.",
      startGame: "Start game",
      scores: "Scores",
      whoBid: "Who has the top bid? Tap everyone tied on it.",
      startDuel: (bid) => `Duel: write ${bid} in 60 seconds`,
      duelNow: (names, bid) => `${names}: write ${bid} each. Go!`,
      duelWho: (bid) => `Read the lists out. Who reached ${bid}? Tap everyone who did.`,
      nobodyReached: "Nobody made it",
      bidderWon: (name) => `${name} gets a point.`,
      othersWon: (name) => `Everyone except ${name} gets a point.`,
      whoWon: "Who had the longest list? Tap everyone who tied.",
      givePoints: "Give the points",
      noWinner: "Nobody, next category",
      skip: "Skip",
      skipTitle: "Skip this category?",
      skipBody: "The timer stops and nobody gets points for it.",
      skipConfirm: "Skip it",
      winners: (names) => `${names} won!`,
      finalScores: "Final scores",
      rules: "Name as many as you can. Bid out loud for it, or have everyone write a list.",
      bid: "Bid for it",
      write: "Everyone writes",
      another: "Another category",
      bidHelp:
        "Go round raising the bid: \"I can name 5\", \"7!\". Each bid must beat the last. When nobody goes higher, the top bidder has 60 seconds.",
      topBid: "Top bid",
      lower: "Lower bid",
      higher: "Higher bid",
      startBid: (bid) => `Name ${bid} in 60 seconds`,
      nameThem: (bid) => `Name ${bid}!`,
      named: (named, bid) => `${named} of ${bid}`,
      gotOne: "Got one",
      undo: "Undo",
      writeNow: "Everyone write as many as you can, on paper or in your notes.",
      made: (bid) => `Made it! All ${bid} named.`,
      missed: (named, bid) => `Out of time: ${named} of ${bid}.`,
      pensDown: "Pens down!",
      compare: "Read your lists out loud. The longest list of right answers wins the round. A tie? They all win it.",
      nextCategory: "Next category",
    },
  },
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
    halloween: "Halloween 🎃", // Halloween 2026
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
    halloween: "Halloween 🎃", // Halloween 2026
    "halloween-portugal": "Halloween in Portugal 🇵🇹", // Halloween 2026
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
  // Halloween 2026
  halloween: {
    name: "Halloween",
    blurb: "Juegos de miedo para el grupo",
    ribbon: "Edición especial",
    menu: "Juegos de Halloween",
    games: {
      talk: { name: "Charla", blurb: "Preguntas de miedo y escalofriantes", title: "Charla de Halloween" },
      trivia: { name: "Trivia", blurb: "¿Cuánto sabés?", title: "Trivia de Halloween" },
      taboo: { name: "Tabú", blurb: "Dos equipos, palabras prohibidas", title: "Tabú de Halloween" },
      categories: { name: "Categorías", blurb: "Apostá o escribí, contra reloj", title: "Categorías de Halloween" },
    },
    pause: "Pausa",
    resume: "Seguir",
    paused: (seconds) => `En pausa, quedan ${seconds} segundos.`,
    secondsLeft: (seconds) => `Quedan ${seconds} segundos`,
    menuBack: "Juegos de Halloween",
    sounds: "Sonidos de miedo",
    newGame: "Juego nuevo",
    continueGame: "Seguir el juego",
    endGame: "Terminar el juego",
    keepPlaying: "Seguir jugando",
    endGameTitle: "¿Terminar este juego?",
    endGameBody: "Se pierden el juego y los puntos. No se puede deshacer.",
    newGameTitle: "¿Empezar un juego nuevo?",
    newGameBody: "Se pierden el juego que estaban jugando y los puntos. No se puede deshacer.",
    taboo: {
      rules:
        "Dos equipos. En tu turno, alguien describe la palabra sin decirla ni decir ninguna de las prohibidas. Cada equipo juega 2 turnos de 60 segundos.",
      newGame: "Juego nuevo",
      continueGame: (turn, scores) => `Seguir el juego (turno ${turn} de 4, ${scores})`,
      team: (team) => `Equipo ${team}`,
      turnOf: (team, turn, turns) => `Equipo ${team} · turno ${turn} de ${turns}`,
      passPhone: (team, other) =>
        `Pasale el celular a quien da las pistas del Equipo ${team}. Alguien del Equipo ${other} mira la pantalla por si dice una palabra prohibida.`,
      startTurn: "Empezar turno",
      dontSay: "No digas",
      correct: "Bien",
      buzz: "¡La dijo!",
      skip: (left) => `Pasar (${left})`,
      timeUp: "¡Se acabó el tiempo!",
      turnScore: (team, points) => `El Equipo ${team} hizo ${points} en este turno.`,
      nextTurn: (team) => `Sigue: Equipo ${team}`,
      wins: (team) => `¡Gana el Equipo ${team}!`,
      tie: "¡Empate!",
      playAgain: "Jugar de nuevo",
      score: "Puntos",
    },
    categories: {
      whoIsPlaying: "¿Quiénes juegan?",
      back: "Volver",
      playerName: (n) => `Jugador ${n}`,
      addPlayer: "Agregar a alguien",
      removePlayer: (name) => `Sacar a ${name}`,
      needTwo: "Agregá al menos dos nombres para empezar.",
      startGame: "Empezar el juego",
      scores: "Puntos",
      whoBid: "¿Quién hizo la apuesta más alta? Marcá a todos los que empataron.",
      startDuel: (bid) => `Duelo: escribir ${bid} en 60 segundos`,
      duelNow: (names, bid) => `${names}: escriban ${bid} cada uno. ¡Ya!`,
      duelWho: (bid) => `Lean las listas. ¿Quién llegó a ${bid}? Marcá a todos los que llegaron.`,
      nobodyReached: "Nadie llegó",
      bidderWon: (name) => `${name} se lleva un punto.`,
      othersWon: (name) => `Todos menos ${name} se llevan un punto.`,
      whoWon: "¿Quién hizo la lista más larga? Marcá a todos los que empataron.",
      givePoints: "Dar los puntos",
      noWinner: "Nadie, siguiente categoría",
      skip: "Pasar",
      skipTitle: "¿Pasar esta categoría?",
      skipBody: "Se para el reloj y nadie se lleva puntos.",
      skipConfirm: "Pasarla",
      winners: (names) => `¡Ganó ${names}!`,
      finalScores: "Puntos finales",
      rules: "Nombrá todos los que puedas. Apuesten en voz alta o que todos escriban una lista.",
      bid: "Apostar",
      write: "Todos escriben",
      another: "Otra categoría",
      bidHelp:
        "Vayan subiendo la apuesta: \"Puedo nombrar 5\", \"¡7!\". Cada apuesta tiene que superar la anterior. Cuando nadie sube más, quien apostó más tiene 60 segundos.",
      topBid: "Apuesta más alta",
      lower: "Bajar apuesta",
      higher: "Subir apuesta",
      startBid: (bid) => `Nombrar ${bid} en 60 segundos`,
      nameThem: (bid) => `¡Nombrá ${bid}!`,
      named: (named, bid) => `${named} de ${bid}`,
      gotOne: "Uno más",
      undo: "Deshacer",
      writeNow: "Todos escriban todos los que puedan, en papel o en las notas del celular.",
      made: (bid) => `¡Lo logró! Nombró los ${bid}.`,
      missed: (named, bid) => `Se acabó el tiempo: ${named} de ${bid}.`,
      pensDown: "¡Lápices abajo!",
      compare: "Lean sus listas en voz alta. Gana la ronda la lista más larga de respuestas correctas. ¿Empate? Ganan todos los empatados.",
      nextCategory: "Siguiente categoría",
    },
  },
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
    halloween: "Halloween 🎃", // Halloween 2026
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
    halloween: "Halloween 🎃", // Halloween 2026
    "halloween-portugal": "Halloween en Portugal 🇵🇹", // Halloween 2026
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
