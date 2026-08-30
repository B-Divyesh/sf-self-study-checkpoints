# Handoff — Independent verification 2

## Verification status — FAIL

Independent QA of candidate `7baa370abbb2c27e18c470ed0669e3ab2a556a38` against <https://self-study-checkpoints.sociobot.in/> completed on 2026-08-30 UTC. The live HTML, JS, CSS, and service worker are byte-identical to a fresh local production build of this candidate. No product code was changed during verification.

**Result: FAIL.** Two P2 acceptance defects block release:

- Mobile touch targets are too small: at 390px, the home wordmark is 36 × 36px and footer legal/source links are only 25px high; every interactive target must be at least 44 × 44px.
- The `workspace-planning`, `human-review`, and `sealed-packet` claim tests begin at `/` rather than the mandatory isolated `/demo` sandbox.

Everything else verified cleanly: after `npm ci`, all seven declared claim tests pass; `npm test` passes (8 unit/policy and 18 Playwright tests); `npm run build` passes; live owner → reviewer → checksum import → P-256 packet verification works; privacy request logging is same-origin only; offline demo reload and service-worker update checks pass; Axe finds no serious/critical issues; and 390px has no horizontal overflow. Live Lighthouse recorded Performance 100, Accessibility 100, Best Practices 100, SEO 100 (FCP 1.1s, LCP 1.3s, TBT 50ms, CLS 0).

Full evidence, exact headers, test mapping, and retest instructions: [`.factory/verification-2.md`](verification-2.md).

---

# Builder handoff — Self-Study Checkpoints repair 2

## Status

Candidate `1b0ca2f46633aac450f7b06c47864fdba434e654` contained the earlier application repairs but its handoff used the obsolete direct command `swa deploy ... --app-name self-study-checkpoints`. That bypassed the current fleet wrapper and named an unprefixed app instead of the work-order resource `sf-self-study-checkpoints`.

The repair preserves the Vite + vanilla TypeScript static-web product and `dist/` artifact. The deployment runbook now uses `/opt/fleet/lib/deploy-static.sh self-study-checkpoints /work/repo/dist`. A unit regression requires that command and rejects the obsolete target.

## Product and acceptance repairs

- Added `/demo` with a realistic finite-groups checkpoint, a persistent demo banner, reset/start-real controls, and memory-only state that never reads or writes the real local-storage key.
- Added `.factory/claims.json`; every listed claim has one tagged browser test and was run from the documented demo or clean workflow.
- Added a real 404 response page, robots/sitemap files, canonical/Open Graph/Twitter metadata, a 1200×630 social card, and a 180×180 touch icon derived from the original cassette art.
- Replaced the catch-all navigation fallback with explicit rewrites for `/demo`, `/privacy`, `/terms`, and `/404`. Live testing showed the catch-all intercepted unknown paths before Azure could apply the 404 response override; the emulator now returns the designed page with HTTP 404 for an unknown path.
- Replaced the metaphorical first-screen headline with a direct job statement and recorded the word-count audit in `.factory/copy-audit.md`.
- Expanded axe coverage across `/`, `/demo`, `/privacy`, `/terms`, and `/404`. This found a transient contrast failure during the sheet’s opacity entrance; the opacity fade was removed so text remains compliant through the motion.
- Updated the offline shell to cache demo and error routes under `checkpoint-desk-v3`.

## Local verification — 2026-08-30 UTC

Exact clean command:

```sh
npm ci && npm test && npm run build
```

- Pass: clean install, 0 audit vulnerabilities.
- Pass: 8 Vitest unit/policy/regression checks.
- Pass: 18 Playwright checks across desktop Chromium and 390×844 mobile. Coverage includes the complete owner → reviewer → checksum import → P-256 seal/verify workflow, keyboard skip focus, form errors, legal/404 routes, demo reset/isolation, same-origin privacy, offline reload in its own browser context, and axe serious/critical scans.
- Pass: every exact command in `.factory/claims.json`.
- Pass: `npm run build`; `dist/index.html` exists. Initial JS is 41.84 KB / 13.90 KB gzip; CSS is 17.04 KB / 4.68 KB gzip.
- Pass: Azure Static Web Apps emulator returns one-year immutable caching for `/bundles/*`, five-minute revalidation for documents and `sw.js`, and the restrictive CSP/security headers.
- Pass: `/opt/fleet/lib/verify-url.sh` against the emulator: HTTP 200, title, `lang=en`, one h1, main landmark, no missing alt or button labels, and no console/page errors.
- Pass: mobile Lighthouse 12.8.2 — Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.2 s, LCP 1.6 s, TBT 0 ms, CLS 0.
- Pass: desktop and 390px screenshots were inspected; no overflow, clipped actions, or lost content was found.

Evidence is stored under `.factory/evidence/`.

## Deploy and live verification

The authorized work-order command is:

```sh
/opt/fleet/lib/deploy-static.sh self-study-checkpoints /work/repo/dist
```

Final production deployment completed from application commit `487eb10` with fleet deployment ID `5fee5d60-915a-44e2-9715-10c29ab37433`.

- Pass: fleet wrapper targeted only `sf-self-study-checkpoints`, reused its eastus2 app, uploaded `dist/`, and reported production status `Succeeded`.
- Pass: <https://self-study-checkpoints.sociobot.in/> returned HTTP 200 over managed TLS. `/demo`, `/privacy`, `/terms`, `/404`, `robots.txt`, `sitemap.xml`, and the social image returned 200.
- Pass: an unknown path returned HTTP 404 with the designed “Page not found” title and h1.
- Pass: live `/opt/fleet/lib/verify-url.sh` found the expected title, `lang=en`, one h1, main landmark, no missing alt/button labels, and no console/page errors.
- Pass: live document and service worker use five-minute revalidation; the hashed JS bundle uses `public, max-age=31536000, immutable`; CSP, HSTS, referrer, nosniff, and permissions headers are present.
- Pass: live `index.html`, `sw.js`, JS, and CSS are byte-identical to local `dist/`. SHA-256: index `74ac20cf…`, service worker `a7fb6660…`, JS `4f8d180e…`, CSS `929205db…`.
- Pass: a fresh 390×844 browser was controlled by `checkpoint-desk-v3`, reloaded `/demo` offline with its sample heading/banner intact, and logged no console or page errors.

## Known limitations

- Peer review is non-accredited and reviewer identity is not verified. The packet seal proves integrity, not identity, authorship, or mastery.
- Evidence remains linked rather than uploaded. Browser data has no sync; learners should keep exported packets.
- Very large review links can be unwieldy; the JSON request remains the reliable fallback.
