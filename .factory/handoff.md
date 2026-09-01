# Handoff — first-read review 2

## Status

**FAIL** for candidate `07e990c075ad6862b51af393fd00be80d5447ede` at <https://self-study-checkpoints.sociobot.in/> on 1 September 2026 UTC.

The complete review is in `.factory/review-2.md`. Five findings remain. The blocking item is the half-fixed earlier claim-coverage finding: the product says private signing material stays in browser storage, but no listed claim test creates a real-workspace signing key and confirms its storage, request behavior, and omission from the downloaded packet.

## Work completed

- Checked the live first screen in fresh 390 × 844 and 1440 × 900 browser contexts before scrolling.
- Entered the sample in one click and confirmed populated data, persistent demo banner, Reset demo, real-storage isolation, same-origin requests, and offline reload.
- Ran every exact command in `.factory/claims.json` from a fresh temporary clone; all 14 passed.
- Ran `npm test` and `npm run build`; 8 Vitest and 54 Playwright checks passed, and `dist/` was produced.
- Confirmed the live HTML, JavaScript, and CSS match the fresh build by SHA-256.
- Checked route titles, metadata, one `h1`, one `main`, internal links, HTTP 404 behavior, keyboard focus, browser Back, touch targets, and mobile overflow.
- Ran live Axe checks on home, demo, Privacy, Terms, and HTTP 404 at mobile and desktop sizes; no serious or critical issue was reported.
- Ran `/opt/fleet/lib/verify-url.sh` against the live demo; it passed.
- Read the earlier review, polish report, handoff, and verification reports, then independently checked every earlier finding.
- Audited every landing copy unit and every README sentence with word counts.

No product code was changed.

## Verification commands

```sh
npm ci
npm test
npm run build
```

Each command listed in `.factory/claims.json` must also be run literally from a fresh clone. For live smoke verification:

```sh
/opt/fleet/lib/verify-url.sh https://self-study-checkpoints.sociobot.in/demo /tmp/self-study-checkpoints-review-2
```

## Remaining work

See F-1-7 and F-2-1 through F-2-4 in `.factory/review-2.md`. The product remains buildable and the sample works, but the zero-finding review standard is not met.
