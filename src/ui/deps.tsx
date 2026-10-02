"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ContentBank } from "@/content/bank";
import type { Language, Mode } from "@/content/types";
import type { KeyValueStore } from "@/play/storage";

export type Report = {
  itemId: string;
  mode: Mode;
  language: Language;
  reason: "wrong-answer" | "bad-translation" | "confusing" | "inappropriate" | "other";
  note?: string;
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
