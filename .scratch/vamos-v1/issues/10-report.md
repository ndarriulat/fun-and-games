# 10: Report

**What to build:** Every card has a Report button opening an overlay with reasons (Wrong answer, Bad translation, Confusing, Inappropriate, Other) and an optional short note (~280 chars). Sending posts the item ID, mode, language it was played in, reason, note, app version and timestamp through the injected report sender. The production sender posts JSON to Formspree, with the endpoint ID read from a public environment variable. The player sees a short confirmation on success, or an error with Retry on failure, and play continues afterwards on the same card.

Creating the Formspree form and setting the env var in Vercel is a small human step; note it in the PR.

**Blocked by:** 01 (Walking skeleton)

**Status:** ready-for-agent

- [ ] Report available on every card in every mode
- [ ] Reason is required; note is optional and length-limited
- [ ] Sent payload contains item ID, mode, language, reason, note, app version, timestamp
- [ ] Success shows confirmation; failure shows error with Retry that resends
- [ ] Closing the overlay returns to the same card
- [ ] App-level tests use a recording, failable fake sender
