# 06: Language and the Settings screen

**What to build:** The settings icon on Home opens a Settings screen with a Language choice (English / Español). All UI text comes from a dictionary with both languages (a missing key in either is a type error), and cards render their content in the chosen language. Changing language switches the current card in place without dealing a new one. On first launch, if the browser language starts with `es`, a one-time suggestion offers Español; otherwise, and until accepted, the app is in English. The choice is remembered on the phone. Spanish UI text is Uruguayan (voseo, local vocabulary).

**Blocked by:** 01 (Walking skeleton)

**Status:** done

- [x] Settings screen reachable from Home, with a way back
- [x] Language switch changes all UI text and card content
- [x] Switching mid-card keeps the same card and its revealed state
- [x] First-launch suggestion shown once for `es` browsers only; dismissing keeps English
- [x] Language persists across reloads
- [x] Every UI string exists in both languages (enforced by types)
- [x] Items pending translation (no `es`) never appear when playing in Spanish (app-level test; the filter already exists in `triviaPool`)
- [x] App-level tests cover the above, using the injected browser language

## Comments

- Mid-card switching (decided with the owner, 2026-10-03): an **EN | ES toggle in the play screen's top bar**. Settings stays reachable from Home only and holds the same Language choice. Both switch in place and are remembered.
- UI text lives in `src/ui/strings.ts` (`Record<Language, Strings>`, so a missing key is a type error) and reaches components through `useLanguage()` (`src/ui/language.tsx`), which also loads and saves the language. Topic and difficulty labels moved there from `labels.ts`.
- Language and the suggestion flag (`language`, `languageSuggested`) are read after mount, not during render: the page is prerendered in English, so a saved Spanish choice shows English for a moment on load. `<html lang>` follows the chosen language.
- The suggestion is offered once: it's remembered as offered as soon as it's shown, so ignoring it and reloading doesn't bring it back. Picking a language in Settings or on the card counts as answering it. It's bilingual on purpose (asked in Spanish, "Keep English" in English), so its text is outside the per-language dictionary.
- Changing language reloads the pool but keeps the trail. A card already on screen with no Spanish yet stays in English; only translated cards are dealt after that. Trivia options are stored as a shuffled order of indexes, so they keep their places across a switch.
