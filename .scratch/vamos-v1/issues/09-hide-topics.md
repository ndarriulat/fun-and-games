# 09: Hide topics

**What to build:** Settings gets a Hide topics section with one toggle per topic, applying to Trivia and Talk. Every topic is shown by default except Uruguay, which starts hidden (ticket 22 sets the defaults and the storage rule); turning it on brings it into random play and Filters. Each unique topic appears once: Uruguay and Portugal exist in both modes and share one toggle that hides them in both. A hidden topic never appears in random play and is missing from the Filters list. Hiding a topic leaves its played history untouched, so unhiding it doesn't bring back cards already seen. Choices are remembered on the phone, stored as changes from the defaults (see ticket 22).

**Blocked by:** 06 (Language and the Settings screen), 08 (Filters), 22 (Uruguay hidden by default)

**Status:** ready-for-agent

- [ ] One toggle per unique topic; all on by default except Uruguay, which starts off
- [ ] Hidden topics never dealt in Trivia or Talk
- [ ] Hidden topics absent from the Filters list
- [ ] Uruguay / Portugal toggles affect both modes
- [ ] Turning Uruguay on makes it playable in Trivia and Talk and listed in Filters
- [ ] Played history survives hide → unhide
- [ ] An active filter on a topic that becomes hidden doesn't break play (empty state if nothing left)
- [ ] Persists across reloads
- [ ] App-level tests cover the above
