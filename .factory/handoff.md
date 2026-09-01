# Handoff — polish round 1

## Delivered

Repair commit: `f62e8f6fd4168300ad68566dc06d0ceb8d9cace5`.

- Rewrote the first-screen, empty-state, README, and reviewer wording in plain language.
- Kept `/demo` as the one-click isolated sample path with its persistent banner, reset action, and real-data separation.
- Added 14 catalogued, demo-backed claims with one tagged observable browser test each.
- Added route-specific title, description, canonical, Open Graph, Twitter, and robots metadata; internal navigation now moves focus to the h1 and announces the destination.
- Completed the real HTTP 404 shell, including metadata, normal navigation, legal links, and skip-link focus behavior.
- Fixed the 390px header spacing without changing the cassette-zine visual system.

The finding-by-finding record is in [`.factory/polish-1.md`](polish-1.md).

## Verification

A new clone at `/tmp/self-study-checkpoints-clean.RKIqBv` ran `npm ci`, every literal test command from `.factory/claims.json`, `npm test`, and `npm run build` successfully. The full suite contains 8 Vitest checks and 46 Playwright checks across desktop and mobile.

Final built payload: JavaScript 44,312 B (14.49 kB gzip); CSS 17,384 B (4.74 kB gzip). `dist/index.html` is present.

Live deployment:

```sh
/opt/fleet/lib/deploy-static.sh self-study-checkpoints /work/repo/dist
```

Deployment ID: `b462e69d-7797-4e44-982d-00259b63630c` (Succeeded).

- `verify-url.sh https://self-study-checkpoints.sociobot.in/demo` passed: title, `lang=en`, one h1, main, image alt text, button labels, and no console/page errors. Evidence: `.factory/evidence/polish-1-live/demo/`.
- Live Playwright Axe checks found zero serious/critical issues on `/`, `/demo`, `/privacy`, `/terms`, and `/no-such-page` at 390px.
- A cold live browser check confirmed the visible demo CTA, route focus/announcement and Back behavior, 12px mobile header separation, HTTP 404 status, complete 404 metadata, skip-link focus, and 404 Privacy/Terms links.
- Live request logging during the demo and local browser suite remains same-origin only. The dedicated service-worker test reloads the controlled demo while offline.

## Run locally

```sh
npm ci
npm test
npm run build
```

## Known gaps

None. The product remains intentionally local-first, non-accredited, and does not prove identity, authorship, mastery, or institutional approval.
