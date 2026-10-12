# 10: Report

**What to build:** Every card has a Report button opening an overlay with reasons (Wrong answer, Bad translation, Confusing, Inappropriate, Other) and an optional short note (~280 chars). Sending posts the item ID, mode, language it was played in, reason, note, app version and timestamp through the injected report sender. The production sender posts JSON to Formspree, with the endpoint ID read from a public environment variable. The player sees a short confirmation on success, or an error with Retry on failure, and play continues afterwards on the same card.

Creating the Formspree form and setting the env var in Vercel is a small human step; note it in the PR.

**Blocked by:** 01 (Walking skeleton)

**Status:** done

- [x] Report available on every card in every mode
- [x] Reason is required; note is optional and length-limited
- [x] Sent payload contains item ID, mode, language, reason, note, app version, timestamp
- [x] Success shows confirmation; failure shows error with Retry that resends
- [x] Closing the overlay returns to the same card
- [x] App-level tests use a recording, failable fake sender

## Comments

- From ticket 06: when playing in Spanish, a card dealt before the switch that has no Spanish yet stays on screen in English. Report should send the language the card was actually shown in (`item[language] ? language : "en"`), not the app's language.
- Done. Report is a flag icon in the play screen's top row and opens a sheet over the card. `NEXT_PUBLIC_FORMSPREE_FORM_ID` holds the Formspree form ID. Until it's set in Vercel (then redeploy, since it's inlined at build time), every report fails and shows Retry. App version is the package version plus the short Vercel commit SHA (`NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA`) when there is one. Retry resends the same report, keeping the original timestamp. A blank note is left out of the payload. The Formspree sender itself has no automated test; only the app seam was agreed.
