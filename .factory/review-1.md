# First-read review 1 — FAIL

**Reviewed:** 2026-09-01 UTC  
**Live URL:** <https://self-study-checkpoints.sociobot.in>  
**Verdict:** **FAIL** — 11 findings remain. No claim command failed and the demo works, but the required zero-finding standard is not met.

## First 30 seconds

I opened a fresh browser context at 390 × 844 and 1440 × 900 before scrolling. On both screens I understood the product as: a local tool that helps independent math and computer-science learners make a 6–12 week study checkpoint, request a human review, and export evidence of progress. It is for independent learners who do not want to enrol in a course. The first click is **“Try it with sample data”**.

This first-read check passes. The action was fully visible at 390 px (`top 490`, `bottom 538`) and 1440 px (`top 709`, `bottom 757`). The first screen has one clear primary action and three useful facts. The cassette-and-review-slip treatment is distinct, readable, and consistent with `.factory/design.md`; it does not resemble a generic SaaS template.

## Demo, privacy, claims, and quality checks

- Clicking the first-screen sample action opened `/demo` in one click. The first demo screen showed Maya Chen’s populated **Finite groups checkpoint**, the persistent **“Demo — sample data, nothing is saved”** banner, Reset demo, and Start for real.
- In a fresh 390 px context, I seeded a sentinel in real `self-study-checkpoints:v1` storage, edited the sample, and selected Reset demo. The sample title returned to **“Finite groups checkpoint”**; the real sentinel was unchanged; no `demo:` keys existed. Live request logging during that flow recorded only `https://self-study-checkpoints.sociobot.in`.
- Every exact command listed in `.factory/claims.json` passed locally after `npm ci`: `workspace-planning`, `human-review`, `sealed-packet`, `free-no-account`, `offline-reload`, `demo-sandbox`, and `local-only`.
- `npm test` passed (8 Vitest and 22 Playwright checks; `test-results/.last-run.json` reports `passed`). `npm run build` passed and produced `dist/`; the initial application JavaScript was 41.86 kB (13.92 kB gzip).
- The existing Playwright Axe check passed on `/`, `/demo`, `/privacy`, `/terms`, and `/404` at desktop and 390 px. Known live routes have one `h1`, one `main`, correct route titles, `lang=en`, and no page or console error on their normal loads.
- The internal links on the landing page (`/`, `/demo`, `/privacy`, `/terms`) returned 200. The public Source link returned 200. An unknown URL returned the designed HTTP 404. Live headers include a self-only CSP; the hashed JavaScript has `Cache-Control: public, max-age=31536000, immutable`.

## History check

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files. I also checked each earlier verification and the prior handoff:

| Earlier item | Live/code check | Result |
| --- | --- | --- |
| Verification 1: immutable hashed assets | Current `/bundles/index-COVnVFIo.js` is immutable for one year. | Confirmed fixed |
| Verification 1: app skip link, target-date feedback, JSON recovery, CSP | The app skip-link regression passes; the date and JSON regressions pass; CSP is present. | Confirmed fixed in the app; see F-1-10 for the separate static 404 regression |
| Verification 2: 44 px targets and demo-backed claims | The 390 px target sweep and all seven demo-backed claim commands pass. | Confirmed fixed |
| Verification 3: first desktop action | The sample action is within the cold 1440 × 900 viewport. | Confirmed fixed |
| Verification 4: previous no-defect result | Core workflow, demo, offline check, claims, and visual system still pass. | Confirmed; this review found additional first-read and static-404 checks not covered there |

## Findings

### F-1-1 — P2 — README opening exceeds the 22-word cap

**Location and quote:** `README.md`, opening paragraph: “It turns a 6–12 week study plan into an inspectable agreement: define the syllabus slice, link rigorous problems, state the evidence and rubric up front, collect a human reviewer response, then export a cryptographically integrity-sealed completion packet.” (37 words)

**Why this matters:** A first-time visitor has to unpack several actions and two technical descriptions in one sentence. This exceeds the plain-words limit.

**Concrete fix:** Replace it with three sentences: “Plan a 6–12 week study checkpoint. Add problems, evidence, a rubric, and a reviewer. Export a completion packet that shows whether its contents changed.”

### F-1-2 — P3 — “Your desk” is a mood label, not a section name

**Location and quote:** landing workbench eyebrow: “Your desk” (2 words).

**Why this matters:** It gives no useful name for the destination that follows. A screen-reader heading/listener and a first-time visitor need the actual section name.

**Concrete fix:** Remove the eyebrow or replace it with “Your checkpoint plan.” The existing `Checkpoint builder` heading can remain.

### F-1-3 — P3 — “Blank side A” is unexplained brand language

**Location and quote:** landing empty-state eyebrow: “Blank side A” (3 words).

**Why this matters:** The cassette reference does not explain the empty state or the next task.

**Concrete fix:** Replace it with “No checkpoint yet.”

### F-1-4 — P3 — “Checkable promise” does not name the result

**Location and quote:** landing empty-state heading: “Turn a reading plan into a checkable promise.” (8 words)

**Why this matters:** “Checkable promise” is a metaphor rather than a concrete product result. It also changes the product’s main term from “checkpoint” to “promise.”

**Concrete fix:** Replace it with “Create your first study checkpoint.”

### F-1-5 — P3 — “Integrity-sealed” is unexplained jargon

**Location and quote:** landing How it works step 03: “Export a peer-reviewed, integrity-sealed packet.” (5 words).

**Why this matters:** A visitor cannot tell what the seal does or why it is useful from this wording.

**Concrete fix:** Replace it with “Export a reviewed packet that shows whether it changed.” Keep the precise P-256 detail in a nearby help sentence or the packet screen.

### F-1-6 — P3 — Review terminology is inconsistent

**Location and quotes:** landing “Review is human and non-accredited.”; README “Peer review is always labelled non-accredited.”; README “exports their checksum-protected response”; builder and demo use “reviewer,” “human review,” and “peer response.”

**Why this matters:** “Peer,” “human,” and “reviewer” describe the same role but are used interchangeably. “Checksum-protected” is also not explained for the intended reader.

**Concrete fix:** Use **reviewer** and **review response** throughout. For example: “Review is done by a reviewer and is not accredited.” Replace “checksum-protected response” with “review response with a change check,” or explain the checksum beside it.

### F-1-7 — P2 — Claim-like product statements are absent from `.factory/claims.json`

**Location and quotes:** The following statements can guide a visitor’s choice but have no matching claim entry and observable test. Existing broad workflow tests do not check these stated conditions.

| Location | Unlisted claim-like sentence | Concrete fix |
| --- | --- | --- |
| Landing empty state | “Your work saves locally as you type.” | Add `local-autosave` with a browser test that edits a real checkpoint, reloads, and confirms the edit remains in real local storage; or remove this sentence. |
| Landing limits and README opening | “It does not teach, grade proofs, verify identity, proctor work, or issue credentials.” / “It deliberately does not issue credentials, grade proofs, proctor work, or redistribute exercises.” | Add one `scope-limits` test that checks the required disclosures on the landing, reviewer, packet, and README-facing content; use one consistent scope sentence. |
| Landing fact and README | “Review is human and non-accredited.” / “Peer review is always labelled non-accredited.” | Add `non-accredited-review` that opens the owner and reviewer flows and confirms the disclosure. |
| Landing footer and README feature list | “No analytics or trackers.” / “Saves multiple checkpoint plans locally with no account or tracking.” | Add `no-tracking` that records requests and checks the loaded resource list for no analytics/tracking code, plus `multiple-local-plans` that creates and reloads two real plans; otherwise remove the unsupported parts. |
| README feature list | “Produces a private-by-possession review link or portable JSON request.” | Add `review-request-options` that checks both exported request formats and the recipient’s access to the encoded link. Replace “private-by-possession” with “Anyone with this link can read the checkpoint.” |
| README privacy section | “Plans and private signing material stay in local storage.” | Add `local-signing-key` that seals a completed real checkpoint and confirms the key stays browser-local while the request log remains same-origin. |
| README privacy section | “A review link contains an encoded copy of the plan, so possession grants access; use the downloadable request when a long URL is inconvenient.” | Split this 24-word sentence. Add an observable review-link disclosure test, or change it to two plain disclosures without the unsupported convenience claim. |

**Why this matters:** The claim suite is strong for its seven listed promises, but the required cross-check is not complete. A visitor cannot tell which additional statements have been verified.

### F-1-8 — P2 — Route changes do not move focus or announce the new page

**Location and evidence:** On live `/`, selecting the header **Privacy** link loaded `/privacy` with `document.activeElement === BODY`; browser Back returned to `/` with focus still on `BODY`. The only `[aria-live]` region was empty on both routes. `src/main.ts` renders route content but does not focus the new `h1` or announce route changes.

**Why this matters:** The address bar and Back work, but keyboard and screen-reader users are not placed at the new page’s content or told that the page changed.

**Concrete fix:** Handle internal navigation with `history.pushState`, render the destination, then focus the destination `h1` (or `main` with an accessible name) and set a polite live message such as “Privacy page.” Do the same in the `popstate` handler and add a browser regression for forward and Back navigation.

### F-1-9 — P2 — Canonical and social metadata describe the home page on non-home routes

**Location and evidence:** Live `/demo`, `/privacy`, `/terms`, and `/404` all retain canonical `https://self-study-checkpoints.sociobot.in/`, home OG title “Self-Study Checkpoints — plan proof of progress,” and home description. The direct HTTP 404 has no description, canonical, or Open Graph/Twitter metadata at all.

**Why this matters:** Shared links and search results can identify a different page as the home page. The direct 404 does not meet the required metadata baseline.

**Concrete fix:** Update canonical, description, OG title/description/URL, and Twitter title/description when the app renders each route. Add complete noindex metadata for `public/404.html` and a route-metadata browser test.

### F-1-10 — P2 — The direct HTTP 404 regresses the prior skip-link fix and has an incomplete shared shell

**Location and evidence:** `https://self-study-checkpoints.sociobot.in/no-such-page` returns the static `public/404.html`. Tab reaches **Skip to main content**, but Enter leaves focus on `BODY`; `main` has no `tabindex`. The page footer only says “Built by Param Factory · v1.0.0” and omits the required Privacy and Terms links. Its header has only the wordmark rather than the normal navigation.

**Why this matters:** This is a live regression of the earlier skip-link finding on the actual HTTP 404 path, and it makes the 404 shell inconsistent with every application route.

**Concrete fix:** Give static `main` `tabindex="-1"`, add the same focus handler used by the app, and include the standard footer one-liner plus Privacy and Terms. Use the normal header navigation or an intentionally equivalent accessible header. Add a direct-unknown-URL test that checks HTTP 404, skip-link focus, metadata, and footer links.

### F-1-11 — P3 — Mobile header links run together visually

**Location and evidence:** At 390 px, the live header renders the adjacent links as **“DemoPrivacy”** with no visible space, although they are separate targets.

**Why this matters:** A first-time visitor can read this as one unclear destination. The crowded header also competes with the required first action.

**Concrete fix:** Give header links a visible gap or separate hit areas while retaining the 44 px target size. Add a 390 px visual/layout regression that checks the rendered text boundaries do not touch.

## Copy audit

Hyphenated terms and number ranges count as one word. “Flag” means the wording is covered by F-1-1 through F-1-7; all other entries are within the 22-word cap and contain usable information.

### Landing page

| Copy unit | Words | Result |
| --- | ---: | --- |
| Self-study checkpoint builder | 3 | Pass |
| Build proof of your self-study progress. | 6 | Pass |
| For independent math and computer-science learners who need a clear checkpoint without enrolling in a course. | 16 | Pass |
| Try it with sample data | 5 | Pass |
| Start your checkpoint | 3 | Pass |
| Free to use. | 3 | Pass |
| Plans stay on this device. | 5 | Pass |
| Review is human and non-accredited. | 5 | Flag F-1-7 |
| How it works | 3 | Pass |
| Define a 6–12 week syllabus slice. | 7 | Pass |
| Agree on evidence and a visible rubric. | 7 | Pass |
| Export a peer-reviewed, integrity-sealed packet. | 5 | Flag F-1-5 |
| Your desk | 2 | Flag F-1-2 |
| Checkpoint builder | 2 | Pass |
| Blank side A | 3 | Flag F-1-3 |
| Turn a reading plan into a checkable promise. | 8 | Flag F-1-4 |
| Start with the exact topic you want to defend. | 9 | Pass |
| Your work saves locally as you type. | 7 | Flag F-1-7 |
| Start a checkpoint | 3 | Pass |
| What this does not do | 5 | Pass |
| It does not teach, grade proofs, verify identity, proctor work, or issue credentials. | 13 | Flag F-1-7 |
| Your reviewer makes the judgment. | 5 | Pass |
| Plan self-study checkpoints for human review. | 6 | Pass |
| Free, non-accredited, and stored on this device. | 7 | Flag F-1-7 |
| Built by Param Factory · v1.0.0 · Original artwork generated with Azure AI Foundry · No analytics or trackers. | 19 | Flag F-1-7 |

### README

| Copy unit | Words | Result |
| --- | ---: | --- |
| Self-Study Checkpoints is a free, local-first web tool for serious independent math and computer-science learners. | 15 | Pass |
| It turns a 6–12 week study plan into an inspectable agreement: define the syllabus slice, link rigorous problems, state the evidence and rubric up front, collect a human reviewer response, then export a cryptographically integrity-sealed completion packet. | 37 | Flag F-1-1 |
| It deliberately does not issue credentials, grade proofs, proctor work, or redistribute exercises. | 13 | Flag F-1-7 |
| Peer review is always labelled non-accredited. | 6 | Flag F-1-6, F-1-7 |
| Live: https://self-study-checkpoints.sociobot.in | 2 | Pass |
| Try the isolated sample: https://self-study-checkpoints.sociobot.in/demo. | 5 | Pass |
| Demo edits stay in page memory and never touch your real checkpoint storage. | 13 | Covered by `demo-sandbox` |
| Saves multiple checkpoint plans locally with no account or tracking. | 10 | Flag F-1-7 |
| Enforces the intended 42–84 day planning window. | 7 | Covered by `workspace-planning` |
| Builds linked proof, code, or mixed-evidence prompts with explicit success criteria. | 11 | Covered by `workspace-planning` |
| Produces a private-by-possession review link or portable JSON request. | 9 | Flag F-1-7 |
| Gives reviewers a focused rubric and exports their checksum-protected response. | 10 | Flag F-1-6 |
| Imports that response, requires evidence for every problem, and exports an ECDSA P-256 sealed JSON packet. | 16 | Covered by `human-review` and `sealed-packet` |
| Verifies exported packet integrity in the browser. | 7 | Covered by `sealed-packet` |
| Works after the first visit without a network connection via a small service worker. | 14 | Covered by `offline-reload` |
| Includes a one-click sample checkpoint whose edits are discarded when you leave. | 12 | Covered by `demo-sandbox` |
| Includes privacy and terms pages at /privacy and /terms. | 9 | Pass |
| Requires Node.js 20 or newer. | 5 | Pass |
| Vite prints the local URL. | 5 | Pass |
| User data remains in that browser profile’s local storage. | 9 | Flag F-1-7 |
| Playwright 1.58.2 is pinned. | 4 | Pass |
| The factory image includes its Chromium build; elsewhere, run npx playwright install chromium once. | 14 | Pass |
| The exact clean build command is npm ci && npm test && npm run build. | 15 | Pass |
| It writes the static site to dist/, with dist/index.html at the root. | 12 | Pass |
| public/staticwebapp.config.json supplies explicit SPA route rewrites, the real 404 response, and security headers. | 13 | Pass |
| Factory workers deploy only through the fleet wrapper. | 8 | Pass |
| It resolves the allowed sf-self-study-checkpoints resource and its deployment token: | 10 | Pass |
| Do not bypass the wrapper with a direct named-app CLI deployment. | 11 | Pass |
| Plans and private signing material stay in local storage. | 9 | Flag F-1-7 |
| A review link contains an encoded copy of the plan, so possession grants access; use the downloadable request when a long URL is inconvenient. | 24 | Flag F-1-7 (>22 words) |
| Completion packet signatures detect changes after export but do not verify a learner’s identity, authorship, mastery, or institutional approval. | 19 | Pass |
| The researched brief is in .factory/brief.json, the visual system and original image provenance are in .factory/design.md, and release verification is in .factory/handoff.md. | 22 | Pass |
| MIT — see LICENSE. | 4 | Pass |

## What would make this perfect

Make the copy consistently name checkpoints, reviewers, review responses, and plain change checks. Add claim entries and observable tests for every remaining visitor-facing promise. Make every route change move focus and announce itself. Bring the direct HTTP 404 into the same accessible, metadata-complete shell as the app. Finally, add visible spacing between the two mobile utility links. After those changes, rerun every listed claim command, the full test/build gates, the cold 390 px and desktop checks, and the direct-404 keyboard check.
