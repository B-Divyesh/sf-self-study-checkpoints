# Handoff — Self-Study Checkpoints repair 2

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

Production evidence will be appended after the committed repair is pushed and deployed.

## Known limitations

- Peer review is non-accredited and reviewer identity is not verified. The packet seal proves integrity, not identity, authorship, or mastery.
- Evidence remains linked rather than uploaded. Browser data has no sync; learners should keep exported packets.
- Very large review links can be unwieldy; the JSON request remains the reliable fallback.
