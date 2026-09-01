# Polish round 2

Candidate `07e990c075ad6862b51af393fd00be80d5447ede` was repaired in `ca1b8faecf9c0958b8d53a0d8e299c68746429ff`, with the runnable-claim command correction in `100699b572024ec50a70e3de0ae562d2db539e69`. It was deployed as `e599c154-6a6a-4bc1-adfb-ba5858005cf7`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-7 | Added `local-signing-key` and `artwork-provenance` claims. The signing-key test enters the real workspace from `?demo=1`, completes review, records all requests, inspects browser storage, and inspects the downloaded packet. | `@claim:local-signing-key`; `@claim:artwork-provenance`; live demo `https://self-study-checkpoints.sociobot.in/?demo=1` |
| F-2-1 | Replaced functional cassette metaphors with Sample checkpoint, Your checkpoints, Step 1–4 labels, a concrete packet action, and Page not found on both 404 routes. | `npm test`; [mobile demo screenshot](evidence/polish-2-live/demo-mobile.png); live HTTP 404 `https://self-study-checkpoints.sociobot.in/not-real` |
| F-2-2 | Added the Apple touch icon to the direct HTTP 404 and asserted it in the direct-404 browser test. | `static HTTP 404 shell has metadata, keyboard skip focus, and legal links`; live HTTP 404 source check |
| F-2-3 | Renamed the external footer link to “Source code on GitHub (external site)” and marked it as an external new-tab link. | `identifies the external source destination in the footer`; live 390px check |
| F-2-4 | Rewrote README technical and internal terms in plain language and updated the full copy audit. | `.factory/copy-audit.md`; `@claim:scope-limits`; live routes pass Axe |

## Additional acceptance work

- The landing action now opens `/?demo=1` in one click. The same isolated workspace remains available at `/demo`.
- `?demo=1` keeps the persistent banner, Reset demo, Start for real, separate in-memory data, and demo-only review links.
- The packet UI now says “change check” rather than unexplained cryptographic wording.
