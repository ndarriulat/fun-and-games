# 11: Design polish

**What to build:** A consistent, playful and colourful look across every screen, inspired by the Stack Overflow 2025 survey site's card style (https://survey.stackoverflow.co/2025/) but more playful. The question, puzzle or topic fills the screen; text is big and readable and tap targets are large enough for a moving car. Each mode's colour is applied consistently in light and dark. Base this on the Card design section of the spec, validated by the card prototype on the `prototype/card-screen` branch (live: https://claude.ai/artifact/ST2Y6AjFPn6oDhYxfJuUHY, variant C). Rewrite it properly; don't copy the prototype code.

**Blocked by:** 05 (Talk mode), 07 (Theme)

Puzzles moved to v1.1: style Home's "Coming soon" Puzzles card here; ticket 04 applies this design to the Puzzles screen itself.

**Status:** ready-for-agent

- [ ] Home (including the "Coming soon" Puzzles card), the Trivia and Talk play screens, overlays and Settings share one visual language
- [ ] Card text scales to fill the screen without overflowing, for short and long items
- [ ] Every tap target is at least 48px; primary actions are larger
- [ ] Mode colours are consistent and readable in light and dark
- [ ] Checked on a real phone viewport in both themes
- [ ] Existing app-level tests still pass

## Comments

- From tickets 01/03: screens are in-memory state, so the phone's back button/gesture leaves the site instead of going Home. Sync screens with browser history (or the URL hash).
