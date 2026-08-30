# Independent verification 4 — PASS

**Candidate:** `1670c889901e3150ab15bcdd076831a3b6b28e5c` (`1670c88`)  
**Live URL:** <https://self-study-checkpoints.sociobot.in/>  
**Tested:** 2026-08-30 UTC

## Verdict

**PASS.** The deployed static application matches the specified candidate byte-for-byte for its JavaScript and CSS bundles. It fulfils the researched job: an independent math or computer-science learner can define a 6–12 week checkpoint, link problem work and evidence, set a human rubric/reviewer, obtain a checksum-protected review response, and export and verify an ECDSA P-256 integrity-sealed completion packet. It labels review as non-accredited and does not claim automated proof grading, proctoring, or credentials.

There are **no defects by severity**: P0 0, P1 0, P2 0, P3 0. No server endpoints, authentication flows, payment flows, or rate-limited API allowances exist in this static product, so those checks are not applicable.

## Mandatory first read

A cold live desktop visit says, in plain words, **“Build proof of your self-study progress.”** It names **independent math and computer-science learners** as the audience, and presents **“Try it with sample data”** as the first primary action. The three accompanying facts say it is free, local to the device, and human/non-accredited. The action opens `/demo` in one click and immediately presents Maya Chen’s finite-groups checkpoint with the persistent **“Demo — sample data, nothing is saved”** banner.

The repaired CTA is fully visible without scrolling: at 1440 × 900 it was `top 708.625`, `bottom 756.625`; at 390 × 844 it was `top 490`, `bottom 538`. Neither viewport horizontally overflows.

## Claims: run first from the demo entry point

After clean `npm ci` (60 packages installed, 0 reported vulnerabilities), every literal command in `.factory/claims.json` passed, each against the local demo entry point:

| Claim | Result and observed outcome |
| --- | --- |
| `workspace-planning` | PASS — `/demo` completed Maya’s plan with problems and evidence. |
| `human-review` | PASS — exported review request, completed a separate reviewer response, and imported its verified checksum. |
| `sealed-packet` | PASS — exported an ECDSA P-256 packet and verified its seal in-browser. |
| `free-no-account` | PASS — demo required no credentials and contacted no auth/payment origin. |
| `offline-reload` | PASS — controlled service worker reloaded the demo offline. |
| `demo-sandbox` | PASS — reset demo did not change the real-storage sentinel and left no `demo:` keys. |
| `local-only` | PASS — whole demo flow request log contained only the local origin. |

## Local build and product QA

- `npm test`: PASS — 8 Vitest checks and 22 Playwright desktop/mobile checks; `test-results/.last-run.json` reports `passed`.
- `npm run build`: PASS. `dist/` was produced. Initial JavaScript is 41,855 B / **13,927 B gzip**, and CSS is 17,383 B / **4,749 B gzip**, comfortably within the 200 KB JS and 50 KB CSS budgets.
- Representative end-to-end owner/reviewer/packet flow was covered by the claim tests. The invalid 41-day target immediately reports “Choose a target 6–12 weeks (42–84 days) after the start.” and sets `aria-invalid=true`; malformed reviewer JSON has an actionable recovery message in the browser suite.
- Keyboard: Tab reaches the skip link and Enter moves focus to `#main`. The designed focus ring is present. At 390px every sampled visible interactive control on the live demo was at least 44 × 44 CSS px.
- Motion: with `prefers-reduced-motion: reduce`, live sheet animation and transition durations are `1e-05s` and document scrolling is `auto`.
- Accessibility: Playwright Axe found zero serious or critical findings on live `/`, `/demo`, `/privacy`, `/terms`, and an unknown-route 404. Each applicable app route exposes one `h1` and `main`.
- `/opt/fleet/lib/verify-url.sh https://self-study-checkpoints.sociobot.in/demo` passed: 200 in 590 ms, title, `lang=en`, one h1, main, image alt text, labelled buttons, and no console/page errors.

## Privacy, deployment, and delivery evidence

- Browser request logging during a live `/demo` journey (editing and navigating all planning steps) recorded only `https://self-study-checkpoints.sociobot.in`. There were no console or page errors. The privacy promise is therefore consistent with observed browser traffic; no third-party fonts, scripts, analytics, auth, or payment requests were observed.
- The service worker controlled the live demo and, after its initial online visit/reload, the demo reloaded offline with its expected heading.
- Live deployed bundle SHA-256 values equal the fresh candidate build exactly: JS `7445741226d782d5127c466897016bb319b63d131f7e96a0fe3476b4b8563ee0`; CSS `f275753801741883bb0bfc0d5c8a1aa8ad33d0a1eb120022f3e4c01f58b12b74`.
- Live documents have short revalidation caching; the hashed JS bundle has `public, max-age=31536000, immutable`. Live headers include HSTS, `X-Content-Type-Options: nosniff`, strict referrer policy, restrictive permissions policy, and a self-only CSP with `frame-ancestors 'none'` delivered as a response header.
- `/`, `/demo`, `/privacy`, and `/terms` returned 200; an unknown path returned the designed response with HTTP 404. The public Source link returned 200.

## Known limits (intentional, disclosed)

The tool is local-first and does not sync data. A possession-based review URL intentionally includes the requested review data, and the privacy page explains that it should be shared only with the chosen reviewer. A packet seal detects later changes; it does not attest identity, authorship, mastery, or accreditation.
