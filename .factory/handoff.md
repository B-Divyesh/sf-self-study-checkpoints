# Handoff — review 1

## Outcome

This work order performed a read-only first-round product review. No product code, deployment configuration, or assets were changed. The detailed review is in `.factory/review-1.md`.

**Status: FAIL.** The live product’s core workflow, one-click demo, listed claims, local quality gates, first screen, and visual identity were confirmed. Eleven findings remain in copy clarity, unlisted claims, route-change focus/announcement, direct HTTP 404 metadata and shell consistency, and mobile header spacing.

## Verification run

- Started from a clean dependency state with `npm ci`.
- Opened fresh live browser contexts before scrolling at 390 × 844 and 1440 × 900.
- Confirmed one-click `/demo`, realistic Maya Chen sample data, reset behavior, real-storage isolation, and same-origin demo requests.
- Ran every exact command in `.factory/claims.json`; all seven passed.
- Ran `npm test`; it passed (8 Vitest and 22 Playwright checks).
- Ran `npm run build`; it passed and produced `dist/`.
- Checked live routes, metadata, links, headers, static HTTP 404, keyboard focus, and mobile layout.

## Next steps

Address F-1-1 through F-1-11 in `.factory/review-1.md`, then repeat the complete review rather than a diff-only check. In particular, include direct HTTP-404 keyboard/metadata coverage and route-change focus/announcement coverage in the automated suite.

---

# Previous handoff — release repair 4

## Independent verification 4 — PASS

Candidate `1670c889901e3150ab15bcdd076831a3b6b28e5c` is **PASS** for release at <https://self-study-checkpoints.sociobot.in/>. On 2026-08-30 UTC, an independent clean-clone run passed every exact demo-backed claim command, `npm test` (8 Vitest + 22 Playwright checks), and `npm run build`. The live JS and CSS are byte-identical to that fresh build (`74457412…` and `f2757538…`).

The live first screen clearly states the job, audience, and first click; the required “Try it with sample data” CTA is above the fold at both 1440 × 900 and 390 × 844. Live same-origin request logging, service-worker offline reload, keyboard skip-link use, reduced-motion behavior, headers/caching, mobile target sizing, and Axe serious/critical scans passed with no console/page errors. No release-blocking defects were found. Full evidence is in `.factory/verification-4.md`.

## Status

**Deployed and verified.** This repair resolves the independent verifier's remaining P1 on candidate `b75910eaedbd7ac026eee736921b83292f057499`: the landing page's required sample action was outside a cold 1440 × 900 desktop viewport.

The artifact remains a Vite + vanilla TypeScript static web app. The deployment output remains `dist/` with `index.html` at its root.

## What changed

- Reproduced the verifier's cold-load failure at 1440 × 900 before changing code: `Try it with sample data` measured `top: 918.45px`, `bottom: 966.45px`, `scrollY: 0`, so it was below the 900px viewport.
- Reduced only the desktop hero copy's vertical padding, display-size ceiling, and lede spacing. The 390px stacked hero is unchanged.
- Added a browser regression for a cold 1440 × 900 load. It asserts the primary `/demo` action starts at scroll position zero and its complete bounding rectangle is inside the viewport.
- Extended the existing 390px 44 × 44px target regression to include the landing page, preserving coverage for the visible sample action as well as demo, reviewer, legal, and 404 routes.

## Verification — 2026-08-30 UTC

- `npm ci`: pass; 60 packages installed; 0 vulnerabilities.
- `npm test`: pass — 8 Vitest unit/response-policy tests and 22 Playwright desktop/mobile tests.
- Every literal command in `.factory/claims.json` passed individually: `workspace-planning`, `human-review`, `sealed-packet`, `free-no-account`, `offline-reload`, `demo-sandbox`, and `local-only`. The three complete owner/reviewer/packet claims start at `/demo` and keep the reviewer URL under `/demo?review=…`.
- `npm run build`: pass. `dist/index.html` exists. Initial JS is 41,855 B (13,920 B gzip); CSS is 17,383 B (4,740 B gzip). Responsive hero files remain 24.6–149.0 KB.
- Browser cold-load evidence after the repair: at 1440 × 900, the sample CTA is `top: 708.63px`, `bottom: 756.63px`, 48px high, fully visible, and `scrollY: 0`. At 390 × 844 it remains `top: 490px`, `bottom: 538px`, 48px high, fully visible, and `scrollY: 0`. Both runs had no console or page errors.
- Keyboard regression passes: Tab reaches the skip link and Enter moves focus to `#main`. The full 390px sweep finds no visible interactive target below 44 × 44 CSS px, including the landing CTA.
- Axe checks in Playwright report zero serious or critical violations on `/`, `/demo`, `/privacy`, `/terms`, and `/404` at desktop and 390px. `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/demo <evidence-dir>` passed (200, title, `lang=en`, one h1, main landmark, alt text, labelled buttons, no console/page errors).
- Local mobile Lighthouse on `/demo`: Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.2 s, TBT 100 ms, CLS 0.
- Privacy, offline, update, and response-policy coverage is exercised by the claim suite and static tests: requests stay same-origin; demo state never reads or overwrites real local storage; a controlled service worker reloads `/demo` offline after `registration.update()`; hashed bundles are configured immutable for one year while documents/service workers revalidate; CSP is self-only with `frame-ancestors` sent as a response header. There are no server endpoints, accounts, or identity-provider integrations, so rate-limit and live identity-provider checks do not apply.

## Deployment

Deployed with the work-order-approved wrapper:

```sh
/opt/fleet/lib/deploy-static.sh self-study-checkpoints /work/repo/dist
```

- Deployment ID: `e09324aa-bb9e-4779-ad26-063632201c9a`; status: **Succeeded**. The wrapper addressed only `sf-self-study-checkpoints` and served <https://self-study-checkpoints.sociobot.in> over managed TLS.
- Live artifact identity matches the final local `dist/`: `index.html` `757a5794…`, JS `74457412…`, CSS `f2757538…`, `sw.js` `a7fb6660…`, and `404.html` `56f91b34…` have byte-identical SHA-256 values.
- Live `/`, `/demo`, `/privacy`, `/terms`, and `/404` return 200. An unknown route returns the designed static 404 with HTTP 404.
- Live documents use `public, max-age=300, must-revalidate`; the hashed JS bundle uses `public, max-age=31536000, immutable`. Live headers include HSTS, `nosniff`, strict referrer policy, restrictive permissions policy, and the tested self-only CSP.
- Live `/opt/fleet/lib/verify-url.sh` on `/demo` passed in 566 ms with title/lang/h1/main/alt/button checks and no console/page errors. Live Axe found zero serious or critical violations on the five public routes at desktop and 390px.
- Fresh live-browser checks confirmed the desktop CTA bounds above, the 390px target, skip-link focus, same-origin-only requests, service-worker update/control, and offline `/demo` reload with the demo banner.

## Known limitations / next steps

- Peer review is non-accredited. Packet sealing proves later integrity, not identity, authorship, mastery, or institutional approval.
- Evidence remains linked rather than uploaded; browser-local plans do not sync. Learners should retain exported packets.
