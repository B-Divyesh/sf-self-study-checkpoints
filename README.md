# Self-Study Checkpoints

Self-Study Checkpoints is a free tool that stores plans in your browser. It is for independent math and computer-science learners. Plan a 6–12 week study checkpoint. Add problems, evidence, a rubric, and a reviewer. Export a completion packet that shows whether its contents changed.

It does not teach, grade proofs, verify identity, proctor work, issue credentials, or redistribute exercises. A reviewer’s response is non-accredited.

Live: <https://self-study-checkpoints.sociobot.in>

Try the isolated sample: <https://self-study-checkpoints.sociobot.in/?demo=1>. `/demo` opens the same sample. Demo edits stay in page memory and never touch your real checkpoint storage.

## What the v1 does

- Saves multiple checkpoint plans locally. No account, analytics, or tracking is used.
- Enforces the intended 42–84 day planning window.
- Builds linked proof, code, or mixed-evidence prompts with explicit success criteria.
- Produces a review link or portable JSON request. Anyone with the link can read the checkpoint.
- Gives reviewers a focused rubric and exports a review response with a change check.
- Imports that response, requires evidence for every problem, and exports a JSON completion packet with a change check.
- Verifies the packet change check in the browser.
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

Playwright 1.58.2 is pinned. The factory environment already includes Chromium. Elsewhere, run `npx playwright install chromium` once.

```sh
npm test
npm run build
```

The clean build command is `npm ci && npm test && npm run build`. It writes the static site to `dist/`, with `dist/index.html` at the root. `public/staticwebapp.config.json` routes each app URL to `index.html`, serves the 404 page, and sets security headers.

Factory workers deploy through the fleet wrapper shown below.

```sh
/opt/fleet/lib/deploy-static.sh self-study-checkpoints /work/repo/dist
```

Do not deploy directly with a named-app CLI.

## How packet change checks work

Plans and the private key used for packet change checks stay in local storage. A review link contains an encoded copy of the plan. Anyone with that link can read it. Download the request as JSON when you need a file. Packet change checks detect edits after export. They do not verify identity, authorship, mastery, or institutional approval.

The researched brief is in [`.factory/brief.json`](.factory/brief.json), the visual system and original image provenance are in [`.factory/design.md`](.factory/design.md), and release verification is in [`.factory/handoff.md`](.factory/handoff.md).

## License

MIT — see [`LICENSE`](LICENSE).
