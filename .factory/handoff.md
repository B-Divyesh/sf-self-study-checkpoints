# Handoff — Self-Study Checkpoints v1

## Independent verification status: FAIL

Candidate `1048df4c6fff0b647b7cb9d3f1ca5457121e2282` was independently verified on 2026-08-28 UTC against <https://self-study-checkpoints.sociobot.in/>. The live HTML, JS, CSS, and service worker are byte-identical to the candidate build. Clean `npm ci`, `npm test` (4 unit + 6 browser tests), `npm run test:unit`, and `npm run build` all pass; normal review/seal/verify flow, offline reload, axe serious/critical, Lighthouse (100 performance / 100 accessibility), privacy outbound-request checks, and responsive visual checks pass.

This handoff is nevertheless **FAIL** pending the P2 acceptance defects documented in [`.factory/verification.md`](verification.md): hashed assets are served with only `max-age=30` instead of immutable long-lived caching; the skip link does not move keyboard focus to main content; and the 6–12 week date feedback stays stale while the date is edited. Two P3 follow-ups are also recorded: raw JSON parser errors and no CSP. Do not treat the earlier ship report below as release approval.

## What shipped

- A Vite + vanilla TypeScript static application implementing the complete owner → reviewer → owner handoff.
- Local-first multi-checkpoint storage, a 42–84 day scope check, linked proof/code prompts, editable rubric, evidence disclosures, reviewer request link and JSON fallback, checksum-verified reviewer response import, ECDSA P-256 completion-packet sealing, and in-browser verification.
- Deliberate non-accreditation and no-automated-grading language at the planning, review, export, legal, and footer layers.
- First-class empty, validation/error, offline, mobile, keyboard, destructive-confirmation, undo, and saved states.
- `/privacy` and `/terms`, installable PWA metadata, an offline service worker, Azure Static Web Apps navigation fallback/security headers, README, and MIT license.
- A product-specific cassette-era zine system recorded in `.factory/design.md`. The original hero was generated with the factory Azure AI Foundry image deployment; two source candidates and prompt metadata are retained in `assets/src/`. Candidate 01 was visually reviewed, cropped to remove an edge artifact, and shipped as AVIF, WebP, and JPEG. Candidate 02 was rejected because its review card contained pseudo-text.

## Run and verify

```sh
npm ci
npm test
npm run build
```

`npm run build` is the deployment command. Output is in `dist/`, with `dist/index.html` at its root.

Verification performed on 2026-08-28:

- `npm test`: 4 unit checks and 6 browser checks passed (desktop Chromium plus a 390 × 844 Chromium viewport). The browser flow creates a checkpoint, shares it, completes peer review, imports the response, exports a sealed packet, and verifies the seal.
- Axe 4.10.2: zero serious or critical issues on desktop and mobile.
- `/opt/fleet/lib/verify-url.sh`: HTTP 200, one `<h1>`, `lang="en"`, main landmark present, zero missing alt attributes, zero unlabeled buttons, and zero console/page errors.
- Lighthouse 12.8.2 mobile: performance 100, accessibility 100, FCP 0.9 s, LCP 1.5 s, total blocking time 0 ms, CLS 0.
- Production payload: 36.91 KB JS and 16.04 KB CSS uncompressed (12.43 KB and 4.50 KB gzip). Hero sources: 24 KB mobile AVIF, 36 KB mobile WebP, 90 KB desktop AVIF, 112 KB desktop WebP; all within budget.
- `npm audit`: zero known vulnerabilities.

Evidence files are under `.factory/evidence/`.

## Known limitations and next steps

- Reviewer identity is intentionally not verified. The attestation is inspectable peer feedback, and the completion seal proves only packet integrity—not identity or accredited mastery.
- Evidence is linked rather than uploaded. Link longevity and access permissions remain the learner’s responsibility.
- Data is device-local and has no synchronization. Users should keep exported packets; a future version could add an explicit whole-workspace backup/import without introducing accounts.
- The review link embeds the request in its URL and can become long for unusually large plans; the JSON request flow is the reliable fallback.
