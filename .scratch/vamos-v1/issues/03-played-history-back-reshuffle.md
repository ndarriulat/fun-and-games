# 03: Played history, Back and reshuffle

**What to build:** Cards stop repeating. Every card shown is remembered as played on this phone, so later sessions skip it. Back (button or swipe right) returns to the previous card, up to 10 back, with whatever was revealed still showing; Next then moves forward through those cards before dealing a new one. There is no Skip. When every card in the current pool has been played, the player sees a short "you've played everything, starting again" message, history for that pool is cleared, and dealing restarts (not with the card just shown).

Build this for all modes, not only Trivia: history is kept per mode and keyed by item ID (not language). Introduce the versioned storage adapter here (see spec, Device storage). It must tolerate missing, corrupt or throwing storage and fall back to defaults.

**Blocked by:** 01 (Walking skeleton)

**Status:** ready-for-agent

- [ ] A card shown is never dealt again until the pool is exhausted, including across reloads (pre-seeded storage in tests)
- [ ] Back and swipe right return to the previous card with its revealed state intact; Back is disabled on the first card
- [ ] Back works through at most 10 previous cards
- [ ] Next after Back moves forward through the trail before dealing a new card
- [ ] Exhausting the pool shows the "starting again" message, clears history for that pool only, and continues dealing
- [ ] First card after a reshuffle is not the card just shown (when the pool has more than one item)
- [ ] Corrupt or throwing storage does not crash the app; defaults are used
- [ ] All covered by app-level tests through the injection seam
