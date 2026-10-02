import { inMemoryContentBank } from "@/content/bank";
import type { TriviaItem } from "@/content/types";
import type { AppDeps, KeyValueStore, Report, ReportSender } from "@/ui/deps";

export function inMemoryStorage(seed: Record<string, string> = {}): KeyValueStore & { data: Map<string, string> } {
  const data = new Map(Object.entries(seed));
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
  };
}

/** Always returns the same value. 0 picks the first candidate, 0.999 the last. */
export function fixedRandom(value = 0): () => number {
  return () => value;
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
