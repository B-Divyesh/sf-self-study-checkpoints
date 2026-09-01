# Independent verification 6 — FAIL

**Candidate:** `9e8c8e3fcd0eb298fee2627a53c0c852cd2be63e`

**Live URL:** <https://self-study-checkpoints.sociobot.in/>

**Tested:** 1 September 2026 UTC

## Verdict

**FAIL.** The deployed static application matches the candidate and the complete learner → reviewer → completion-packet workflow works. All 16 declared claim checks, the full local test suite, the production build, accessibility checks, privacy checks, offline reload, and performance budgets pass. One P2 recovery defect remains: a damaged review URL displays a browser decoding message instead of telling the reviewer what happened and how to continue.

Defects by severity: P0 0, P1 0, P2 1, P3 0.

## Mandatory first read

Confirmed from a fresh desktop context at 1440 × 900 without scrolling:

- **What it does:** “Plan a self-study checkpoint for review.”
- **For whom:** independent math and computer-science learners who want feedback without enrolling in a course.
- **What to click first:** “Try it with sample data.”

The sample action was visible at `top 709`, opened the populated demo in one click, and the three first-screen facts stated that the product is free, stores plans on the device, and provides non-accredited reviewer feedback. Evidence: [`evidence/verification-6/first-read-desktop.png`](evidence/verification-6/first-read-desktop.png).

## Claims checked first

From the clean candidate checkout, `npm ci` installed 60 packages and reported 0 vulnerabilities. Every literal command in `.factory/claims.json` then passed before the general suite:

| Claim | Result | Confirmed outcome |
| --- | --- | --- |
| `workspace-planning` | PASS | The 56-day sample includes the syllabus slice, linked problems, success criteria, rubric, reviewer, and evidence. |
| `human-review` | PASS | A review request and reviewer response export correctly, and the response checksum is accepted on import. |
| `sealed-packet` | PASS | A completion packet exports and its change check verifies in the browser. |
| `free-no-account` | PASS | The demo opens and accepts edits without credentials, payment, or authentication requests. |
| `offline-reload` | PASS | A dedicated service-worker-controlled demo context reloads offline. |
| `demo-sandbox` | PASS | Reset restores the sample without changing seeded real-workspace storage. |
| `local-only` | PASS | Demo requests remain on the product origin. |
| `local-autosave` | PASS | A real-workspace title remains after reload. |
| `scope-limits` | PASS | Landing, Terms, and README consistently state the product limits. |
| `non-accredited-review` | PASS | Builder and reviewer screens identify the human, non-accredited review. |
| `no-tracking` | PASS | The checked resource log contains no analytics or tracking request. |
| `multiple-local-plans` | PASS | Two plans remain in local storage after reload. |
| `review-request-options` | PASS | The product provides both a review URL and a JSON request. |
| `review-link-disclosure` | PASS | The sharing control and Privacy page explain who can read the URL. |
| `local-signing-key` | PASS | The private key remains in browser storage and is absent from the downloaded packet. |
| `artwork-provenance` | PASS | The footer statement matches the visual thesis and selected asset sidecar. |

Each claim id has one tagged test. Cross-checking the landing page and README found no unlisted product claim.

## Local gates

- `npm test`: **PASS** — 9 Vitest checks and 60 Playwright checks passed across desktop and 390px mobile.
- `npm run build`: **PASS** — includes `tsc --noEmit`; `dist/` was created.
- There is no separate lint script in `package.json`.
- Initial application JavaScript: 44,486 bytes / 14.56 kB gzip. CSS: 17,384 bytes / 4.74 kB gzip.
- The initial JavaScript and CSS are within the 200 kB and 50 kB budgets. There are no downloaded fonts. The selected mobile hero is 24,573 bytes.

## End-to-end and recovery checks

Confirmed independently on the live site:

- The demo opened with Maya Chen’s finite-groups checkpoint and the persistent sample-data banner.
- The learner added the missing evidence, produced a demo-only review URL, and opened it in a separate reviewer page.
- The reviewer scored the rubric, entered feedback, confirmed the non-accredited attestation, and downloaded the response.
- The learner imported the response with checksum confirmation, exported the completion packet, and received `Packet check valid: “Finite groups checkpoint” has not changed since export.`
- The downloaded packet did not contain `privateJwk`.
- The 42-day and 84-day boundaries were accepted. The 41-day and 85-day values immediately showed the 42–84-day error and `aria-invalid="true"`.
- Packet export remained disabled before the required plan, evidence, and reviewer response were complete.
- Invalid review-request, reviewer-response, and completion-packet JSON produced plain recovery instructions. A wrong packet kind produced “That file is not a completion packet.”
- Deleting a checkpoint required confirmation; Undo restored the exact title.
- Resetting a demo edit restored the bundled sample, preserved a real-storage sentinel, and created no `demo:` keys.

The damaged review-URL result is the P2 finding below. Evidence for the successful flow: [`evidence/verification-6/live-packet-valid-desktop.png`](evidence/verification-6/live-packet-valid-desktop.png).

## Accessibility, mobile, routes, and links

- `/`, `/demo`, `/privacy`, `/terms`, and an unknown-route 404 were checked at 1440 × 900 and 390 × 844.
- Each checked page has `lang=en`, one `h1`, one `main`, a route-specific title, and no normal-viewport horizontal overflow.
- Axe 4.10.2 reported zero serious or critical findings on all ten viewport/route combinations.
- All checked mobile links, buttons, inputs, textareas, and selects measured at least 44 × 44 CSS pixels.
- Tab focused “Skip to main content” with a `rgb(162, 44, 37) solid 3px` outline; Enter moved focus to `#main`.
- Internal Privacy navigation focused its `h1` and announced “Privacy page.” Browser Back restored and announced the landing page.
- Reduced-motion mode set the checked transition and animation duration to `0.00001s` and scrolling to `auto`.
- At 200% text size, key content and controls remained present and operable.
- All discovered normal navigation destinations, including the GitHub source destination, returned 200. An unknown route returned the designed HTTP 404.
- `/opt/fleet/lib/verify-url.sh` passed the live demo: HTTP 200, title, language, one `h1`, `main`, image alternatives, labelled buttons, and no console/page errors. Evidence: [`evidence/verification-6/verify-url/verify.json`](evidence/verification-6/verify-url/verify.json) and [`evidence/verification-6/live-demo-mobile.png`](evidence/verification-6/live-demo-mobile.png).

## Privacy, headers, caching, and offline behavior

- The complete live demo and reviewer journey made 24 requests, all to `https://self-study-checkpoints.sociobot.in`; no third-party fonts, scripts, analytics, authentication, or payment requests were observed.
- No failed response, browser console error, or page error occurred in the successful journey.
- Response headers include HSTS, `X-Content-Type-Options: nosniff`, strict referrer policy, restrictive permissions policy, and a self-only CSP with `frame-ancestors 'none'` delivered as a response header.
- Hashed JavaScript and CSS use `Cache-Control: public, max-age=31536000, immutable`. The document and service worker use short revalidation policies.
- The service worker update completed with an active worker. After an online controlled reload, `/demo` reloaded offline at 390px with its title, sample heading, and demo banner. The observed cache was `checkpoint-desk-v3`.
- This static product has no server-side API, sign-in, payment, or request allowance. API rate-limit and identity-provider checks are not applicable.

## Deployment identity and performance

All 18 publicly served files from `dist/` matched the live deployment byte-for-byte; `staticwebapp.config.json` is deployment configuration rather than a public asset. Key SHA-256 values:

| File | SHA-256 |
| --- | --- |
| `index.html` | `5b1cc239834ac06cd1f11a686bd3e3b8e1c2f7dbb91b98304d43af8a26207652` |
| `bundles/index-BYS89DcG.js` | `69b6e504462aa6ba3765cee64491742559f5063f7c0d9133e9d1a7d2341bf216` |
| `bundles/index-BmIDspTQ.css` | `ba6c2b06c436335b173b6a5668a0c79701636ee51a30e23e1043a1e79bdb5ded` |
| `sw.js` | `a7fb6660a872bcc26c114950793c320883e04a07e168b013c512d84080fddc4e` |

Fresh live mobile Lighthouse results: Performance 96, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.1 s, TBT 240 ms, CLS 0. Total first-load transfer was 47,314 bytes, including 14,761 bytes of script, 4,966 bytes of CSS, and 24,694 bytes of image data. Evidence: [`evidence/verification-6/lighthouse-live.json`](evidence/verification-6/lighthouse-live.json).

The product-specific cassette/review-slip design matches `.factory/design.md`, uses original recorded artwork, and remains visually coherent on desktop and mobile. The brief does not need an AI action; the expected high-value portability is already covered by the review URL, JSON request/response, and completion-packet import/export.

## Defect

### P2 — damaged review URLs show browser internals and no recovery step

Open <https://self-study-checkpoints.sociobot.in/?review=%25bad> in a fresh context.

The application returns to the usable builder, but its notice says:

> Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.

This does not explain in product language that the review URL is incomplete or damaged, and it does not tell the reviewer to ask the learner for a fresh URL or use the downloaded review-request file. This conflicts with the required plain-language, actionable error behavior for a core reviewer handoff.

The cause is the `requestFromUrl()` catch path in `src/main.ts`, which exposes the decoder’s exception message. Replace it with a stable message such as: “This review link could not be read. Ask the learner for a new link or a review request file.” Add a browser check for a malformed and a truncated `review` value.

Evidence: [`evidence/verification-6/invalid-review-link.png`](evidence/verification-6/invalid-review-link.png).
