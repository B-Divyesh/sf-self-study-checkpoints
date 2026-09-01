# First-read review 3 — PASS

**Reviewed:** 1 September 2026 UTC
**Candidate:** `d622732eb54ec555692395ef60550dc2df3b32be`
**Live URL:** <https://self-study-checkpoints.sociobot.in>

## Verdict

**PASS** — zero blocking or minor findings. All listed claims were run from a fresh clone and passed. The live site is clear, tryable, and consistent with the local candidate.

## First 30 seconds

I opened new browser contexts at 390 × 844 and 1440 × 900 without scrolling.

- **What it does:** It lets an independent learner plan a self-study checkpoint, get a reviewer response, and export a completion packet.
- **Who it is for:** Independent math and computer-science learners who want feedback without enrolling in a course.
- **What to click first:** **Try it with sample data**.

This information is visible above the fold on both sizes. At 390 px, the primary action was visible and the page had no horizontal overflow. The cassette, paper, and review-slip treatment is distinct, supports the handoff concept in the design record, and does not resemble a generic SaaS template.

## Demo and sandbox

One click on **Try it with sample data** opened `/?demo=1`. The first screen already showed Maya Chen’s realistic **Finite groups checkpoint**, its 56-day window, a syllabus slice, four planning steps, and editable fields. The persistent banner read **“Demo — sample data, nothing is saved”** and exposed **Reset demo** and **Start for real**.

In a new live 390 px context, I changed the sample title and reset it. It returned to **“Finite groups checkpoint”**; storage remained empty in demo mode. A separate listed claim test seeded real `self-study-checkpoints:v1` storage, edited and reset the demo, and confirmed that real data was unchanged. The live request log for the whole demo entry and edit flow contained only `https://self-study-checkpoints.sociobot.in`. The dedicated claim test also reloaded the controlled demo offline successfully.

## Claims and clean-clone checks

I cloned the candidate into `/tmp/self-study-checkpoints-review3.yFu0IW`, ran `npm ci`, then ran every literal `test` command in `.factory/claims.json`. Each passed:

| Claim id | Result |
| --- | --- |
| `workspace-planning` | PASS |
| `human-review` | PASS |
| `sealed-packet` | PASS |
| `free-no-account` | PASS |
| `offline-reload` | PASS |
| `demo-sandbox` | PASS |
| `local-only` | PASS |
| `local-autosave` | PASS |
| `scope-limits` | PASS |
| `non-accredited-review` | PASS |
| `no-tracking` | PASS |
| `multiple-local-plans` | PASS |
| `review-request-options` | PASS |
| `review-link-disclosure` | PASS |
| `local-signing-key` | PASS |
| `artwork-provenance` | PASS |

The final clean-clone `npm test` passed: 9 Vitest tests and 62 Playwright tests. `npm run build` also passed and produced `dist/` with the expected hashed JavaScript and CSS bundles. The test run’s `test-results/.last-run.json` reports `"status": "passed"`.

Every visitor-facing claim-like statement on the landing page and README maps to one or more listed claims: local storage/autosave and no data leaving the origin, free/no account, no tracking, sample isolation, offline reload, human review/non-accreditation, planning constraints, portable review/packet exports, change checks, signing-key handling, scope limits, and artwork provenance. No unlisted claim remains.

## Structure, navigation, privacy, and accessibility

- Live `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and `/404` have one `h1`, one `main`, `lang="en"`, route-specific title, description, canonical URL, Open Graph/Twitter fields, favicon, and touch icon. The direct unknown route returns the designed HTTP 404 page.
- The title pattern is clear: `Self-Study Checkpoints — plan study progress` on home; route titles use `Demo — Product`, `Privacy — Product`, `Terms — Product`, and `Page not found — Product`.
- Privacy navigation and browser Back move focus to the destination `h1` and update the polite route announcement. The static 404 skip link moves focus to `main`.
- A crawl of all rendered internal and external links returned 200, aside from the intentionally missing test URL returning its designed HTTP 404. The external source link names GitHub and says it is an external site.
- Live Axe scans at 390 px and 1440 px found no serious or critical violations on the public routes. Normal routes had no page or console errors. The browser’s expected network message for the deliberate HTTP 404 was excluded from the normal-load result.
- The CSP is self-only for scripts, styles, media, workers, and connections. Live demo request logging confirmed same-origin resources only; no third-party font, analytics, tracking, or AI-provider request appeared.

## History recheck

I read every earlier review, polish record, and handoff, then confirmed their results in both current code and the live site.

| Earlier finding(s) | Live and code confirmation | Result |
| --- | --- | --- |
| F-1-1 | The former long README opening is now five short, concrete sentences. | Fixed |
| F-1-2 through F-1-6 | The landing uses **Your checkpoint plan**, **No checkpoint yet**, **Create your first study checkpoint**, an explained change check, and consistent reviewer language. | Fixed |
| F-1-7 | All seven earlier missing entries plus `local-signing-key` and `artwork-provenance` now have individually tagged, observable tests. | Fixed |
| F-1-8 through F-1-11 | History navigation/focus, route metadata, static 404 shell, and 390 px header spacing all pass in the current browser suite and live checks. | Fixed |
| F-2-1 | Functional interface labels now use **Sample checkpoint**, **Your checkpoints**, **Step 1–4**, and **Page not found**. | Fixed |
| F-2-2 | Direct HTTP 404 includes `/apple-touch-icon.png`; its static test passes. | Fixed |
| F-2-3 | Footer says **Source code on GitHub (external site)** and uses a new-tab external link. | Fixed |
| F-2-4 | The README now explains packet change checks and uses direct wording for browser storage, routes, and deployment. | Fixed |

## Copy audit

Word counts use whitespace-separated words; hyphenated words and ranges count as one. The landing audit includes headings, actions, and facts because they must also be understandable in isolation. No item exceeds 22 words. No jargon, marketing adjective, inconsistent term, empty mood heading, or non-result-naming button was found.

### Landing page

| Copy unit | Words | Result |
| --- | ---: | --- |
| Self-Study Checkpoints | 2 | Pass — wordmark |
| Demo | 1 | Pass — route label |
| Privacy | 1 | Pass — route label |
| Review a request | 3 | Pass — result-naming action |
| Verify a packet | 3 | Pass — result-naming action |
| Self-study checkpoint builder | 3 | Pass |
| Plan a self-study checkpoint for review. | 6 | Pass |
| For independent math and computer-science learners who want clear feedback without enrolling in a course. | 15 | Pass |
| Try it with sample data | 5 | Pass — result-naming action |
| Start your checkpoint | 3 | Pass — result-naming action |
| Free. No account. | 3 | Pass |
| Plans stay on this device. | 5 | Pass |
| A reviewer decides. It is not accredited. | 7 | Pass |
| How it works | 3 | Pass — section name |
| Define a 6–12 week syllabus slice. | 6 | Pass |
| Agree on evidence and a visible rubric. | 7 | Pass |
| Export a reviewed packet that shows whether it changed. | 9 | Pass |
| Your checkpoint plan | 3 | Pass — section name |
| Checkpoint builder | 2 | Pass — section name |
| Nothing saved yet | 3 | Pass — state label |
| No checkpoint yet | 3 | Pass — state label |
| Create your first study checkpoint. | 5 | Pass |
| Start with the exact topic you want to defend. | 9 | Pass |
| Your work saves locally as you type. | 7 | Pass |
| Start a checkpoint | 3 | Pass — result-naming action |
| What this does not do | 5 | Pass — section name |
| It does not teach, grade proofs, verify identity, proctor work, or issue credentials. | 13 | Pass |
| Your reviewer makes the judgment. | 5 | Pass |
| Plan self-study checkpoints for reviewer feedback. | 6 | Pass |
| Privacy | 1 | Pass — route label |
| Terms | 1 | Pass — route label |
| Source code on GitHub (external site) | 6 | Pass — destination named |
| Built by Param Factory. | 4 | Pass |
| Original artwork generated with Azure AI Foundry. | 7 | Pass |
| No analytics or trackers. | 4 | Pass |

### README

| Sentence or heading | Words | Result |
| --- | ---: | --- |
| Self-Study Checkpoints | 2 | Pass — document title |
| Self-Study Checkpoints is a free tool that stores plans in your browser. | 12 | Pass |
| It is for independent math and computer-science learners. | 8 | Pass |
| Plan a 6–12 week study checkpoint. | 6 | Pass |
| Add problems, evidence, a rubric, and a reviewer. | 8 | Pass |
| Export a completion packet that shows whether its contents changed. | 10 | Pass |
| It does not teach, grade proofs, verify identity, proctor work, issue credentials, or redistribute exercises. | 15 | Pass |
| A reviewer’s response is non-accredited. | 5 | Pass |
| Live: `https://self-study-checkpoints.sociobot.in` | 2 | Pass |
| Try the isolated sample: `https://self-study-checkpoints.sociobot.in/?demo=1`. | 5 | Pass |
| `/demo` opens the same sample. | 4 | Pass |
| Demo edits stay in page memory and never touch your real checkpoint storage. | 13 | Pass |
| What the v1 does | 4 | Pass — section name |
| Saves multiple checkpoint plans locally. | 5 | Pass |
| No account, analytics, or tracking is used. | 7 | Pass |
| Enforces the intended 42–84 day planning window. | 7 | Pass |
| Builds linked proof, code, or mixed-evidence prompts with explicit success criteria. | 11 | Pass |
| Produces a review link or portable JSON request. | 8 | Pass |
| Anyone with the link can read the checkpoint. | 8 | Pass |
| Gives reviewers a focused rubric and exports a review response with a change check. | 14 | Pass |
| Imports that response, requires evidence for every problem, and exports a JSON completion packet with a change check. | 17 | Pass |
| Verifies the packet change check in the browser. | 7 | Pass |
| Works after the first visit without a network connection via a small service worker. | 14 | Pass |
| Includes a one-click sample checkpoint whose edits are discarded when you leave. | 12 | Pass |
| Includes privacy and terms pages at `/privacy` and `/terms`. | 9 | Pass |
| Run locally | 2 | Pass — section name |
| Requires Node.js 20 or newer. | 5 | Pass — setup prerequisite |
| Vite prints the local URL. | 5 | Pass — setup instruction |
| User data remains in that browser profile’s local storage. | 9 | Pass |
| Test and build | 3 | Pass — section name |
| Playwright 1.58.2 is pinned. | 4 | Pass — test setup |
| The factory environment already includes Chromium. | 7 | Pass — test setup |
| Elsewhere, run `npx playwright install chromium` once. | 6 | Pass — test instruction |
| The clean build command is `npm ci && npm test && npm run build`. | 15 | Pass — build instruction |
| It writes the static site to `dist/`, with `dist/index.html` at the root. | 12 | Pass — build result |
| `public/staticwebapp.config.json` routes each app URL to `index.html`, serves the 404 page, and sets security headers. | 16 | Pass — deployment detail |
| Factory workers deploy through the fleet wrapper shown below. | 8 | Pass — deployment instruction |
| Do not deploy directly with a named-app CLI. | 8 | Pass — deployment instruction |
| How packet change checks work | 5 | Pass — section name |
| Plans and the private key used for packet change checks stay in local storage. | 14 | Pass |
| A review link contains an encoded copy of the plan. | 10 | Pass |
| Anyone with that link can read it. | 7 | Pass |
| Download the request as JSON when you need a file. | 10 | Pass |
| Packet change checks detect edits after export. | 7 | Pass |
| They do not verify identity, authorship, mastery, or institutional approval. | 10 | Pass |
| The researched brief is in `.factory/brief.json`, the visual system and original image provenance are in `.factory/design.md`, and release verification is in `.factory/handoff.md`. | 22 | Pass |
| License | 1 | Pass — section name |
| MIT — see `LICENSE`. | 4 | Pass |

**Terminology confirmed:** checkpoint; problem; evidence; reviewer; reviewer response; rubric; completion packet; packet change check; demo. These terms are used consistently in the tested landing, demo, and README flows.

## Missed leverage

No finding. The researched brief asks for checkpoint planning, problem links, evidence prompts, an invited reviewer rubric, reviewer handoff, and a portable completion packet. The live product supplies each of those. Import/export is present; sync is deliberately unnecessary for a local-only product; automated grading or an AI drafting feature would conflict with the stated human-review and non-grading boundaries.

## What would make this perfect

Continue to run all 16 claim commands and the full suite whenever the product copy, browser storage model, service worker, export format, or deploy configuration changes. Preserve the one-click sample and its complete in-memory isolation. No current product change is required.
