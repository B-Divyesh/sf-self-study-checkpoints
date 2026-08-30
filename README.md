# Self-Study Checkpoints

Self-Study Checkpoints is a free, local-first web tool for serious independent math and computer-science learners. It turns a 6–12 week study plan into an inspectable agreement: define the syllabus slice, link rigorous problems, state the evidence and rubric up front, collect a human reviewer response, then export a cryptographically integrity-sealed completion packet.

It deliberately does not issue credentials, grade proofs, proctor work, or redistribute exercises. Peer review is always labelled non-accredited.

Live: <https://self-study-checkpoints.sociobot.in>

Try the isolated sample: <https://self-study-checkpoints.sociobot.in/demo>. Demo edits stay in page memory and never touch your real checkpoint storage.

## What the v1 does

- Saves multiple checkpoint plans locally with no account or tracking.
- Enforces the intended 42–84 day planning window.
- Builds linked proof, code, or mixed-evidence prompts with explicit success criteria.
- Produces a private-by-possession review link or portable JSON request.
- Gives reviewers a focused rubric and exports their checksum-protected response.
- Imports that response, requires evidence for every problem, and exports an ECDSA P-256 sealed JSON packet.
- Verifies exported packet integrity in the browser.
- Works after the first visit without a network connection via a small service worker.
- Includes a one-click sample checkpoint whose edits are discarded when you leave.
- Includes privacy and terms pages at `/privacy` and `/terms`.

## Run locally

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
```

Vite prints the local URL. User data remains in that browser profile’s local storage.

## Test and build

Playwright 1.58.2 is pinned. The factory image includes its Chromium build; elsewhere, run `npx playwright install chromium` once.

```sh
npm test
npm run build
```

The exact clean build command is `npm ci && npm test && npm run build`. It writes the static site to `dist/`, with `dist/index.html` at the root. `public/staticwebapp.config.json` supplies explicit SPA route rewrites, the real 404 response, and security headers.

Factory workers deploy only through the fleet wrapper. It resolves the allowed `sf-self-study-checkpoints` resource and its deployment token:

```sh
/opt/fleet/lib/deploy-static.sh self-study-checkpoints /work/repo/dist
```

Do not bypass the wrapper with a direct named-app CLI deployment.

## Privacy and packet trust

Plans and private signing material stay in local storage. A review link contains an encoded copy of the plan, so possession grants access; use the downloadable request when a long URL is inconvenient. Completion packet signatures detect changes after export but do not verify a learner’s identity, authorship, mastery, or institutional approval.

The researched brief is in [`.factory/brief.json`](.factory/brief.json), the visual system and original image provenance are in [`.factory/design.md`](.factory/design.md), and release verification is in [`.factory/handoff.md`](.factory/handoff.md).

## License

MIT — see [`LICENSE`](LICENSE).
