# 04: Puzzles mode

**What to build:** Home's "Coming soon" Puzzles card becomes a real mode card. Tapping it deals a full-screen puzzle card showing its type (Riddle / Logic / Maths / Word game) and difficulty. The puzzle text stays on screen throughout. Hint reveals hints one at a time (vague → obvious, up to 3), keeping earlier hints visible and showing how many remain; the button goes away after the third. Reveal shows the answer (plus the optional explanation) at any time. Next, swipe left, Back / swipe right, Home and history behave as in Trivia, using Puzzles' own mode colour.

Because Puzzles moved to v1.1, this ticket also brings Puzzles up to the finished v1 app: Puzzles filters (type and difficulty) in the Filters overlay from ticket 08, all UI text in both languages through ticket 06's dictionary, and the polished design from ticket 11.

Includes the Puzzle item shape, content check rules for Puzzle files (exactly 3 hints, valid type/difficulty, ID format), and a few real starter puzzles in both languages with permanent IDs.

**Blocked by:** v1 tickets 06 (Language and Settings), 08 (Filters), 11 (Design polish)

**Status:** ready-for-agent

- [ ] Home's Puzzles card is no longer "Coming soon" and opens a puzzle card
- [ ] Card shows type and difficulty
- [ ] Hint reveals hints in order, earlier hints stay visible, remaining count shown, button gone after 3
- [ ] Reveal shows answer and explanation if present, at any point
- [ ] Next / Back / both swipes / history / reshuffle work for Puzzles
- [ ] Filters overlay narrows Puzzles by type and difficulty, remembered on the phone
- [ ] Puzzles UI text exists in both languages; matches the v1 visual language in light and dark
- [ ] Content check covers Puzzle files
- [ ] App-level tests cover the above
