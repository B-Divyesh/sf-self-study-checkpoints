# Handoff — independent verification 6

## Status

**FAIL** — candidate `9e8c8e3fcd0eb298fee2627a53c0c852cd2be63e` is deployed byte-for-byte at <https://self-study-checkpoints.sociobot.in/>, but one P2 error-recovery defect remains.

Defects: P0 0 · P1 0 · P2 1 · P3 0.

## Release-blocking finding

A damaged reviewer URL such as <https://self-study-checkpoints.sociobot.in/?review=%25bad> shows the raw browser decoding message `Failed to execute 'atob'...` and gives no next step. Replace it with a plain explanation and an action such as requesting a fresh URL or using the downloaded review-request file. Add coverage for malformed and truncated review values.

Full evidence and reproduction details are in [`.factory/verification-6.md`](verification-6.md). The screenshot is [`evidence/verification-6/invalid-review-link.png`](evidence/verification-6/invalid-review-link.png).

## What passed

- All 16 literal `.factory/claims.json` commands passed first from the clean candidate.
- `npm test` passed: 9 Vitest checks and 60 Playwright checks.
- `npm run build` passed TypeScript checking and produced `dist/`.
- JavaScript is 44,486 bytes / 14.56 kB gzip; CSS is 17,384 bytes / 4.74 kB gzip.
- The complete learner → reviewer → completion-packet flow passed live, including response checksum and packet change-check confirmation.
- Boundary dates, malformed JSON recovery, delete/Undo, and demo separation passed.
- Desktop and 390px route checks found no serious/critical Axe issues, normal-viewport overflow, undersized checked controls, console errors, or page errors.
- Privacy request logging remained same-origin. Security headers and immutable hashed-asset caching are present.
- Service-worker update and offline demo reload passed.
- All 18 public build artifacts matched live bytes.
- Fresh mobile Lighthouse: Performance 96, Accessibility 100, Best Practices 100, SEO 100; LCP 1.1 s and CLS 0.

## Recheck

```sh
npm ci
npm test
npm run build
```

Then open the damaged review URL above and confirm that the notice uses plain product language with a clear next step. Re-run all claim commands and compare the rebuilt public files with the live deployment after the correction is deployed.

## Product changes

No product code, deployment setting, or external resource was changed during verification. Only this handoff, the verification report, and local QA evidence were added.
