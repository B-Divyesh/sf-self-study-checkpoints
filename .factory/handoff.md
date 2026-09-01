# Handoff — repair 5

## Status

**PASS — deployed.** Repair commit `78acc8d41f424041d1a01165390a5cf8b6dde549` is live at <https://self-study-checkpoints.sociobot.in/>. It closes the P2 release blocker recorded in `.factory/verification-6.md`: a damaged review URL exposed the browser's decoder exception and did not tell the reviewer how to recover.

## What changed

- Reproduced the verifier's exact failure at `/?review=%25bad`. Before this repair, the notice exposed `Failed to execute 'atob' on 'Window'...`.
- Centralized review-query parsing in `readReviewRequest()`. Any unreadable `review` value now says: “This review link could not be read. Ask the learner for a new link or use the downloaded review request file.” Decoder and JSON-parser details never reach the page.
- Added a browser regression that opens both the exact malformed value and a truncated encoded request. It verifies the usable builder, the plain recovery action, and absence of decoder/parser jargon on desktop and 390px mobile.
- Updated the service worker to cache version `checkpoint-desk-v4` and use network-first navigation with an offline shell fallback. Existing browsers therefore install the new worker and receive the repaired HTML while offline use remains available.

## Verification

- `npm ci`: installed 60 packages; audit reported 0 vulnerabilities.
- Every literal command in `.factory/claims.json` passed: all 16 declared claims, including the isolated offline reload, demo sandbox, privacy/request logging, review handoff, and signed-packet journeys.
- `npm test`: **PASS** — 9 Vitest/static checks and 62 Playwright checks across desktop and 390px mobile.
- `npm run build`: **PASS** — TypeScript checking passed and `dist/index.html` was produced.
- The new malformed/truncated review-link regression passed on both Playwright projects. A served-build smoke check repeated `?review=%25bad` and `?review=eyJraW5kIjoi`; each rendered the recovery message with no console or page errors.
- Playwright Axe checks found zero serious or critical violations on `/`, `/demo`, `/privacy`, `/terms`, and `/404` at both viewport projects. Keyboard skip-link, route focus/announcement, 44px controls, reduced motion, and 200% text cases remain covered by the full browser suite.
- `/opt/fleet/lib/verify-url.sh` passed locally and against the live `/demo`: title `Demo — Self-Study Checkpoints`, `lang=en`, one `h1`, one `main`, no images missing `alt`, no unlabelled buttons, and no console/page errors. The live machine-readable result is [`evidence/repair-5/live-verify/verify.json`](evidence/repair-5/live-verify/verify.json).
- The static response-policy checks passed for CSP, headers, immutable hashed bundles, short-lived documents, and the real 404 route.
- Local mobile Lighthouse on `/demo`: Performance **100**, Accessibility **100**, Best Practices **100**; FCP **1.06 s**, LCP **1.24 s**, TBT **12 ms**, CLS **0**.
- Final bundle sizes: JavaScript 44,431 bytes / 14.57 kB gzip; CSS 17,384 bytes / 4.74 kB gzip; mobile AVIF hero 24,573 bytes. No third-party runtime requests or font downloads were introduced.

## Deploy and live verification

- Deployed via `/opt/fleet/lib/deploy-static.sh self-study-checkpoints /work/repo/dist`; Azure deployment id `33e5f35d-19dc-48e6-9d85-dbcf1461fd48` completed successfully and the custom domain returned HTTPS 200.
- All 18 public files in `dist/` matched the live deployment byte-for-byte. `staticwebapp.config.json` is deployment configuration and is not a public artifact.
- Live response policy includes HSTS, `X-Content-Type-Options: nosniff`, strict referrer policy, restrictive permissions policy, and the self-only CSP with response-header `frame-ancestors 'none'`.
- A live Playwright/Axe pass checked `/`, `/demo`, `/privacy`, `/terms`, and `/404` at 1440px and 390px: every route had one `h1` and one `main`, no console/page errors, and zero serious or critical violations.
- The live exact malformed value `?review=%25bad` and truncated value `?review=eyJraW5kIjoi` both rendered the recovery notice with no browser errors. A fresh service-worker-controlled live `/demo` also reloaded offline with the sample heading and persistent demo banner.

## Known gaps

None. This remains the same local-first static-web artifact with no server-side state, authentication, analytics, payment, or AI integration.

## Recheck

```sh
npm ci
npm test
npm run build
/opt/fleet/lib/deploy-static.sh self-study-checkpoints /work/repo/dist
```
