# 27: "Show options" inside the Trivia card

**What to build:** On a phone (seen on an iPhone in Safari, Spanish), once options are shown the 4th option is cut off at the bottom of the card and needs an inner scroll to be seen. The "Show options" link sits in its own row between the card and the controls, and that row (48px plus the gap) stays reserved even after the link disappears, so the card is shorter than it needs to be.

Move "Show options" inside the card, under the question, styled as a single dashed box like the options themselves. Tapping it expands in place into the four options. On Trivia, drop the separate links row so the card takes that height back.

If the four options still don't fit on a small phone, step the question down one size (`questionSize`) while options are showing. The card keeps its inner scroll as a last resort for very long questions.

**Blocked by:** none

**Status:** done

- [x] "Show options" is inside the card, under the question, with a tap target of at least 48px
- [x] Tapping it replaces it with the four options in the same place; it doesn't come back on that card
- [x] Trivia no longer has an empty links row under the card; Talk is unchanged
- [x] On a 390×844 and a 375×667 viewport, a medium-length question with all four options fits without scrolling, before and after Reveal (answer and fact may scroll after Reveal)
- [x] Swiping the card still works, and tapping the button doesn't trigger a swipe
- [x] App-level tests updated and passing

## Comments
- "Show options" is now a dashed `.option-show` box inside the card, under the question; the Trivia links row is gone. Talk keeps its empty links row, unchanged.
- While options are showing, the question steps down one size (`questionSize(question, 1)`). On screens under 700px tall the options are slimmer and the m/l/xl question sizes are a little smaller.
- Measured with Playwright, 60 random cards per run, 4th option fully visible with 8px to spare: 390×844 60/60 (ES and EN), 360×740 25/25, 375×667 EN 60/60 and ES 59/60. The one miss is a long Spanish question cut by about 1px; the card's inner scroll covers it.
- Swipe: the button is a plain tap, which `useSwipe` ignores (under 60px of movement), so it can't trigger Next/Back. Not yet tried on a real phone.
- Also in this change, as asked: Home order is now Trivia / Talk / Puzzles (CLAUDE.md and spec story 2 updated).
