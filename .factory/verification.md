# Independent verification — FAIL

**Candidate:** `1048df4c6fff0b647b7cb9d3f1ca5457121e2282` (`1048df4`)

**Live URL:** <https://self-study-checkpoints.sociobot.in/> (tested 2026-08-28 UTC)

**Verdict:** **FAIL**. The deployed artifact is exactly the candidate build and the central owner → reviewer → sealed-packet flow works, but the candidate does not meet the supplied performance and accessibility acceptance requirements. The defects below must be resolved and independently re-verified.

## Reproduction and checks

- Started from a clean worktree at the candidate SHA. `npm ci` completed with 0 audit vulnerabilities.
- `npm test` passed: 4 Vitest unit tests and 6 Playwright browser tests (desktop and 390 × 844 mobile).
- `npm run test:unit` passed again (4/4). `npm run build` passed (`tsc --noEmit && vite build`) and produced `dist/`.
- Built payload: JS 36,912 B / 12,430 B gzip; CSS 16,043 B / 4,500 B gzip. This is inside the 200 KB / 50 KB static-product budgets. Hero variants are 24.6–149.0 KB.
- Independently exercised the live normal flow covered by the browser suite: create scope, problems, rubric/reviewer, evidence; create a review request; reviewer completes attestation and downloads response; owner imports checksum-verified response; owner exports P-256-sealed packet; packet verifies.
- Boundary/recovery checks: 41-day date is rejected on request sharing (and renders “41 days — set a target between 42 and 84 days” after rerender); malformed review JSON and malformed review-link input remain in-app and surface an error; packet export is disabled until plan, evidence, and attested review are present.
- `@axe-core/playwright` 4.10.2 found 0 serious or critical violations on 1280px desktop and 390px mobile. Fresh page/console error capture was empty. `/opt/fleet/lib/verify-url.sh` also passed: HTTPS 200, title, `lang=en`, one h1, main landmark, no missing image alts or unlabeled buttons, no console/page errors.
- Keyboard smoke test reached the visible skip link; native controls were keyboard-operable. Reduced-motion context reduces transitions to `0.01ms`. Mobile at 390px had no horizontal overflow. Fresh visual inspection at desktop and 390px found the supplied cassette-zine system intact and readable.
- Service worker registered and controlled the page. After one controlled online reload, an offline reload succeeded. The shell cache was `checkpoint-desk-v1`.
- No outbound runtime request was observed other than the site origin; source inspection confirms browser-local storage and no analytics, CDN fonts, or third-party scripts. Privacy/terms routes render and correctly disclose local storage and review-link disclosure.
- Live SHA comparison: `index.html`, `assets/index-ClaiVV5s.js`, `assets/index-BBRXzIJF.css`, and `sw.js` were byte-identical to local `dist/` (SHA-256 respectively `5559ca67…`, `c51c79f3…`, `f855bf84…`, `402a032b…`).
- Fresh mobile Lighthouse against live: Performance 100, Accessibility 100, FCP 1.0 s, LCP 1.2 s, TBT 90 ms, CLS 0.

## Defects

### P2 — hashed production assets are not immutable cached

The live JS, CSS, service worker, manifest, and document all return `Cache-Control: public, must-revalidate, max-age=30`. For example, `GET /assets/index-ClaiVV5s.js` returned that header on 2026-08-28 UTC. The acceptance contract requires long-lived immutable caching for hashed static assets. Configure asset-route cache headers such as `public, max-age=31536000, immutable` while retaining a short policy for HTML/service-worker update checks.

### P2 — skip link does not transfer keyboard focus to main content

At 390px and desktop, Tab exposes the “Skip to main content” link. Pressing Enter changes the fragment but leaves `document.activeElement.id` empty; `#main` is not focusable (`tabindex="-1"` is absent). A keyboard user then continues from the header instead of the start of main content. Make the main destination programmatically focusable and move focus on skip activation.

### P2 — date-window feedback is stale while editing

The scope screen initially shows a 56-day default. Changing Target date to a 41-day value saves the value but leaves the visible duration note at “56 days” until the user changes steps and returns. The 41-day invalid state is then rendered and sharing is blocked. The state is validated eventually, but the task-critical window feedback is not immediate as required. Re-render/update the duration and target-date validation on date input/change.

### P3 — malformed JSON recovery message is implementation jargon

Importing `{not json` safely keeps the app running, but the notice is the raw parser string (`Expected property name or '}' in JSON at position 1...`). Replace it with an actionable product error, for example “This file is not valid JSON. Choose the reviewer response file you downloaded, then try again.”

### P3 — response-policy hardening is incomplete

Live responses include HSTS, nosniff, referrer policy, and a restrictive camera/microphone/geolocation permissions policy, which is good. They do not include a Content-Security-Policy. Add an appropriately tested CSP for this self-contained static app.

## Retest focus

After correcting the P2 defects, rerun the clean install/test/build sequence, keyboard skip-link check, date feedback check, cache-header curl check, and live artifact comparison. Reconfirm the PWA offline reload after the service-worker cache-policy change.
