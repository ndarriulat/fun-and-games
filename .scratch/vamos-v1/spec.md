Status: ready-for-agent

# Spec: Vamos v1

## Problem Statement

When a group of friends is stuck together for hours (a long car trip, a slow evening in the living room) they run out of things to do and talk about. Existing trivia and party apps assume everyone has a phone, need accounts, are English-only, or are full of content that doesn't fit the group: nothing about Uruguay for the Uruguayans, nothing about expat life in Portugal, and plenty that's too spicy or political for a mixed group. Paper quiz books run out, repeat themselves, and can't hide the answer from the person reading.

The group wants one shared phone that a single person holds, reads aloud from and taps, with an endless-feeling supply of trivia, puzzles and conversation starters in English or Uruguayan Spanish. It shouldn't repeat what they've already played, and it should be readable and tappable in a moving car.

## Solution

**Vamos** is a mobile-first website with three modes:

- **Trivia:** open-answer questions with Reveal, an optional "Show options" multiple choice, and a fun fact.
- **Puzzles:** riddles, logic, maths and word games, each with three progressive hints and a Reveal.
- **Talk:** conversation starters and would-you-rather cards, each with optional follow-ups.

Tapping a mode goes straight to a full-screen card picked at random from everything not yet played. Filters narrow the mix. Settings control language (English / Español), theme and hidden topics. Played history lives on the device, so cards don't repeat until everything has been played. Then the deck reshuffles with a short message. A Report button sends problems with an item to a free form service. There's no login, no backend and no install: anyone with the link can play.

v1 ships **Trivia and Talk**, 100 items each in both languages, deployed on Vercel and tested on a real trip. **Puzzles moves to v1.1** (decided 2026-10-03; see `.scratch/vamos-v1-1/spec.md`). In v1, Home shows Puzzles as a non-tappable "Coming soon" card. Stories and decisions about Puzzles below are part of v1.1.

## User Stories

### Getting started

1. As a player, I want to open a link and start playing immediately, so that nobody has to sign up or install anything in the car.
2. As a player, I want the home screen to show three big coloured cards (Trivia, Talk, Puzzles), so that I can pick a mode with one tap. *(v1: Puzzles is a non-tappable "Coming soon" card.)*
3. As a player, I want each mode to have its own colour, so that I always know which mode I'm in at a glance.
4. As a player, I want a settings icon on the home screen, so that I can change language, theme and hidden topics.
5. As a first-time player whose phone is set to Spanish, I want the app to suggest Español once, so that I don't have to dig through settings.
6. As a first-time player, I want the app to default to English if I ignore or decline the suggestion, so that the default is predictable.
7. As a returning player, I want my language, theme, hidden topics and history remembered on this phone, so that I pick up where I left off.

### Playing any mode

8. As the reader, I want tapping a mode to go straight to a full-screen card, so that we start playing with no extra steps.
9. As the reader, I want the card text to be large and fill the screen, so that I can read it aloud in a moving car.
10. As the reader, I want large tap targets for every action, so that I don't mis-tap on a bumpy road.
11. As the reader, I want a Next button, so that I can move to a new card.
12. As the reader, I want to swipe left to go to the next card, so that I can move on with one gesture.
13. As the reader, I want to swipe right or tap Back to return to the previous card, so that an accidental swipe or a card someone missed isn't lost.
14. As the reader, I want to go back through the last 10 cards, with whatever was revealed still showing, and then move forward through them again with Next, so that going back feels like flipping through a deck.
15. As the reader, I want a way back to Home from any card, so that we can switch modes.
16. As a group, we want cards we've already seen not to come back, so that the game stays fresh across trips.
17. As a group, we want a short "you've played everything, starting again" message when the current pool runs out, so that we understand why cards start repeating.
18. As a group, we want the deck to reshuffle after that message, so that the game never dead-ends.
19. As the reader, I want each card to show its topic (or puzzle type), so that the group knows what kind of question is coming.
20. As the reader, I want each card to show its difficulty (Trivia and Puzzles), so that we can set expectations.

### Filters

21. As the reader, I want a small Filters button on the card screen, so that I can narrow the mix without leaving the game.
22. As the reader, I want to filter Trivia by topic and difficulty, so that we can play just Football, or just easy questions.
23. As the reader, I want to filter Puzzles by type (Riddles, Logic, Maths, Word games) and difficulty, so that we can pick what suits the group.
24. As the reader, I want to filter Talk by topic, type (question / would-you-rather) and intensity (light / deep), so that we can match the mood.
25. As the reader, I want no filters applied by default (a random mix of everything not hidden), so that the default experience is varied.
26. As the reader, I want my filters remembered per mode on this phone, so that I don't have to reapply them each time.
27. As the reader, I want a clear message if my filters match nothing, so that I know to change them rather than thinking the app is broken.
28. As the reader, I want hidden topics not to appear in the Filters list, so that a hidden topic is really gone.

### Trivia

29. As the reader, I want to see only the question at first, so that the group can guess before seeing anything else.
30. As the reader, I want a Reveal button that shows the answer and a short fun fact, so that we learn something whether or not we guessed right.
31. As the reader, I want a "Show options" button that shows four choices (the answer plus three wrong options) in random order, so that we can make a hard question easier.
32. As the reader, I want the correct option to be highlighted when I reveal after showing options, so that everyone can see which one was right.
33. As a group of Uruguayans, we want a Uruguay topic aimed at locals, so that we can test what we actually know about home.
34. As a group of expats in Portugal, we want a Portugal topic aimed at expats, so that the questions are fair for people who didn't grow up there.

### Puzzles (v1.1)

35. As the reader, I want the puzzle text to stay on screen the whole time, so that people can reread it while thinking.
36. As the reader, I want a Hint button that reveals up to three hints one at a time, from vague to obvious, so that we can get unstuck gradually.
37. As the reader, I want earlier hints to stay visible as more are revealed, so that the group can see all clues together.
38. As the reader, I want the Hint button to show how many hints are left and to disappear after the third, so that I know where we are.
39. As the reader, I want a Reveal button that shows the answer at any time, so that we can give up when we want.
40. As a group, we want every logic and maths puzzle to be solvable in our heads, so that we never need paper in the car.

### Talk

41. As the reader, I want a main question in big text, so that it starts a conversation.
42. As the reader, I want would-you-rather cards to show both choices clearly, so that people can pick a side.
43. As the reader, I want a Follow-up button that reveals one or two follow-up questions in turn, so that we can keep a good conversation going.
44. As a group, we want to choose between light and deep cards, so that we can match the mood of the trip.
45. As a group, we want Society & Ethics cards for deeper debates, so that we can have proper arguments (without party politics or religion).

### Settings

46. As a player, I want to switch language between English and Español at any time, so that a mixed group can play in whichever suits them.
47. As a player, I want the current card to switch language immediately when I change it, so that I don't lose my place.
48. As a Uruguayan player, I want the Spanish to be Uruguayan (voseo, local words), so that it sounds like us.
49. As a player, I want every piece of UI text translated as well as the content, so that the app feels native in both languages.
50. As a player, I want to choose Light, Dark or Follow phone for the theme, with Light as the default, so that it's comfortable day or night.
51. As a player, I want one toggle per topic to hide it from Trivia and Talk, so that topics nobody in the group enjoys never appear.
52. As a player, I want all topics shown by default except Uruguay, which starts hidden and can be turned on in Settings, so that I don't have to configure anything to start.
53. As a player, I want hiding a topic not to erase its played history, so that unhiding it later doesn't bring back cards we've already seen.

### Reporting

54. As the reader, I want a Report button on every card, so that I can flag something wrong without leaving the game.
55. As the reader, I want to pick a reason (Wrong answer, Bad translation, Confusing, Inappropriate, Other) and add an optional short note, so that the report is useful.
56. As the reader, I want the report to include the item and the language it was played in automatically, so that I don't have to describe which card it was.
57. As the reader, I want a short confirmation when a report is sent, so that I know it worked.
58. As the reader, I want a clear error with a retry option if a report fails (e.g. no signal), so that I don't lose it silently.
59. As the content maintainer, I want reports delivered to a form service I can read, so that I can fix bad items.

### Content (maintainer)

60. As the content maintainer, I want all content stored as JSON files in the repo, so that the repo is the single source of truth.
61. As the content maintainer, I want every item's ID to stay fixed when its text changes, so that players' history and reports stay linked to it.
62. As the content maintainer, I want an automated check that rejects malformed content, so that a bad batch from Claude never reaches players.
63. As the content maintainer, I want to add a new batch by adding or extending JSON files only, so that growing content never needs code changes.
64. As the content maintainer, I want the check to tell me exactly which item and field is wrong, so that fixing a batch is quick.

### Deployment

65. As the owner, I want the app deployed to Vercel from the private GitHub repo, so that every push to main goes live.
66. As a player, I want the site to load quickly on a mobile connection, so that we can start playing even with weak signal.

## Implementation Decisions

### Platform

- Next.js (App Router) + React + TypeScript, deployed on Vercel from a private GitHub repo. No Vite, no backend, no database, no offline mode in v1.
- The app is effectively a client-side app. Pages: Home, one play screen per mode (Trivia, Puzzles, Talk) and Settings. Filters and Report are overlays on the play screen, not separate pages.
- All UI strings live in a dictionary keyed by language (`en`, `es`), separate from item content. No i18n framework is needed for two languages. A missing key in either language is a type error.

### Content bank

- Content is JSON in the repo: one file per Trivia topic, per Puzzle type and per Talk topic. Items are bundled into the app at build time (about 300 items in v1). Splitting per mode or per language is deferred until content grows (see Further Notes).
- **ID format:** `<mode prefix>-<topic/type code>-<5-digit number>`, e.g. `trv-geo-00042`, `pzl-log-00007`, `tlk-hyp-00013`. IDs are never reused or changed.
- Item shapes:
  - **Trivia:** `id`, `topic`, `difficulty` (easy/medium/hard), and per language (`en`, `es`): `question`, `answer`, `options` (exactly 3 wrong options), `fact`.
  - **Puzzle:** `id`, `type` (riddle/logic/maths/word), `difficulty`, and per language: `question`, `answer`, `hints` (exactly 3, vague → obvious). Puzzles may also carry an optional per-language `explanation` shown on Reveal.
  - **Talk:** `id`, `topic`, `type` (question/would-you-rather), `intensity` (light/deep), and per language: `question`, `followUps` (1–2). Would-you-rather cards also carry per-language `optionA` and `optionB`, so the UI can show both choices clearly.
- Topic keys are shared where the same topic exists in both Trivia and Talk (Uruguay and Portugal). Settings shows each unique topic once, and hiding it hides it in both modes.
- The **content bank module** loads all items and exposes them by mode with typed shapes. It knows nothing about history or settings.

### Choosing the next card

- The **pool** for a mode is: every item in that mode, minus items whose topic is hidden, narrowed by that mode's current filters.
- **Topic visibility** is defaults in code plus the player's changes. Uruguay is hidden by default; every other topic (Portugal included) is shown. A topic is hidden if the player hid it, or if it's hidden by default and the player hasn't shown it.
- An item counts as **played** as soon as it is shown on a card. There is no Skip: moving past a card you don't like is just Next.
- Each mode keeps a **recent trail** of the current card plus up to 10 previous ones, with each card's revealed state (options shown, hints, follow-ups, answer). Back moves along the trail; Next moves forward along it before dealing a new card. The trail lives in memory for the session only. Going back doesn't change played history.
- The next card is chosen at random from the **unplayed** items in the pool. Randomness is supplied from outside, so tests can make it fixed.
- When the pool has no unplayed items left, the app shows the "you've played everything, starting again" message, clears the played history **for the items in this pool only**, and deals from the full pool again. It avoids dealing the card that was just shown as the first card after the reshuffle.
- If filters and hidden topics leave an empty pool, the play screen shows an empty state with a button to open Filters.
- History is keyed by item ID only, not by language, so switching language doesn't bring back cards already seen.
- Hiding a topic doesn't touch history.

### Device storage

- A single **storage adapter** sits in front of localStorage and persists: language, the suggestion seen/answered flag, theme, topic visibility (only the player's changes from the defaults, so a topic later added as hidden by default stays hidden for existing players), filters per mode, and the played-ID history per mode. It's versioned with a schema version number, so the shape can change later without corrupting old data.
- Reads tolerate missing or corrupt data (private browsing, cleared storage) and fall back to defaults. The app still works if storage throws.

### Language

- On first launch: if the browser's preferred language starts with `es`, show a one-time suggestion to switch to Español. Otherwise, and until the player accepts, the language is English.
- Changing language re-renders the current card in the new language without dealing a new card.
- Spanish content and UI use Uruguayan Spanish (voseo, local vocabulary).

### Theme

- Light (default), Dark, or Follow phone (prefers-color-scheme). Each mode has its own accent colour, tuned for both themes.

### Reports

- Reports go to **Formspree** via a JSON POST from the browser. The endpoint ID is configured as a public environment variable.
  - Payload: item ID, mode, language played in, reason (`wrong-answer` / `bad-translation` / `confusing` / `inappropriate` / `other`), optional note (max ~280 chars), app version, and timestamp.
- The **report sender** is an adapter with a single `send(report)` operation, injected into the app, so tests swap it for a fake. Phase 2 swaps it for the .NET API.
- The UI shows a sent confirmation, and on failure an error with Retry.

### Injection seam

- The app root takes its outside dependencies from one provider: content bank, storage, random source, report sender, and the browser language. Production wires the real ones. Tests wire fakes. This is the one place where tests plug into the app.

### Card design (from the prototype)

Validated with the card prototype on the `prototype/card-screen` branch (live: https://claude.ai/artifact/ST2Y6AjFPn6oDhYxfJuUHY, variant C):

- **Deck metaphor.** One card sits on a fanned stack of two ghost cards tinted in the mode colour. The front is the surface colour with a thick mode-colour border; the revealed side is solid mode colour with white text.
- **Reveal flips the card.** The revealed side repeats the question (smaller) above the answer, so puzzle text stays readable, then shows the fun fact or explanation. In Trivia, the options stay visible with the right one highlighted.
- **The card scrolls on its own, vertically.** New hints, options and follow-ups scroll into view as they appear, and a "More ↓" cue shows when there's content below. Question text steps down in size for long items. Don't implement the flip as a real two-sided 3D card: the hidden face blocks touch scrolling on phones. Animate it instead.
- **Hints are yellow sticky notes** on the card; follow-ups are lines with a mode-colour rule.
- **Controls under the card:** Back (small, round), the main action (large, round, mode colour: Reveal / Hint n/3 / Follow-up, or Next when nothing is left), Next (small, round). Secondary actions sit as a text link above them: Show options (Trivia), Reveal answer (Puzzles, while hints remain).
- **Top row:** Home icon, a Filters chip showing the current selection (e.g. "Trivia · all topics"), Report icon.
- **Type:** a playful display face for questions and buttons (Bricolage Grotesque in the prototype) with a clean sans for body text (Figtree).
- **Mode colours** (light / dark): Trivia orange #E8531F / #FF6A3A, Puzzles violet #6A4CFF / #8670FF, Talk teal #0B9483 / #16B39F, with sunny yellow #FFC83D for answers and hints.

### Interaction details

- Swipe left on the card is Next; swipe right is Back. Vertical drags scroll the card.
- Trivia Show options: options are the answer plus the 3 wrong options, shuffled once per card view. Reveal highlights the correct option if options are showing.
- Puzzles Hint: reveals hints in order and shows the remaining count. Reveal is always available.
- Talk Follow-up: reveals follow-ups one at a time. The button disappears when none remain.
- Actions always present on a card: Next, Back (disabled on the first card), Report, Home, and the Filters chip.

## Testing Decisions

- **Good tests check what a player sees and does, never internals.** They render the app, tap buttons, swipe, and check what's on screen and what was persisted or sent through the fakes. They don't import the card picker, the storage layout or component internals directly, so these can be refactored freely.
- **Tooling:** Vitest + React Testing Library (jsdom), with user-event for taps and pointer events for the swipe.
- **Seam 1: the app.** Tests render the whole app through the injection seam with:
  - a small fixture content bank (a handful of items per mode, both languages)
  - an in-memory storage, optionally pre-seeded to simulate a returning player
  - a fixed random source
  - a recording report sender that can be told to fail
  - a configurable browser language

  This covers every user story above: dealing and no-repeat, Back and forward through the recent trail (including its 10-card limit), the exhausted-pool message and reshuffle, filters and the empty state, hidden topics (including that they're missing from Filters and that history is kept), language suggestion and live switching, theme setting, Trivia options and Reveal, Puzzle hints, Talk follow-ups, Report success and failure, and tolerance of corrupt storage.
- **Seam 2: the content check.** A test that loads every real JSON file in the bank and validates it. It checks:
  - the schema per mode
  - that IDs are unique across the whole bank and match the format and the file's topic/type
  - that `en` is present and complete, and `es` is complete if present. An item with no `es` block is reported as **pending translation** rather than failing, because English batches land before their translation pass. The app leaves pending items out of the pool when playing in Spanish. v1 ships with zero items pending.
  - that Trivia has exactly 3 options, none equal to the answer
  - that Puzzles have exactly 3 hints
  - that Talk has 1–2 follow-ups, and would-you-rather cards have both options
  - that enum values are valid

  Failures name the file, ID and field. A companion report (not a failing test) prints counts per topic/type, difficulty and intensity against the v1 targets.
- **Prior art:** none. The repo is empty, so these tests set the patterns.
- CI runs type-check, lint, both test seams and the build on every push. Vercel deploys main.

## Out of Scope

- Offline mode / PWA.
- Accounts, login, favourites, synced history.
- Quick Score (player names, ticking who got it right, totals).
- Any backend, the .NET API, a database, or reports going anywhere but Formspree.
- Portuguese or any language other than English and Uruguayan Spanish.
- 18+ or spicy content, party politics, religion.
- Skip / unskip, sharing cards, timers, sound or haptics.
- An in-app content editor or admin screen.
- Analytics.
- Growing content beyond v1 (100 items per mode). That's milestone 2, done in later content batches.

## Further Notes

- **v1 content targets:**
  - Trivia: about 7 per topic across 14 topics; 40% easy, 40% medium, 20% hard.
  - Puzzles: 25 per type (v1.1).
  - Talk: about 8 per topic across 12 topics; about 25% deep and about 25% would-you-rather.

  Content is written in batches with Claude: English first, then fact-check, then a separate translation pass into Uruguayan Spanish. The content check gates every batch.
- **Content and code are separate tracks.** They meet only at the item shapes and the content check, so the shapes and the check should land first. Content batches can then run alongside the UI work.
- **Decisions made here, not in the original design.** Flagged for review because they weren't explicitly agreed:
  - An item counts as played when it's shown.
  - Reshuffle clears history only for the current pool.
  - Filters are remembered per mode.
  - Uruguay and Portugal share one hide toggle across modes.
  - Uruguay is hidden by default; topic visibility is stored as changes from the defaults (agreed 2026-10-03).
  - Puzzles moved to v1.1 (agreed 2026-10-03).
  - Would-you-rather cards carry explicit `optionA`/`optionB`.
  - Puzzles may have an optional `explanation`.
  - Reports use Formspree rather than Tally.
- **Bundle growth.** At milestone-2 sizes (13,000 items × 2 languages), bundling everything won't scale. The content bank module's interface should allow lazy loading per mode and language later without changing callers. Phase 2's offline mode already plans to download only the chosen language.
- **Domain docs.** No `GLOSSARY.md` or ADRs exist yet. Terms used here (item, card, pool, played, hidden topic, filters) are candidates for `/domain-modeling`.
