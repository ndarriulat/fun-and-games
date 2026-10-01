# 01: Walking skeleton: a Trivia card from start to finish

**What to build:** A player opens the site, sees Home with three big coloured mode cards (Trivia, Puzzles, Talk) and a settings icon, taps Trivia and lands straight on a full-screen card dealt at random. The card shows the question, its topic and its difficulty. "Show options" reveals four shuffled choices (the answer plus the 3 wrong options). Reveal shows the answer and the fun fact, highlighting the correct option if options are showing. Next (or swiping left) deals another card; Home goes back. Puzzles and Talk cards on Home can lead to a "coming soon" placeholder for now.

This ticket also lays the foundations every later ticket builds on:
- Next.js (App Router) + React + TypeScript project.
- The single injection seam at the app root (content bank, storage, random source, report sender, browser language), with production and test wiring.
- Vitest + React Testing Library + user-event set up, with app-level tests through the seam.
- The Trivia item shape and the content check test (see spec, Testing Decisions → Seam 2) for Trivia files.
- A handful of real starter Trivia items in both languages, using permanent IDs (they count towards the v1 totals).
- A basic card style: big readable text, large tap targets, Trivia's mode colour, light theme. Follow the card design in the spec, validated by the card prototype on the `prototype/card-screen` branch (live: https://claude.ai/artifact/ST2Y6AjFPn6oDhYxfJuUHY, variant C); ticket 11 does the final polish.
- CI running type-check, lint, tests and build on every push.

English only for UI text is fine here; ticket 06 adds the language layer.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Home shows three coloured mode cards and a settings icon
- [ ] Tapping Trivia shows a full-screen card from the bank, chosen using the injected random source
- [ ] Card shows topic and difficulty
- [ ] Show options shows exactly 4 choices, shuffled, including the answer
- [ ] Reveal shows the answer and fun fact; correct option highlighted when options are showing
- [ ] Next and swipe left both deal a new card; Home returns to the home screen
- [ ] App-level tests cover all of the above through the injection seam with a fixture bank and fixed random source
- [ ] Content check validates every Trivia file (schema, unique IDs matching format and topic, `en` present and complete, `es` complete if present, exactly 3 options none equal to the answer, valid enums), naming file, ID and field on failure
- [ ] Items with no `es` block are reported as pending translation (not a failure) and are left out of the pool when playing in Spanish
- [ ] CI runs type-check, lint, tests and build
