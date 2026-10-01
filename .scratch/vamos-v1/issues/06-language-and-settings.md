# 06: Language and the Settings screen

**What to build:** The settings icon on Home opens a Settings screen with a Language choice (English / Español). All UI text comes from a dictionary with both languages (a missing key in either is a type error), and cards render their content in the chosen language. Changing language switches the current card in place without dealing a new one. On first launch, if the browser language starts with `es`, a one-time suggestion offers Español; otherwise, and until accepted, the app is in English. The choice is remembered on the phone. Spanish UI text is Uruguayan (voseo, local vocabulary).

**Blocked by:** 01 (Walking skeleton)

**Status:** ready-for-agent

- [ ] Settings screen reachable from Home, with a way back
- [ ] Language switch changes all UI text and card content
- [ ] Switching mid-card keeps the same card and its revealed state
- [ ] First-launch suggestion shown once for `es` browsers only; dismissing keeps English
- [ ] Language persists across reloads
- [ ] Every UI string exists in both languages (enforced by types)
- [ ] App-level tests cover the above, using the injected browser language
