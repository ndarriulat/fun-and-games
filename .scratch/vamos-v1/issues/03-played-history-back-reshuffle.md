# 03: Played history, Back and reshuffle

**What to build:** Cards stop repeating. Every card shown is remembered as played on this phone, so later sessions skip it. Back (button or swipe right) returns to the previous card, up to 10 back, with whatever was revealed still showing; Next then moves forward through those cards before dealing a new one. There is no Skip. When every card in the current pool has been played, the player sees a short "you've played everything, starting again" message, history for that pool is cleared, and dealing restarts (not with the card just shown).

Build this for all modes, not only Trivia: history is kept per mode and keyed by item ID (not language). Introduce the versioned storage adapter here (see spec, Device storage). It must tolerate missing, corrupt or throwing storage and fall back to defaults.

**Blocked by:** 01 (Walking skeleton)

**Status:** done

- [x] A card shown is never dealt again until the pool is exhausted, including across reloads (pre-seeded storage in tests)
- [x] Back and swipe right return to the previous card with its revealed state intact; Back is disabled on the first card
- [x] Back works through at most 10 previous cards
- [x] Next after Back moves forward through the trail before dealing a new card
- [x] Exhausting the pool shows the "starting again" message, clears history for that pool only, and continues dealing
- [x] First card after a reshuffle is not the card just shown (when the pool has more than one item)
- [x] Corrupt or throwing storage does not crash the app; defaults are used
- [x] All covered by app-level tests through the injection seam

## Comments

- From ticket 01 review: screens are in-memory state, so the phone's back button/gesture leaves the site instead of going Home. Worth syncing screens with browser history (or the URL hash) here or in ticket 11.
- Implemented as a mode-agnostic `useDeck` hook (`src/ui/useDeck.ts`): it takes the mode, a pool loader and the card's initial revealed state, so Puzzles and Talk plug in the same way. `useSwipe` is shared too. Dealing is `deal()` in `src/play/deal.ts`; the versioned storage adapter is `src/play/storage.ts` (single `vamos` key, `version: 1`).
- The trail belongs to the play screen: going Home and back into a mode starts a fresh trail (history is kept). Back and Next clear the "starting again" message.
- A returning player who has played everything isn't dealt the last card they saw first (it's the last ID in history).
- If storage is broken, history is still kept in memory for the session, so cards don't repeat while playing.
- "Clears history for that pool only" is implemented in `deal()`, but there's no second pool to observe from the app yet. Its app-level test moves to ticket 08 (filtered pool), so tests don't reach into the storage layout.
- The phone back gesture item (above) moved to ticket 11.
