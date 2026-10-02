import { bundledContentBank } from "@/content/bundled";
import type { AppDeps, KeyValueStore } from "./deps";

/** localStorage, made safe: private browsing or blocked storage just means nothing is remembered. */
const browserStorage: KeyValueStore = {
  getItem(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Storage unavailable or full: carry on without saving.
    }
  },
};

export const productionDeps: AppDeps = {
  content: bundledContentBank,
  storage: browserStorage,
  random: Math.random,
  // Ticket 10 replaces this with the Formspree sender.
  reports: { send: () => Promise.reject(new Error("Reports aren't available yet")) },
  browserLanguage: () => (typeof navigator === "undefined" ? "en" : navigator.language),
};
