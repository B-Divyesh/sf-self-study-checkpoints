# Polish round 1

Candidate `1670c889901e3150ab15bcdd076831a3b6b28e5c` was repaired in `f62e8f6fd4168300ad68566dc06d0ceb8d9cace5` and deployed as `b462e69d-7797-4e44-982d-00259b63630c`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Rewrote the README opening as four short, concrete sentences. | Clean-clone `npm test`; `.factory/copy-audit.md` |
| F-1-2 | Renamed “Your desk” to “Your checkpoint plan.” | Live mobile screenshot: `.factory/evidence/polish-1-live/home-mobile.png` |
| F-1-3 | Renamed “Blank side A” to “No checkpoint yet.” | Live mobile screenshot: `.factory/evidence/polish-1-live/home-mobile.png` |
| F-1-4 | Replaced the metaphor with “Create your first study checkpoint.” | Live mobile screenshot: `.factory/evidence/polish-1-live/home-mobile.png` |
| F-1-5 | Rewrote the third step to explain that the packet shows whether it changed. | `@claim:sealed-packet`; live home screenshot |
| F-1-6 | Standardized visible product terminology on **reviewer** and **reviewer response**; removed possession and seal jargon from visitor copy. | `@claim:human-review`; `@claim:non-accredited-review` |
| F-1-7 | Added seven missing claim entries and dedicated observable browser tests: local autosave, scope limits, non-accredited review, no tracking, multiple plans, request options, and review-link disclosure. | Every literal command in `.factory/claims.json` passed from `/tmp/self-study-checkpoints-clean.RKIqBv` |
| F-1-8 | Added History API navigation, route h1 focus, polite route announcement, and Back handling. | Browser regression “moves focus and announces each internal route change”; live cold route check |
| F-1-9 | Added per-route description, canonical, OG/Twitter title/description/URL and noindex state for demo/review/404; static 404 now has complete metadata. | Browser regression “sets route-specific canonical and social metadata”; live `/no-such-page` check |
| F-1-10 | Completed static 404 header/footer, added Privacy/Terms, focusable main, and CSP-safe skip-link script. | Browser regression “static HTTP 404 shell”; live `https://self-study-checkpoints.sociobot.in/not-real` HTTP 404 keyboard check |
| F-1-11 | Increased the mobile header nav gap to 12px and added a 390px layout regression. | Browser regression “separates mobile header destinations”; `.factory/evidence/polish-1-live/home-mobile.png` |

## Live recheck

- `https://self-study-checkpoints.sociobot.in/` cold-loaded with the sample action visible at 390px.
- `https://self-study-checkpoints.sociobot.in/demo` passed `verify-url.sh`; evidence is in `.factory/evidence/polish-1-live/demo/`.
- Live Playwright Axe found no serious or critical issues on `/`, `/demo`, `/privacy`, `/terms`, or `/no-such-page` at 390px. The HTTP 404 console message was treated as expected for the 404 route; other routes had no console errors.
