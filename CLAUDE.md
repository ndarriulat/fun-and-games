# Vamos (repo: fun-and-games)

A website for friends to play together on long car trips, in the living room, anywhere a group wants to pass the time. Built for me and my friends first; may grow later.

The product name is **Vamos**. The repo/folder keeps the name `fun-and-games`.

## How it's played

- One shared phone. One person holds it, reads aloud, and taps; nobody else needs a device.
- No login in phase 1. Anyone with the link can play.
- Played history is stored on the device (localStorage). A card counts as played as soon as it is shown. There is no Skip. When everything in the current pool has been played, reshuffle and show a short "you've played everything, starting again" message.

## Languages

- English and **Uruguayan Spanish** (voseo, local vocabulary). English is the default.
- All content and all UI text exist in both languages, including the Uruguay and Portugal topics. No Portuguese language.
- Language is a setting, not asked per game. On first launch, suggest one based on the phone's language, but default to English.

## Modes

Three modes. Trivia and Talk are random across all non-hidden topics by default; each card shows its topic. A Filters button narrows to specific topics/types and difficulty.

### Trivia
- Open answer by default: the reader asks, the group guesses, then Reveal. A "Show options" button shows 4 choices (answer + 3 wrong options).
- Every question has a short fun fact shown with the answer.
- Difficulty: easy / medium / hard.
- Topics: Geography · History · Science & Nature · Sport · Football · Music · Film & TV · Food & Drink · Language & Words · Technology · Art & Literature · Uruguay 🇺🇾 · Portugal 🇵🇹 · General
  - Uruguay: aimed at Uruguayan locals.
  - Portugal: aimed at expats living in Portugal, not lifelong locals.

### Puzzles
- Grouped by type, not topic: Riddles · Logic · Maths · Word games. Plus difficulty.
- Each has 3 hints, from vague to obvious, then the answer.
- Logic and maths must be solvable in your head (no paper). The puzzle text stays on screen so people can reread it.

### Talk
- One main question plus 1–2 optional follow-ups.
- Types: `question` or `would-you-rather`. Intensity: `light` or `deep`.
- Should spark conversation: debates, opinions, hypotheticals.
- Topics: Hypotheticals · Life & Philosophy · Society & Ethics · Future & Technology · Travel & Places · Food · Friendship & Relationships · Work & Money · Childhood & Memories · Pop Culture · Uruguay 🇺🇾 · Portugal 🇵🇹
  - Society & Ethics holds the deeper debates.
  - Portugal cards are about expat life.

### Content rules
- Family-friendly. No party politics, no religion, nothing spicy. No 18+ content is planned.

## Screens

- **Home:** three big coloured cards (Trivia / Puzzles / Talk); a top bar with the EN | ES toggle and a settings (gear) icon.
- **Tap a mode:** go straight into a full-screen card from a random mix. A small Filters button narrows topics/types and difficulty.
- **Card actions:**
  - Trivia: Show options · Reveal
  - Puzzles: Hint (up to 3) · Reveal
  - Talk: Follow-up
  - Always: Next · Back · Report · Home. Swipe left = Next, swipe right = Back. Back goes through the last 10 cards in this mode, keeping what was revealed.
  - Top bar: an EN | ES toggle switches language in place, keeping the card and what was revealed.
- **Settings:**
  - Language (English / Español)
  - Theme: Light / Dark / Follow phone. Default is Light.
  - Hide topics: one toggle per topic, applies to Trivia and Talk. All shown by default except Uruguay, which is hidden until turned on. A hidden topic never appears, not in random play and not in the Filters list.

## Design

- Light mode by default. Playful and colourful, each mode with its own colour.
- Card style inspired by Stack Overflow's 2025 survey site (https://survey.stackoverflow.co/2025/), but more playful and colourful.
- The question/puzzle/topic takes up the whole screen. Big, readable text and large tap targets for use in a moving car.

## Reports

- "Report" sends the item ID, the language it was played in, and a reason: Wrong answer · Bad translation · Confusing · Inappropriate · Other (with an optional short note).
- Phase 1 sends reports to a free form service (Tally or Formspree). No backend.

## Content

- The bank lives as JSON files in the repo. This is the source of truth.
- IDs never change, even when the text is edited, so history and reports stay linked.
- Content is written with Claude in sessions, in batches: English first, fact-check, then a separate translation pass into Uruguayan Spanish.
- Trivia item shape:

```json
{
  "id": "trv-geo-00042",
  "topic": "geography",
  "difficulty": "medium",
  "en": {
    "question": "What is the capital of Australia?",
    "answer": "Canberra",
    "options": ["Sydney", "Melbourne", "Perth"],
    "fact": "Canberra was purpose-built as a compromise between Sydney and Melbourne."
  },
  "es": {
    "question": "¿Cuál es la capital de Australia?",
    "answer": "Canberra",
    "options": ["Sídney", "Melbourne", "Perth"],
    "fact": "Canberra se construyó a propósito como punto medio entre Sídney y Melbourne."
  }
}
```

- Puzzles add `"hints"` (3 items) and use `"type"` (riddle / logic / maths / word) instead of `topic`.
- Talk cards add `"followUps"` (1–2), `"type"` (question / would-you-rather) and `"intensity"` (light / deep). Would-you-rather cards also have per-language `"optionA"` and `"optionB"`.

## Tech

- Next.js + React + TypeScript. No Vite.
- Front end only in phase 1. No backend, no database, no offline mode.
- Hosted on Vercel, deployed from a public GitHub repo (github.com/ndarriulat/fun-and-games). Every push to `main` deploys.
- Live: https://fun-and-games-vert.vercel.app/

## Milestones

1. **v1:** Trivia and Talk with 100 items each, in both languages, deployed, and tested on a real trip. Home shows Puzzles as a non-tappable "Coming soon" card.
   - Trivia: about 7 per topic; 40% easy, 40% medium, 20% hard.
   - Talk: about 8 per topic; about 25% deep and 25% would-you-rather.
2. **v1.1:** Puzzles mode with 25 per type, in both languages, and its own road test.
3. **Grow content** in batches toward 10,000 trivia / 1,000 puzzles / 2,000 Talk.
4. **Phase 2:**
   - Offline mode (PWA), downloading only the chosen language.
   - Accounts, favourites and synced history.
   - Quick Score: enter players at the start, tick who got each one right on Reveal, totals at the end.
   - A .NET (ASP.NET Core) API, with its host chosen then, and a database.
   - Reports move to the .NET API.

## Status

Design agreed (2026-10-01). Puzzles moved to v1.1 and Uruguay hidden by default (2026-10-03); v1 tickets in `.scratch/vamos-v1/`, Puzzles tickets in `.scratch/vamos-v1-1/`. Ticket 01 (walking skeleton: Home + Trivia card, content check, CI), ticket 03 (played history, Back, reshuffle, storage adapter), ticket 22 (Uruguay hidden by default), ticket 05 (Talk mode, Puzzles "Coming soon" on Home, 12 starter Talk cards), ticket 06 (language, Settings screen, first-launch Spanish suggestion) ticket 25 (EN | ES toggle on Home, gear Settings icon) ticket 24 (Spanish "Más" and "Respuesta" button labels) and the v1 content, tickets 12–14 and 18–20 (98 Trivia items and 96 Talk cards, all in English and Spanish), done.

## Commands

`npm run dev` · `npm test` · `npm run typecheck` · `npm run lint` · `npm run build`

## Agent skills

### Issue tracker

Issues and specs live as local markdown files under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.

@AGENTS.md
