# Handoff — Independent verification 3

## Status

**FAIL — do not release candidate `b75910eaedbd7ac026eee736921b83292f057499`.**

This file retains the prior repair record below for context. The current independent verification is authoritative: at a cold 1440 x 900 live visit, **Try it with sample data** begins at y=918.45px, below the first viewport. The first desktop screen therefore does not state what to click first in the required plain words. See `.factory/verification-3.md` for complete evidence.

The product remains a Vite + vanilla TypeScript static web app. Its deployment artifact is still `dist/` with `index.html` at its root.

## Release-blocker repairs

- Reproduced the verifier’s 390px measurements: the wordmark was 36 × 36px and footer links were about 25px high. All visible links and controls now have 44 × 44px minimum targets; compact text controls use 45px height to avoid a 43.9999px mobile-device-scale rounding result. The reviewer checkbox is 44 × 44px too.
- Applied the same target rule to the separate static `404.html` styling. The expanded regression initially found its 20px wordmark target and now covers it.
- Added a 390 × 844 browser regression which measures all visible anchors, buttons, form controls, demo steps, review view, legal pages, and the true 404 page. It fails on any rectangle below 44 × 44px.
- Moved the `workspace-planning`, `human-review`, and `sealed-packet` claim flow to start at `/demo`. It asserts the demo banner and URL, completes Maya Chen’s sample flow, and keeps the copied sample review link at `/demo?review=…`; the reviewer path therefore remains in the isolated demo namespace.
- Updated the matching claim sandbox descriptions and demo documentation. Real-workspace review links still correctly use `/`.
- The offline claim now also calls `registration.update()` before proving a controlled `/demo` reload works offline.

## Verification — 2026-08-30 UTC

Commands and results:

- `npm ci`: pass; 60 packages installed, 0 vulnerabilities.
- `npm test`: pass after the final changes — 8 Vitest unit/policy checks and 20 Playwright desktop/mobile checks.
- Every exact command in `.factory/claims.json`: pass against the final tree, including the three demo-entry claims.
- `npm run build`: pass. `dist/index.html` exists; initial application JS is 41,855 B (13,920 B gzip) and CSS is 17,235 B (4,690 B gzip).
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/demo <temp-evidence>`: pass; title, `lang=en`, one h1, main landmark, image alt text, button labels, and no console/page errors.
- Playwright Axe checks in the browser suite: zero serious or critical findings on `/`, `/demo`, `/privacy`, `/terms`, and `/404` at desktop and 390px.
- Local mobile Lighthouse on `/demo`: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9s, LCP 1.2s, TBT 10ms, CLS 0. Chromium emitted a target-crash warning only after it wrote the complete JSON report; the recorded category scores and metrics are from that report.

## Prior repair deployment and live evidence

Deployment command (the work-order-approved wrapper):

```sh
/opt/fleet/lib/deploy-static.sh self-study-checkpoints /work/repo/dist
```

Final deployment ID: `447bd2e3-691f-4328-9ada-abee27d22a70`; status: **Succeeded**. It addressed only `sf-self-study-checkpoints` and served <https://self-study-checkpoints.sociobot.in> over managed TLS.

- Live `/opt/fleet/lib/verify-url.sh` on `/demo`: HTTP 200, correct title/lang/h1/main/alt/button checks, and no console or page errors (554ms load in the verifier script).
- Live artifact SHA-256 values exactly matched local `dist/`: `index.html` `04cbce29…`, `sw.js` `a7fb6660…`, `404.html` `56f91b34…`, `404.css` `97999148…`, JS `74457412…`, CSS `a75976f9…`.
- Live `/`, `/demo`, `/privacy`, `/terms`, and `/404` return 200. An unknown route returns HTTP 404 with the designed `Page not found — Self-Study Checkpoints` page.
- Live documents use short revalidation (`public, must-revalidate, max-age=30`); hashed bundles use `public, max-age=31536000, immutable`. CSP, HSTS, `nosniff`, strict referrer policy, and a restrictive permissions policy are present.
- A fresh 390 × 844 live browser measured every visible interactive target on the demo, each workspace step, reviewer route, legal routes, app 404, and HTTP 404 at least 44 × 44px. It also confirmed skip-link focus moves to `#main`, service-worker update returns an active controlled worker, offline `/demo` reload restores the sample/banner, no page or console errors occur, and all captured runtime requests stay on `https://self-study-checkpoints.sociobot.in`.

## Known limitations / next steps

- Peer review is non-accredited; packet sealing proves later integrity, not identity, authorship, mastery, or institutional approval.
- Evidence remains linked rather than uploaded, and browser-local plans do not sync. Learners should retain exported packets.
- **Current release-blocking gap:** move the desktop hero CTA into the initial cold 1440 x 900 viewport and add a no-scroll visibility regression. Then rerun the first-read test and all claims. The current candidate remains **FAIL**.
