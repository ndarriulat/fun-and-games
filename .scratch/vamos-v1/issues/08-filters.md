# 08: Filters

**What to build:** Each play screen has a small Filters button that opens an overlay to narrow the mix: Trivia by topic and difficulty; Puzzles by type and difficulty; Talk by topic, type and intensity. With no filters set, play is a random mix of everything. Filters are remembered per mode on the phone. If the filters match nothing, the play screen shows an empty state with a button to open Filters. The pool (and so "played everything" reshuffles) respects the current filters.

**Blocked by:** 04 (Puzzles mode), 05 (Talk mode)

**Status:** ready-for-agent

- [ ] Filters overlay per mode with the right dimensions
- [ ] Dealt cards always match the active filters
- [ ] Filters persist per mode across reloads
- [ ] Empty pool shows an empty state that opens Filters
- [ ] Exhausting a filtered pool reshuffles only that pool
- [ ] App-level tests cover the above
