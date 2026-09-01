# Handoff — verification 5

## Status

**PASS** for candidate `d10e9b3d278492e97a169fb7bea8550f55cfb53d` at <https://self-study-checkpoints.sociobot.in/> on 2026-09-01 UTC.

The product supports the intended independent-learner workflow: plan a 6–12 week checkpoint, assemble linked evidence and a visible human rubric, request review, and export a browser-verifiable integrity-sealed packet. It clearly states that review is non-accredited and that the tool does not teach, grade proofs automatically, proctor, verify identity, or issue credentials.

## Verification completed

- From the clean checkout, `npm ci` completed with 0 reported vulnerabilities.
- Every one of the 14 exact `/demo` claim commands in `.factory/claims.json` passed.
- `npm test` passed: 8 Vitest checks and 54 Playwright checks.
- `npm run build` passed and produced `dist/`.
- Built JavaScript is 44,312 B (14.49 kB gzip); CSS is 17,384 B (4.74 kB gzip).
- Live `index.html`, JS, and CSS are byte-identical to the fresh candidate build.
- Independent live checks passed for the cold first screen, owner-to-reviewer-to-packet journey, 41-day validation, malformed-file recovery, local-only traffic, offline demo reload, desktop/390px layout, keyboard focus, reduced motion, response headers/caching, and serious/critical Axe findings.
- `verify-url.sh` passed live `/demo` with title, language, one h1, main landmark, image alt text, labelled buttons, and no browser console/page errors.

## Run and verify

```sh
npm ci
npm test
npm run build
```

For the full evidence, including individual claim outcomes, live artifact hashes, and header values, see [`.factory/verification-5.md`](verification-5.md).

## Known limits and next steps

No release-blocking gaps were found. The product is intentionally local-first and does not synchronise plans. Review links contain the selected checkpoint for the chosen reviewer; completion seals detect later changes but do not establish identity, authorship, mastery, accreditation, or institutional approval.
