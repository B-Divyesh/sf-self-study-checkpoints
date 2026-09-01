# Independent verification 5 — PASS

**Candidate:** `d10e9b3d278492e97a169fb7bea8550f55cfb53d` (`d10e9b3`)

**Live URL:** <https://self-study-checkpoints.sociobot.in/>

**Tested:** 2026-09-01 UTC

## Verdict

**PASS.** The deployed static application matches a fresh production build of the candidate. It fulfils the researched job: an independent math or computer-science learner can define a 6–12 week checkpoint, link problem work and evidence, choose a human reviewer and rubric, receive a checksum-checked reviewer response, and export and verify an ECDSA P-256 integrity-sealed completion packet. The application clearly labels reviewer feedback as non-accredited and states that it does not provide teaching, automated proof grading, proctoring, identity verification, or credentials.

Defects by severity: P0 0, P1 0, P2 0, P3 0.

## Mandatory first read

A cold browser visit at 1440 × 900 and 390 × 844 answered the required questions in plain words:

- **What it does:** “Plan a self-study checkpoint for review.”
- **For whom:** independent math and computer-science learners who want feedback without enrolling in a course.
- **What to click first:** “Try it with sample data.”

The sample action was fully visible without scrolling: desktop `top 708.625`, `bottom 756.625` within a 900px viewport; mobile `top 490`, `bottom 538` within an 844px viewport. It opens `/demo`, immediately shows Maya Chen’s finite-groups plan, and retains the “Demo — sample data, nothing is saved” banner with Reset demo and Start for real controls.

## Claims run first from the demo entry point

From the clean candidate checkout, `npm ci` installed 60 packages and reported 0 vulnerabilities. Every literal command in `.factory/claims.json` passed before the general test suite:

| Claim | Result | Observable result |
| --- | --- | --- |
| `workspace-planning` | PASS | `/demo` exposes a 56-day sample with linked problems, success criteria, rubric, reviewer, and evidence. |
| `human-review` | PASS | A review request is exported, a reviewer response is completed, and its checksum is accepted on import. |
| `sealed-packet` | PASS | A completion packet is exported with an ECDSA P-256 seal and verifies in the browser. |
| `free-no-account` | PASS | Demo opens and can be edited without credentials, payment, or authentication requests. |
| `offline-reload` | PASS | A service-worker-controlled `/demo` reloads with the sample while offline. |
| `demo-sandbox` | PASS | Reset restores the bundled sample and leaves a real-storage sentinel unchanged. |
| `local-only` | PASS | The demo request log contains only the local site origin. |
| `local-autosave` | PASS | A real-workspace edit remains after reload. |
| `scope-limits` | PASS | Landing, demo, terms, and README state the product limits consistently. |
| `non-accredited-review` | PASS | Builder and reviewer screens state that the reviewer decides and the review is not accredited. |
| `no-tracking` | PASS | Loaded resources and the demo flow remain same-origin with no tracking resource. |
| `multiple-local-plans` | PASS | Two real-workspace plans persist locally after reload. |
| `review-request-options` | PASS | The product creates both a review link and portable JSON request. |
| `review-link-disclosure` | PASS | Sharing controls and privacy copy state that anyone with the link can read the checkpoint. |

## Local quality gates

- `npm test`: **PASS** — 8 Vitest checks and 54 Playwright checks passed.
- `npm run build`: **PASS** — TypeScript checking and Vite production build completed and created `dist/`.
- Initial application JavaScript: 44,312 B / 14.49 kB gzip. CSS: 17,384 B / 4.74 kB gzip. Both are within the applicable 200 kB JavaScript and 50 kB CSS budgets.
- The repository has no separate lint command; the production build performs the available TypeScript check.

## Independent live product QA

- Full sample flow: opened `/demo`, added the missing evidence, created a same-origin `/demo?review=…` reviewer link, completed a reviewer response, imported it, sealed a packet, and obtained `Seal valid: “Finite groups checkpoint” has not changed since export.` No console or page errors occurred.
- Boundary and recovery: changing a target to 41 days immediately displayed `41 days — set a target between 42 and 84 days.`, the explicit 42–84-day error, and `aria-invalid="true"`. Malformed reviewer JSON displayed an actionable plain-language recovery message.
- Demo separation: the declared demo checks passed; the live sample banner remained present during the journey and its review URL stayed in `/demo`.
- Privacy: Playwright request logs for normal `/`, `/demo`, `/privacy`, and `/terms` visits and the full live demo journey contained only `https://self-study-checkpoints.sociobot.in`. There were no third-party fonts, scripts, analytics, authentication, or payment requests.
- Offline: after an online visit and reload, the live service worker was active and controlled `/demo`; a 390px offline reload retained the sample heading and demo banner.
- Desktop and 390px mobile: no horizontal overflow was found. All visible links, buttons, inputs, textareas, and selects on `/`, `/demo`, `/privacy`, `/terms`, the application 404, each demo step, and reviewer screen measured at least 44 × 44 CSS px.
- Keyboard: Tab reaches the visible “Skip to main content” link; Enter moves focus to `#main`. The visible focus outline is `rgb(162, 44, 37) solid 3px`.
- Reduced motion: with `prefers-reduced-motion: reduce`, the checked transition duration was `1e-05s`.
- Accessibility: `@axe-core/playwright` 4.10.2 reported zero serious or critical findings on `/`, `/demo`, `/privacy`, `/terms`, and the application 404 at desktop and 390px. Each checked route has one `h1`, a `main` landmark, and no horizontal overflow.
- `/opt/fleet/lib/verify-url.sh https://self-study-checkpoints.sociobot.in/demo /tmp/self-study-checkpoints-verify-5`: **PASS** — 200 response in 563 ms, title, `lang=en`, one h1, main, image alt text, labelled buttons, and no browser console/page errors.

## Deployment, headers, and caching

Fresh local and live SHA-256 values are byte-identical:

| File | SHA-256 |
| --- | --- |
| `index.html` | `890b6b05500d551a98277d870e686ab2bd8713e935cb73ecebc3845d74423dc1` |
| `bundles/index-DRli0Tmd.js` | `a4fc7d7c97d7c2b485e7e3053a3ea96a4b8efcd61e0eee5167fba33633f54e55` |
| `bundles/index-BmIDspTQ.css` | `ba6c2b06c436335b173b6a5668a0c79701636ee51a30e23e1043a1e79bdb5ded` |

`/`, `/demo`, `/privacy`, and `/terms` return 200; an unknown path returns the designed 404 with HTTP 404. Live document headers include HSTS, `X-Content-Type-Options: nosniff`, strict referrer policy, restrictive permissions policy, and a self-only Content-Security-Policy delivered as a response header. Hashed JS and CSS use `Cache-Control: public, max-age=31536000, immutable`; documents and `sw.js` use short revalidation caching.

This static product has no server-side endpoints, sign-in, payment, or rate-limited API allowance. Those checks are not applicable.

## Known limits

The local-first model does not synchronise plans. A review URL intentionally contains the selected checkpoint for the recipient, and the privacy page explains that it should be shared only with the chosen reviewer. A packet seal detects subsequent changes; it does not prove identity, authorship, mastery, or institutional approval.
