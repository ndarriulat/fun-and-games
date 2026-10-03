"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Language } from "@/content/types";
import { appStorage } from "@/play/storage";
import { useDeps } from "./deps";
import { strings, type Strings } from "./strings";

type LanguageContextValue = {
  language: Language;
  /** The UI text in the current language. */
  t: Strings;
  /** Switches language in place and remembers it. Also counts as answering the suggestion. */
  setLanguage(language: Language): void;
  /** True on a first launch on a Spanish phone, until the player answers or picks a language. Offered once: not again after a reload. */
  suggestSpanish: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { storage, browserLanguage } = useDeps();
  const saved = useMemo(() => appStorage(storage), [storage]);
  const [language, setLanguageState] = useState<Language>("en");
  const [suggestSpanish, setSuggestSpanish] = useState(false);

  // Read after mount, not during render: the page is prerendered in English, and reading
  // the phone's storage and language while rendering would break hydration.
  useEffect(() => {
    const state = saved.load();
    /* eslint-disable react-hooks/set-state-in-effect -- syncing from device storage after hydration */
    setLanguageState(state.language);
    /* eslint-enable react-hooks/set-state-in-effect */
    if (state.languageSuggested || !browserLanguage().toLowerCase().startsWith("es")) return;
    setSuggestSpanish(true);
    saved.update((current) => ({ ...current, languageSuggested: true }));
  }, [saved, browserLanguage]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value: LanguageContextValue = {
    language,
    t: strings[language],
    setLanguage(next) {
      setLanguageState(next);
      setSuggestSpanish(false);
      saved.update((state) => ({ ...state, language: next, languageSuggested: true }));
    },
    suggestSpanish,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used inside LanguageProvider");
  return value;
}
