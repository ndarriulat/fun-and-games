# 08: Filters

**What to build:** Each play screen has a small Filters button that opens an overlay to narrow the mix: Trivia by topic and difficulty; Talk by topic, type and intensity. (Puzzles filters are added by ticket 04 in v1.1.) Topics hidden by default (Uruguay, from ticket 22) are absent from the Filters list. With no filters set, play is a random mix of everything. Filters are remembered per mode on the phone. If the filters match nothing, the play screen shows an empty state with a button to open Filters. The pool (and so "played everything" reshuffles) respects the current filters.

**Blocked by:** 05 (Talk mode), 22 (Uruguay hidden by default)

**Status:** ready-for-agent

- [ ] Filters overlay for Trivia and Talk with the right dimensions
- [ ] Hidden topics (Uruguay by default) are absent from the Filters list
- [ ] Dealt cards always match the active filters
- [ ] Filters persist per mode across reloads
- [ ] Empty pool shows an empty state that opens Filters
- [ ] Exhausting a filtered pool reshuffles only that pool
- [ ] App-level tests cover the above

## Comments

- From ticket 03: pool-only clearing on reshuffle is already implemented in `deal()` (`src/play/deal.ts`) but has no app-level test yet, because there was no second pool. Cover it here: play out a filtered pool, then check that cards outside the filter are still treated as played.
