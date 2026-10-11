# 25: Language toggle on Home, and a clearer Settings icon

**What to build:** Put the **EN | ES toggle** on Home, in the top bar next to the Settings button, so people can find the language without opening Settings. It's the same control as on the play screen (ticket 06): it switches language in place, is remembered on the phone, and counts as answering the first-launch Spanish suggestion. Language also stays in Settings.

While testing, the Settings button on Home was taken for a light/dark mode toggle: the current `settings` icon in `src/ui/icons.tsx` (a circle with rays) looks like a sun. Replace it with a recognisable gear (cog) icon, so it doesn't clash with the Light/Dark/Follow phone setting coming in ticket 07.

Reuse the play screen's `LanguageToggle` rather than copying it (move it somewhere both screens can import). Check the Home top bar still fits at 360px wide: brand, toggle and Settings button on one row, with large tap targets.

**Blocked by:** none (06 is done)

**Status:** done

- [x] Home shows the EN | ES toggle next to the Settings button, with the current language pressed
- [x] Tapping it switches all Home text in place and is remembered across a reload
- [x] Using it hides the first-launch suggestion and stops it being offered again
- [x] The Settings icon is a gear, not a sun-like shape
- [x] Home top bar fits on one row at 360px wide
- [x] App-level tests cover the toggle on Home

## Comments

- `LanguageToggle` moved to `src/ui/LanguageToggle.tsx`; Home and the play screen both import it. No logic changed: `setLanguage` already counted as answering the first-launch suggestion.
- Home has no mode colour, so `.home-top` sets `--mode` to the ink for the pressed EN | ES. Ticket 07 (dark theme) should check it still reads well there.
- Checked in Chrome at a true 360px viewport: brand, toggle and gear fit on one row. At 320px the Settings button gets slightly clipped; out of scope here.
- The gear is Feather's `settings` icon.
