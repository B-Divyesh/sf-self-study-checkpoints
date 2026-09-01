# Independent verification 7

## Release decision

**PASS** — candidate `3b22d61a8ac6ea9ad71c741539c87184b3a27d0e` is accepted for
<https://self-study-checkpoints.sociobot.in>.

The deployed `index.html` and the fresh local production build have the same
SHA-256:
`4b77b7eefc166c889a5a9ea39962feb7a3a5ef96c5557ac707803d6b488e8534`.
Both name `index-DVxFGOK6.js` and `index-BmIDspTQ.css`.

## First read

A cold desktop visit answered the required questions in plain language. The
headline says “Plan a self-study checkpoint for review.” The next sentence
names independent math and computer-science learners. The immediately visible
primary action is “Try it with sample data”; it opens the populated Maya Chen
sample in one click. The sample banner says that nothing is saved and includes
Reset demo and Start for real controls.

## Checks completed

- Started from the requested clean candidate, ran `npm ci`, and ran every
  literal command in `.factory/claims.json`. All 16 claims passed, including
  isolated offline reload, demo storage separation, same-origin request
  recording, reviewer handoff, portable packet verification, and artwork
  provenance.
- Final `npm test` passed: 9 Vitest checks and 62 Playwright checks across
  desktop and 390px mobile.
- `npm run build` passed. The fresh output is `dist/`; TypeScript completed
  without errors. The initial JavaScript is 44,431 bytes (14.57 kB gzip) and
  CSS is 17,384 bytes (4.74 kB gzip), both within the static-product budgets.
- Exercised the live sample at desktop and 390px: entered a normal checkpoint
  title, moved through Problems, Review, and Packet, and checked the invalid
  date and malformed reviewer-file recovery paths through the automated suite.
  The 390px live page had `scrollWidth` = `clientWidth` = 390.
- Live outgoing requests during the demo flow were only to
  `https://self-study-checkpoints.sociobot.in`; no analytics, tracking,
  authentication, payment, font-CDN, or other origin request appeared.
- Live response checks found HTTPS 200 for the app, demo, legal pages, assets,
  robots, sitemap, and manifest; an unknown path returns HTTP 404. Hashed JS
  and CSS are immutable for one year. The page has HSTS, `nosniff`, strict
  referrer policy, restrictive permissions policy, and a self-only CSP with
  `frame-ancestors 'none'` as a response header.
- Independent live Axe scans of `/`, `/demo`, `/privacy`, `/terms`, and `/404`
  found zero serious or critical findings. Each route had one `h1`, one `main`,
  an appropriate title, and no console or page errors. The first keyboard stop
  was the skip link with a visible 3px outline. Reduced-motion mode changes
  scrolling to `auto` and transitions to 0.01ms.
- A fresh live service-worker-controlled `/demo` updated its registration and
  reloaded offline with “Inspect a checkpoint already in progress.”
- `/opt/fleet/lib/verify-url.sh` passed for live `/demo`; evidence is in
  [`.factory/evidence/verification-7/live-verify/verify.json`](evidence/verification-7/live-verify/verify.json).

## Defects by severity

No reproducible product defects found.

### Observation — test stability

The first combined `npm test` run after the required individual claim runs
reported two mobile failures (date-window feedback and malformed reviewer JSON).
Each passed when run alone, and a second complete `npm test` run passed all 71
checks without code or configuration changes. This is not a reproduced release
defect, but the test suite should be monitored for another occurrence.

## Scope notes

This is a local-first static web application. It has no server-side API,
authentication, payment flow, or AI/model request, so API allowance and
sign-in checks do not apply.
