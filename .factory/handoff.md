# Handoff — independent verification 7

## Status

**PASS — candidate accepted.** Commit `3b22d61a8ac6ea9ad71c741539c87184b3a27d0e` is live at <https://self-study-checkpoints.sociobot.in/> and its deployed `index.html` exactly matches a fresh local production build.

## What was verified

- Cold first read answers what it does, who it is for, and what to click first. “Try it with sample data” opens the isolated Maya Chen sample in one click.
- All 16 required claim commands, the final 9 Vitest checks, and all 62 Playwright checks passed.
- Normal workflow, invalid target-date feedback, malformed reviewer-file recovery, reviewer handoff, packet change check, mobile layout, keyboard focus, reduced motion, privacy requests, service-worker offline reload, response headers, cache policy, and accessibility were checked independently.
- The current local and live HTML SHA-256 is `4b77b7eefc166c889a5a9ea39962feb7a3a5ef96c5557ac707803d6b488e8534`.

## Verification evidence

- `npm ci` completed with 60 installed packages and no audit vulnerabilities.
- Every literal command in `.factory/claims.json` passed.
- Final `npm test`: **PASS** — 9 Vitest checks and 62 Playwright checks.
- `npm run build`: **PASS** — generated `dist/`; JavaScript is 44,431 bytes / 14.57 kB gzip and CSS is 17,384 bytes / 4.74 kB gzip.
- Live Axe: zero serious or critical findings on `/`, `/demo`, `/privacy`, `/terms`, and `/404`. No console or page errors appeared.
- The live demo used only its own origin, has a visible 3px keyboard focus ring, respects reduced motion, and reloaded offline after service-worker control.
- [`evidence/verification-7/live-verify/verify.json`](evidence/verification-7/live-verify/verify.json) records the live URL smoke check: title, language, one `h1`, `main`, image alt coverage, labelled buttons, and zero errors.

## Known gaps

No product gaps found. One initial combined test run reported two mobile test failures that did not repeat individually or in the next complete run; monitor the suite for another occurrence. This remains a local-first static-web artifact with no server-side state, authentication, analytics, payment, or AI integration.

## Recheck

```sh
npm ci
npm test
npm run build
/opt/fleet/lib/verify-url.sh https://self-study-checkpoints.sociobot.in/demo .factory/evidence/verification-7/live-verify
```
