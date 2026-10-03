# 22: Uruguay hidden by default

**What to build:** The Uruguay topic is hidden by default, so a player who has changed nothing never gets Uruguay cards in Trivia or Talk random play. Every other topic, Portugal included, is shown by default. Ticket 09 later adds the Settings toggle that brings Uruguay back.

Introduce topic visibility as **defaults in code plus the player's changes**:
- The default visibility of each topic is defined in code (Uruguay hidden, everything else shown).
- The storage adapter stores only the player's changes from those defaults (e.g. "uruguay: shown"), never the full hidden list. A topic added later with a hidden default is then hidden for existing players too.
- A topic is hidden if the player hid it, or if it's hidden by default and the player hasn't shown it.

The pool already leaves hidden topics out (see spec, Choosing the next card); this ticket makes that rule work with these defaults. Hiding doesn't touch played history.

**Blocked by:** 01 (Walking skeleton)

**Status:** done

- [x] Uruguay items are never dealt in Trivia with default settings; Portugal items are dealt
- [x] Same rule applies to Talk once it exists (covered by the same topic-visibility code, tested in 05)
- [x] Saved changes such as "uruguay: shown" make Uruguay playable (pre-seeded storage in tests)
- [x] Storage keeps only changes from the defaults; missing or corrupt values fall back to the defaults
- [x] Hidden-by-default topics leave played history untouched
- [x] App-level tests through the injection seam cover the above

## Comments

**Done (2026-10-03).** Visibility rule in `src/play/topics.ts`; `SavedState.topics` holds only the player's changes; the Trivia pool leaves hidden topics out. The Talk part is covered by the same code once ticket 05 widens `Topic`.

Notes for ticket 09:
- When a toggle goes back to its default, delete the key rather than writing the default value, so storage keeps only changes.
- The deck reads visibility once when the mode screen opens. If Settings can change it while a deck is open, the deck needs to reload its pool.
- Ticket 05: Talk topics differ from Trivia's (only Uruguay and Portugal overlap), so widen `Topic` and `allTopics`.
