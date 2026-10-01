# 09: Hide topics

**What to build:** Settings gets a Hide topics section with one toggle per topic, all shown by default, applying to Trivia and Talk. Each unique topic appears once: Uruguay and Portugal exist in both modes and share one toggle that hides them in both. A hidden topic never appears in random play and is missing from the Filters list. Hiding a topic leaves its played history untouched, so unhiding it doesn't bring back cards already seen. Choices are remembered on the phone.

**Blocked by:** 06 (Language and the Settings screen), 08 (Filters)

**Status:** ready-for-agent

- [ ] One toggle per unique topic, all on by default
- [ ] Hidden topics never dealt in Trivia or Talk
- [ ] Hidden topics absent from the Filters list
- [ ] Uruguay / Portugal toggles affect both modes
- [ ] Played history survives hide → unhide
- [ ] An active filter on a topic that becomes hidden doesn't break play (empty state if nothing left)
- [ ] Persists across reloads
- [ ] App-level tests cover the above
