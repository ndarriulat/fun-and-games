import { inMemoryContentBank } from "@/content/bank";
import type { Mode, TriviaItem } from "@/content/types";
import type { KeyValueStore } from "@/play/storage";
import type { AppDeps, Report, ReportSender } from "@/ui/deps";

export function inMemoryStorage(seed: Record<string, string> = {}): KeyValueStore & { data: Map<string, string> } {
  const data = new Map(Object.entries(seed));
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
  };
}

/** Storage holding something unreadable under every key, as left by a bug or an old version. */
export function corruptStorage(value: string): KeyValueStore & { data: Map<string, string> } {
  const storage = inMemoryStorage();
  return { ...storage, getItem: (key) => storage.data.get(key) ?? value };
}

/** Storage that throws on every call, as in some private browsing modes. */
export function throwingStorage(): KeyValueStore {
  return {
    getItem: () => {
      throw new Error("Storage unavailable");
    },
    setItem: () => {
      throw new Error("Storage unavailable");
    },
  };
}

/** Always returns the same value. 0 picks the first candidate, 0.999 the last. */
export function fixedRandom(value = 0): () => number {
  return () => value;
}

/** Returns the values in order, then keeps returning the last one. */
export function sequenceRandom(...values: number[]): () => number {
  let i = 0;
  return () => values[Math.min(i++, values.length - 1)];
}

export function recordingReportSender(): ReportSender & { sent: Report[]; failNext: boolean } {
  const sender = {
    sent: [] as Report[],
    failNext: false,
    async send(report: Report) {
      if (sender.failNext) {
        sender.failNext = false;
        throw new Error("Report failed");
      }
      sender.sent.push(report);
    },
  };
  return sender;
}

/** Storage as left by a returning player: what they've played and their changes to topic visibility. */
export function savedStorage({
  played = {},
  topics,
}: {
  played?: Partial<Record<Mode, string[]>>;
  topics?: unknown;
}): KeyValueStore & { data: Map<string, string> } {
  const state = { version: 1, played: { trivia: [], puzzles: [], talk: [], ...played }, topics };
  return inMemoryStorage({ vamos: JSON.stringify(state) });
}

/** Everything Vamos has saved, parsed. */
export function storedState(storage: { data: Map<string, string> }): Record<string, unknown> {
  return JSON.parse(storage.data.get("vamos") ?? "null");
}

/** Changes the saved topic visibility, as the Settings toggles will (ticket 09). */
export function setStoredTopics(storage: { data: Map<string, string> }, topics: unknown) {
  storage.data.set("vamos", JSON.stringify({ ...storedState(storage), topics }));
}

export function testDeps(
  overrides: Partial<Omit<AppDeps, "content">> & { trivia?: readonly TriviaItem[] } = {},
): AppDeps {
  const { trivia = triviaFixtures, ...rest } = overrides;
  return {
    content: inMemoryContentBank({ trivia }),
    storage: inMemoryStorage(),
    random: fixedRandom(0),
    reports: recordingReportSender(),
    browserLanguage: () => "en-GB",
    ...rest,
  };
}

export const triviaFixtures: TriviaItem[] = [
  {
    id: "trv-geo-90001",
    topic: "geography",
    difficulty: "easy",
    en: {
      question: "What is the capital of Australia?",
      answer: "Canberra",
      options: ["Sydney", "Melbourne", "Perth"],
      fact: "Canberra was purpose-built as a compromise between Sydney and Melbourne.",
    },
    es: {
      question: "¿Cuál es la capital de Australia?",
      answer: "Canberra",
      options: ["Sídney", "Melbourne", "Perth"],
      fact: "Canberra se construyó a propósito como punto medio entre Sídney y Melbourne.",
    },
  },
  {
    id: "trv-sci-90001",
    topic: "science-nature",
    difficulty: "hard",
    en: {
      question: "Which metal makes octopus blood blue?",
      answer: "Copper",
      options: ["Iron", "Zinc", "Cobalt"],
      fact: "Octopus blood carries oxygen with haemocyanin, a copper-based protein.",
    },
    es: {
      question: "¿Qué metal hace que la sangre del pulpo sea azul?",
      answer: "Cobre",
      options: ["Hierro", "Zinc", "Cobalto"],
      fact: "La sangre del pulpo lleva el oxígeno con hemocianina, una proteína a base de cobre.",
    },
  },
  {
    id: "trv-por-90001",
    topic: "portugal",
    difficulty: "medium",
    en: {
      question: "What is the name of Lisbon's famous yellow tram route through Alfama?",
      answer: "Tram 28",
      options: ["Tram 15", "Tram 12", "Tram 1"],
      fact: "Tram 28 still runs the old Remodelado cars, built in the 1930s.",
    },
  },
  // Hidden by default, so with no saved changes it's never dealt.
  {
    id: "trv-uru-90001",
    topic: "uruguay",
    difficulty: "medium",
    en: {
      question: "In what year did Uruguay host and win the first FIFA World Cup?",
      answer: "1930",
      options: ["1950", "1924", "1934"],
      fact: "The final was played at the Estadio Centenario in Montevideo.",
    },
  },
];

/** Trivia items "Question 1?" … "Question n?", dealt in that order by fixedRandom(0). */
export function numberedTrivia(count: number): TriviaItem[] {
  return Array.from({ length: count }, (_, i) => ({
    ...triviaFixtures[0],
    id: `trv-gen-${90001 + i}`,
    topic: "general" as const,
    en: { ...triviaFixtures[0].en, question: `Question ${i + 1}?` },
  }));
}
