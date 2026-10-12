import { bundledContentBank } from "@/content/bundled";
import type { KeyValueStore } from "@/play/storage";
import type { AppDeps } from "./deps";
import { formspreeReportSender } from "./formspreeReportSender";

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
  // Read in full, not destructured, so Next inlines it at build time.
  reports: formspreeReportSender(process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID),
  browserLanguage: () => (typeof navigator === "undefined" ? "en" : navigator.language),
};
