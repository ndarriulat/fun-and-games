"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ContentBank } from "@/content/bank";
import type { Language, Mode } from "@/content/types";
import type { KeyValueStore } from "@/play/storage";
import type { SpookySounds } from "./spookySounds";

export const reportReasons = ["wrong-answer", "bad-translation", "confusing", "inappropriate", "other"] as const;

export type ReportReason = (typeof reportReasons)[number];

/** The longest note a report can carry. */
export const REPORT_NOTE_LIMIT = 280;

/** The card being reported. */
export type ReportedCard = {
  itemId: string;
  mode: Mode;
  /** The language the card was shown in, which isn't always the app's (a card pending translation stays in English). */
  language: Language;
  /** The card's text as it was on screen, in the language it was shown in. */
  text: string;
  /** What had been revealed on it, e.g. "options shown, answer revealed". */
  revealed: string;
};

export type Report = ReportedCard & {
  reason: ReportReason;
  note?: string;
  appVersion: string;
  /** The app's language, which can differ from the card's. */
  appLanguage: Language;
  /** Topics hidden in Settings, or "none". */
  hiddenTopics: string;
  /** A random ID kept on this phone, to group reports from the same person without knowing who they are. */
  deviceId: string;
  /** When it was sent, as an ISO 8601 string. */
  timestamp: string;
};

export type ReportSender = {
  send(report: Report): Promise<void>;
};

/** Everything the app takes from outside. Production and tests each wire their own. */
export type AppDeps = {
  content: ContentBank;
  storage: KeyValueStore;
  /** Returns a number in [0, 1), like Math.random. */
  random: () => number;
  reports: ReportSender;
  browserLanguage: () => string;
  /** Halloween 2026: the spooky sounds in Halloween Talk and Trivia. */
  spookySounds: SpookySounds;
};

const DepsContext = createContext<AppDeps | null>(null);

export function DepsProvider({ deps, children }: { deps: AppDeps; children: ReactNode }) {
  return <DepsContext.Provider value={deps}>{children}</DepsContext.Provider>;
}

export function useDeps(): AppDeps {
  const deps = useContext(DepsContext);
  if (!deps) throw new Error("useDeps must be used inside DepsProvider");
  return deps;
}
