# Handoff — Self-Study Checkpoints repair

## Status

The release-blocking findings in independent verification report `536e08dc3fb83def8643a455638b11a120750fa0` have been repaired against candidate `1048df4c6fff0b647b7cb9d3f1ca5457121e2282`. This remains the same Vite + vanilla TypeScript static-web artifact, deployed from `dist/` to Azure Static Web Apps.

## Repairs

- Hashed JS and CSS now build into `/bundles/`; Azure Static Web Apps sends those content-addressed files with `Cache-Control: public, max-age=31536000, immutable`. Documents, manifest, service worker, and public image URLs retain `public, max-age=300, must-revalidate` so updates are discovered. The service-worker cache is versioned as `checkpoint-desk-v2` to evict the old cache on update.
- Added a restrictive self-contained CSP: same-origin scripts/styles/workers/connections, no objects or framing, and no third-party content. Existing `nosniff`, referrer, and permissions policies are preserved.
- The skip link now focuses the programmatically focusable `<main>` destination, without losing a review-link query string.
- Scope date feedback updates immediately on input/change, including an announced target-date error and `aria-invalid` state. Empty/invalid dates also block sharing correctly.
- Invalid JSON files now receive an actionable product message instead of raw parser implementation text.

## Regression coverage

- `tests/static-config.test.ts` locks the immutable bundle policy, short shell policy, and CSP directives.
- `tests/e2e/app.spec.ts` covers skip-link focus, immediate 41-day date feedback, malformed reviewer JSON recovery, and service-worker offline reload at desktop and 390 × 844 mobile.
- `tests/model.test.ts` covers an empty target date as outside the required 42–84 day window.

## Verification performed — 2026-08-28 UTC

```sh
npm ci
npm test
npm run build
npm audit --omit=dev
```

- Clean install completed with 0 audit vulnerabilities.
- `npm test` passed: 6 Vitest unit/policy tests and 14 Playwright tests (7 flows × desktop Chromium and 390 × 844 mobile). This includes the complete owner → reviewer → response-import → P-256 packet seal/verification flow, keyboard skip link, axe serious/critical scan, malformed-file recovery, and controlled offline reload.
- `npm run build` passed (`tsc --noEmit && vite build`) and produced `dist/index.html`. Built payload: JS 38.39 KB / 12.86 KB gzip; CSS 16.04 KB / 4.50 KB gzip.
- `npm audit --omit=dev`: 0 vulnerabilities.
- Azure Static Web Apps CLI emulation verified the hashed `/bundles/` JavaScript responds `public, max-age=31536000, immutable`; `/sw.js` and public images respond `public, max-age=300, must-revalidate`; CSP is present with the configured restrictive directives.
- `/opt/fleet/lib/verify-url.sh` against the built Azure emulator passed: HTTP 200, title, `lang=en`, one `<h1>`, main landmark, zero missing image alts, zero unlabeled buttons, and zero browser console/page errors.
- Local mobile Lighthouse: Performance 100, Accessibility 100, FCP 1.2 s, LCP 1.5 s, TBT 50 ms, CLS 0.

## Run, deploy, and verify

```sh
npm ci
npm test
npm run build
swa deploy dist --env production --app-name self-study-checkpoints
```

After deployment, confirm the live hashed bundle returns the immutable cache header, `/sw.js` retains the short cache policy and CSP is present, then reload once online and once offline to confirm the new `checkpoint-desk-v2` cache controls the page.

## Known product limitations

- Reviewer identity is intentionally not verified. A response is inspectable peer feedback; the packet seal proves integrity, not identity, authorship, mastery, or accredited credit.
- Evidence remains linked, not uploaded, and local browser storage has no synchronization. Learners should retain exported packets and make their own backups.
- Very large review links can be unwieldy; the JSON request flow remains the reliable fallback.
