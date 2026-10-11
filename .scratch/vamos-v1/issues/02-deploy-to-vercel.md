# 02: Deploy to Vercel

**What to build:** The app is live on a Vercel URL, deployed automatically from `main` of the public GitHub repo, and loads on a real phone.

Needs a human: create/connect the public GitHub repo, connect it to Vercel, and check the live URL on a phone. Use `/wizard` if it helps to script the steps.

**Blocked by:** 01 (Walking skeleton)

**Status:** ready-for-human

- [ ] Public GitHub repo exists with `main` pushed
- [ ] Vercel project deploys `main` automatically
- [ ] Live URL opens on a phone and a Trivia card can be played
- [ ] Live URL recorded in the README or `CLAUDE.md`

## Comments

- The repo is public (owner's decision, 2026-10-11). It uses its own GitHub account through an SSH host alias (`github-fun-and-games`), so other projects on the laptop keep their own credentials.
