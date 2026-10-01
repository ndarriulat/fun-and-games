# 04: Puzzles mode

**What to build:** Tapping Puzzles on Home deals a full-screen puzzle card showing its type (Riddle / Logic / Maths / Word game) and difficulty. The puzzle text stays on screen throughout. Hint reveals hints one at a time (vague → obvious, up to 3), keeping earlier hints visible and showing how many remain; the button goes away after the third. Reveal shows the answer (plus the optional explanation) at any time. Next, swipe left, Back / swipe right, Home and history behave as in Trivia, using Puzzles' own mode colour.

Includes the Puzzle item shape, content check rules for Puzzle files (exactly 3 hints, valid type/difficulty, ID format), and a few real starter puzzles in both languages with permanent IDs.

**Blocked by:** 03 (Played history, Back and reshuffle)

**Status:** ready-for-agent

- [ ] Home's Puzzles card opens a puzzle card
- [ ] Card shows type and difficulty
- [ ] Hint reveals hints in order, earlier hints stay visible, remaining count shown, button gone after 3
- [ ] Reveal shows answer and explanation if present, at any point
- [ ] Next / Back / both swipes / history / reshuffle work for Puzzles
- [ ] Content check covers Puzzle files
- [ ] App-level tests cover the above
