# Halloween Talk

A temporary Talk edition for Halloween get-togethers: silly, spooky questions for a group. Lives on Home for Halloween 2026, hides itself after 8 November, then gets removed.

## What players see

- **Home:** a fourth card, right after Talk and before Puzzles. Title "Halloween Talk", subtitle "Spooky questions for the group". Its own Halloween colour (near-black with pumpkin orange), not Trivia's orange.
- **Tapping it:** plays exactly like Talk (same card, Follow-up, Next, Back, swipes, Report, EN | ES toggle), but only with Halloween cards, and in the Halloween colour. The chip says "Halloween Talk".
- **After 8 November 2026** (phone's local date), the Home card is gone. Nothing else changes.

## Cards

- 85 cards, in English and Uruguayan Spanish, like every other card:
  - **45 light** Halloween cards (below).
  - **30 creepy** Halloween cards, `intensity: deep`: eerie and unsettling, never gory or sad ("You hear someone call your name from an empty room. Do you answer?"). About a third each of questions, would-you-rather and group "who here…" cards.
  - **10 Halloween in Portugal** cards for expats, their own topic `halloween-portugal` (code `hpt`, IDs `tlk-hpt-…`, `content/talk/halloween-portugal.json`): Pão-por-Deus, Sintra, Montalegre's witches' night, bureaucracy horror stories. No church settings (no-religion rule).
- The light mix:
  - **~20 "Who's most likely to…"**: everyone points at someone. Plain `question` cards, so no new card type. Follow-ups: "Why them?" style.
    - "Who's most likely to be the first one to run in a horror movie?"
    - "Who's most likely to scream at a jump scare and blame someone else?"
  - **~15 would-you-rather:** "Would you rather spend a night in a haunted house or a week with no phone?"
  - **~15 questions:** "What's the scariest film you've actually finished?", "What would your ghost haunt for fun?"
- Content rules as usual: family-friendly, nothing gory or spicy. "Most likely to" cards tease, never embarrass: nothing about looks, money, relationships or anything that would sting.
- IDs `tlk-hal-00001` to `tlk-hal-00075`, topic `halloween` (code `hal`), in `content/talk/halloween.json`.

## Spanish

Same as everywhere else: the Home card reads "Charla de Halloween" / "Preguntas de miedo para el grupo", and the cards are written in English first, then translated into Uruguayan Spanish (voseo). "Who's most likely to…" becomes "¿Quién es más probable que…?" or a more natural Uruguayan phrasing, to settle in the translation pass.

## Decisions

- **It's Talk topics, not a new mode.** Halloween cards are Talk items with topic `halloween` or `halloween-portugal`. The regular Talk pool always leaves them out; Halloween Talk deals only them. This keeps storage, Report and the content check as they are, and makes removal a clean delete.
- **Played history is shared with Talk** (the `talk` key). IDs never overlap, so this is harmless, and it avoids adding a mode to storage for a few days.
- **Not in Settings.** `halloween` doesn't appear in the Hide topics list. Turning off Halloween is just not tapping the card.
- **Reports** arrive as `mode: talk` with a `tlk-hal-…` item ID, which is enough to tell them apart.
- **Hide date is hard-coded** (through 8 November 2026). Removal is a separate ticket, not urgent once the card has hidden itself.

## Out of scope

- A Halloween theme for the rest of the app.
- Any reusable "seasonal edition" system. If Christmas happens, we'll build it then from what we learn here.
