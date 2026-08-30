# Independent verification 3 — FAIL

**Candidate:** `b75910eaedbd7ac026eee736921b83292f057499` (`b75910e`)  
**Live URL:** <https://self-study-checkpoints.sociobot.in/>  
**Tested:** 2026-08-30 UTC

## Verdict

**FAIL.** The deployed files match a fresh build of this candidate and the functional, privacy, offline, responsive, keyboard, and accessibility checks pass. The mandatory first-screen rule fails at a standard desktop viewport.

### P1 — first desktop screen omits the required first action

At a cold 1440 x 900 visit, the landing page clearly says what it does ("Build proof of your self-study progress") and who it is for (independent math and computer-science learners). Its required **Try it with sample data** CTA begins at y=918.45px and ends at y=966.45px: it is below the first viewport. The only related visible item is an ambiguous `Demo` navigation link.

The acceptance contract requires the first screen to state what to click first in plain words and to expose a one-click **Try it with sample data** demo. The CTA is visible on 390 x 844 (y=490px), but the cold desktop screen nevertheless fails the explicit requirement. Move the CTA above the 1440 x 900 fold (or reduce/reflow the hero) and add a desktop cold-load visibility regression.

## Claims and local gates

After clean `npm ci` (60 packages, 0 vulnerabilities), every exact command declared in `.factory/claims.json` passed:

| Claim | Result |
| --- | --- |
| `workspace-planning` | PASS — starts at `/demo`; completes checkpoint/evidence flow. |
| `human-review` | PASS — demo request, separate reviewer response, checksum import. |
| `sealed-packet` | PASS — P-256 seal export and browser verification. |
| `free-no-account` | PASS — demo has no credentials/auth/payment origin. |
| `offline-reload` | PASS — controlled demo reloads offline. |
| `demo-sandbox` | PASS — sample reset leaves real-storage sentinel intact. |
| `local-only` | PASS — demo request log is same-origin only. |

`npm test` passed (8 Vitest, 20 Playwright; `test-results/.last-run.json` records `passed`). `npm run build` passed and produced `dist/`. Fresh application JS is 41,855 B / 13,920 B gzip; CSS is 17,235 B / 4,690 B gzip.

## Live evidence

- Live bytes match fresh `dist/` for the app shell, JS, CSS, service worker, 404 assets, hero images, and social card: index `04cbce29…`, JS `74457412…`, CSS `a75976f9…`, SW `a7fb6660…`.
- A fresh `/demo` journey added evidence; copied a `/demo?review=…` link; completed/downloaded a human review response; imported it with the visible checksum confirmation; exported a completion packet; and verified its integrity seal. Requests stayed solely on `https://self-study-checkpoints.sociobot.in`; no console or page errors occurred.
- A 41-day target immediately gives the 42–84 day error and `aria-invalid=true`. Malformed reviewer JSON gives the actionable recovery message.
- The live service worker controls `/demo`, `registration.update()` produces an active worker, and 390px `/demo` reloads offline with the sample/banner. Reduced motion has `0.00001s` transition/animation durations.
- At 390 x 844, all visible interactive controls on `/`, `/demo`, every demo step, `/privacy`, `/terms`, and `/404` are at least 44 x 44 CSS px; there is no horizontal overflow. Tab reaches the skip link, its focus outline is `rgb(162, 44, 37) solid 3px`, and Enter moves focus to `#main`.
- Axe found zero serious/critical violations on `/`, `/demo`, `/privacy`, `/terms`, and `/404` at desktop and 390px. Each has one h1 and main landmark. `/opt/fleet/lib/verify-url.sh` passed live `/demo` (200; title, `lang=en`, h1, main, alt, labelled buttons; no errors).
- `/`, `/demo`, `/privacy`, `/terms`, and `/404` return 200; an unknown path serves the designed 404 with HTTP 404. HSTS, nosniff, strict referrer policy, permissions policy, and self-only CSP are present. Hashed JS/CSS are immutable for one year; documents/service worker use short revalidation.

There are no server endpoints or sign-in flows, so rate-limit and identity-provider checks do not apply. Lighthouse was not present in the clean image and was not installed solely for verification; bundle, responsive, semantic, and Axe checks above were completed.
