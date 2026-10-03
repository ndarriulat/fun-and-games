# 05: Talk mode

**What to build:** Tapping Talk on Home deals a full-screen conversation card showing its topic, with the main question in big text. Would-you-rather cards show both choices clearly. Follow-up reveals the 1–2 follow-up questions one at a time; the button goes away when none remain. Next, swipe left, Back / swipe right, Home and history behave as in the other modes, using Talk's own mode colour.

Puzzles moved to v1.1, so this ticket also turns Home's Puzzles card into a visible, non-tappable "Coming soon" card (it currently opens a placeholder screen). Ticket 04 makes it a real mode card later.

Includes the Talk item shape (with `optionA`/`optionB` for would-you-rather), content check rules for Talk files (1–2 follow-ups, both options for would-you-rather, valid topic/type/intensity, ID format), and a few real starter cards in both languages with permanent IDs.

**Blocked by:** 03 (Played history, Back and reshuffle)

**Status:** done

- [x] Home's Talk card opens a Talk card
- [x] Home's Puzzles card shows "Coming soon" and does nothing when tapped
- [x] Card shows topic; would-you-rather shows both choices
- [x] Follow-up reveals follow-ups in order; button gone when none remain
- [x] Next / Back / both swipes / history / reshuffle work for Talk
- [x] Uruguay Talk cards are not dealt with default settings (ticket 22's rule)
- [x] Content check covers Talk files
- [x] App-level tests cover the above
