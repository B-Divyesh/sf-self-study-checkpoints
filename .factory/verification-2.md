# Independent verification 2 — FAIL

**Candidate:** `7baa370abbb2c27e18c470ed0669e3ab2a556a38` (`7baa370`)

**Live URL:** <https://self-study-checkpoints.sociobot.in/> (tested 2026-08-30 UTC)

## Verdict

**FAIL.** The deployed static artifact exactly matches this candidate and its core checkpoint → human-review → sealed-packet flow works. Two acceptance-contract defects remain: mobile touch targets fall below 44 × 44 CSS px, and three claim tests bypass the mandatory demo sandbox.

## First-read result

Cold-loading the live home page answers all required questions in plain words. It says it helps learners “Build proof of your self-study progress,” identifies independent math and CS learners, and presents **Try it with sample data** on the first screen. That action opens `/demo` with Maya Chen’s finite-groups checkpoint and the persistent “Demo — sample data, nothing is saved” banner.

## Claims and local quality gates

The repository contains `.factory/claims.json` with all seven required claims. Before installing dependencies, the literal first declared command could not load `@playwright/test`, as expected in a dependency-free clone. After the required `npm ci` (60 packages, 0 vulnerabilities), every declared claim command passed against the built application:

| Claim | Result | Evidence |
| --- | --- | --- |
| `workspace-planning` | PASS | Owner can create a 42–84 day checkpoint with problem, criteria, reviewer, and evidence. |
| `human-review` | PASS | Request export, reviewer attestation/download, checksum-verified owner import. |
| `sealed-packet` | PASS | P-256 packet export and browser seal verification. |
| `free-no-account` | PASS | No credentials, payment, auth, or external origin in demo flow. |
| `offline-reload` | PASS | Dedicated fresh context reloads `/demo` offline after service-worker control. |
| `demo-sandbox` | PASS | Reset restores Maya sample; a seeded real-storage sentinel remains unchanged; no `demo:` local-storage keys. |
| `local-only` | PASS | Recorded navigation/edit traffic remains same-origin. |

`npm test` passed: 8 Vitest checks and 18 Playwright checks. `npm run build` passed and produced `dist/`.

Fresh build payload: application JS 41,836 B (13,900 B gzip) and CSS 17,040 B (4,680 B gzip), within the static-product budgets.

## Live functional and non-functional checks

- Byte-for-byte deployment comparison passed: local/live SHA-256 values match for `index.html` (`74ac20cf…`), JS (`4f8d180e…`), CSS (`929205db…`), and `sw.js` (`a7fb6660…`).
- A live desktop journey created a valid 56-day checkpoint, linked a problem and evidence, generated a review request, completed a reviewer response, imported it, exported a packet, and verified its integrity seal. The reviewer URL remains same-origin.
- Boundary/recovery: a 41-day target immediately shows the 42–84-day error and `aria-invalid`; malformed reviewer JSON remains in-app with an actionable error in the automated regression; packet sealing requires the completed review/evidence path.
- Live `/demo` reset restored its sample and did not create real storage. Recorded requests during the full flow used only `https://self-study-checkpoints.sociobot.in`.
- The live service worker controls `/demo`, `registration.update()` completes, and a 390px context reloads `/demo` offline with its sample heading and banner. Reduced motion yields a `0.00001s` transition duration.
- Keyboard: the first Tab reaches the skip link and Enter moves focus to `#main`. At 390px there is no horizontal overflow; 200% text-zoom smoke test retained the heading and demo banner.
- Playwright Axe 4.10.2 found zero serious/critical findings on `/`, `/demo`, `/privacy`, `/terms`, and `/404` at desktop and 390px. `/opt/fleet/lib/verify-url.sh` passed when invoked with its required evidence-directory argument: HTTPS 200, title, `lang=en`, one h1, main landmark, image alts, button labels, and no console/page errors.
- All discovered internal navigation destinations (`/`, `/demo`, `/privacy`, `/terms`) return 200. An unknown path returns the designed 404 with HTTP 404.
- Headers are appropriate: HTTPS, HSTS, `nosniff`, strict referrer policy, restrictive permissions policy, CSP with `default-src 'self'` and `connect-src 'self'`; document/service worker cache for five minutes, and hashed `/bundles/*` assets use `public, max-age=31536000, immutable`.
- Fresh mobile Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.3 s, TBT 50 ms, CLS 0. Lighthouse emitted a final Chrome target-crash warning after producing the complete report; the scores and metrics above are from that written report.

## Defects

### P2 — Interactive links miss the 44 × 44px mobile target requirement

At 390 × 844 on live `/demo`, measured rendered targets include the home wordmark at **36 × 36px**, and footer Privacy, Terms, and Source links at **49 × 25px**, **40 × 25px**, and **44 × 25px**. The product contract and accessibility/design instructions require every touch target to be at least 44 × 44px. The wordmark rule in `src/styles.css` has only a 36px SVG and no minimum target; plain footer links lack a minimum height/padding rule.

Fix by giving the wordmark and footer links a 44px minimum hit box while preserving their visible design, then add a 390px regression that measures target rectangles.

### P2 — Three claims are not tested through the isolated demo entry point

The `workspace-planning`, `human-review`, and `sealed-packet` tagged test starts at `/` in `tests/e2e/app.spec.ts`, not `/demo`. This bypasses the explicit demo-sandbox contract for claim verification and writes to the ordinary local-storage namespace during the test. The test’s disposable browser context limits practical impact, but it does not demonstrate the mandatory sample sandbox.

Rework those tagged claim tests to begin at `/demo` and perform the same observable owner/reviewer/packet flow there, or provide a separate demo-only setup that seeds the required sample state. Keep exactly one tagged observable test per claim.

## Retest focus

After repairs: run `npm ci`, every exact command in `.factory/claims.json`, `npm test`, and `npm run build`; test all interactive rectangles at 390px; repeat the live demo owner → reviewer → packet flow, offline reload, request-origin log, and artifact hash comparison.
