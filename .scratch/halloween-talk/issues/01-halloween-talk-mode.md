# 01: Halloween Talk on Home

**Status:** done

**What to build:** A Halloween Talk card on Home, after Talk, that opens a Talk screen dealing only `halloween` cards, in its own Halloween colour. The card hides itself after 8 November 2026. See `../spec.md`.

- Add the `halloween` Talk topic (code `hal`) and `content/talk/halloween.json` with 3 placeholder cards in both languages, so the mode works before ticket 02 lands.
- Regular Talk never deals `halloween` cards. Halloween Talk deals only them.
- `halloween` is not listed in Settings' Hide topics.
- Reuse `TalkScreen` (a pool loader and a mode name/colour passed in), not a copy of it.
- UI strings in both languages: "Halloween Talk" / "Spooky questions for the group"; "Charla de Halloween" / "Preguntas de miedo para el grupo".
- Mark the temporary code clearly (one `// Halloween 2026: remove in ticket 03` comment per spot) so removal is a search.

- [x] Home shows Trivia, Talk, Halloween Talk, Puzzles, in that order
- [x] Halloween Talk deals only Halloween cards; Talk never does
- [x] Halloween cards switch language with the EN | ES toggle, like Talk
- [x] Home card is gone after 8 November 2026 (test with a fake clock)
- [x] Not in Settings' Hide topics
- [x] Report works and sends the `tlk-hal-…` ID
- [x] App-level tests cover the above
