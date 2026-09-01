# Handoff — polish round 2

## Status

**PASS** — every finding in `.factory/review-2.md` and the earlier review/polish record is closed.

- Repair commit: `ca1b8faecf9c0958b8d53a0d8e299c68746429ff`
- Runnable-claim command commit: `100699b572024ec50a70e3de0ae562d2db539e69`
- Both commits are pushed to `main`.
- Static deployment: `e599c154-6a6a-4bc1-adfb-ba5858005cf7`
- Live URL: <https://self-study-checkpoints.sociobot.in/?demo=1>

## What changed

- Added one-click `?demo=1` entry, persistent isolated-demo controls, and demo-only review links.
- Added tested real-workspace signing-key privacy coverage and tested artwork provenance.
- Replaced remaining functional cassette metaphors with product terms and plain packet language.
- Completed the direct 404 metadata with the Apple touch icon and plain Page not found heading.
- Named the external GitHub source link, rewrote README technical/internal wording, and refreshed the copy audit.

## Exact verification evidence

- Fresh clone `/tmp/self-study-checkpoints-clean.lKy0yI`: `npm ci`, `npm test`, and `npm run build` passed. The complete suite passed **9 Vitest checks and 60 Playwright checks**.
- Every declared claim command was run from that clean clone: `workspace-planning`, `human-review`, `sealed-packet`, `free-no-account`, `offline-reload`, `demo-sandbox`, `local-only`, `local-autosave`, `scope-limits`, `non-accredited-review`, `no-tracking`, `multiple-local-plans`, `review-request-options`, `review-link-disclosure`, and `local-signing-key` all passed.
- The corrected `artwork-provenance` command was run from a second clean clone at `/tmp/self-study-checkpoints-claim.8dRhOu` and passed.
- `npm run build` produced `dist/`; app JavaScript is **44.49 kB** uncompressed / **14.47 kB gzip**, and CSS is **17.38 kB** / **4.75 kB gzip**.
- `/opt/fleet/lib/verify-url.sh https://self-study-checkpoints.sociobot.in/?demo=1` passed: HTTP 200, Demo title, `lang=en`, one h1, main landmark, no missing image alternatives, no unlabeled buttons, and no console errors.
- Live Playwright + Axe checked `/`, `/?demo=1`, `/privacy`, `/terms`, and `/not-real` at 1440 × 900 and 390 × 844. All normal routes were HTTP 200, `/not-real` was HTTP 404, every route had one h1 and one main, and there were no serious or critical Axe issues or page errors.
- Cold live 390px check confirmed the demo banner, Reset demo, Start for real, external Source label, no old functional metaphors, and no horizontal overflow.
- Evidence screenshots: [desktop demo](evidence/polish-2-live/demo-desktop.png), [mobile demo](evidence/polish-2-live/demo-mobile.png), [direct 404](evidence/polish-2-live/not-found-desktop.png).

## Run and deploy

```sh
npm ci
npm test
npm run build
/opt/fleet/lib/deploy-static.sh self-study-checkpoints /work/repo/dist
```

## Known gaps

None.
