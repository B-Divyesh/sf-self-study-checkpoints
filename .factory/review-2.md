# First-read review 2 — FAIL

**Reviewed:** 1 September 2026 UTC

**Candidate:** `07e990c075ad6862b51af393fd00be80d5447ede`

**Live URL:** <https://self-study-checkpoints.sociobot.in>
**Verdict:** **FAIL** — five findings remain. One earlier finding is only partly fixed, so it remains blocking under the review contract. All 14 listed claim commands pass, but one privacy statement and one provenance statement are still absent from `.factory/claims.json`.

## First 30 seconds

I opened fresh browser contexts at 390 × 844 and 1440 × 900 without scrolling.

- **What it does:** It helps a learner plan a self-study checkpoint and prepare it for review.
- **Who it is for:** Independent math and computer-science learners who want feedback without joining a course.
- **What to click first:** **Try it with sample data**.

All three answers are clear from the first screen. The sample action was visible at 390 px (`top 490`) and desktop (`top 709`). The headline has six words, the audience sentence has 15 words, and the three short facts explain price, storage, and accreditation. This check passes.

## Demo, privacy, and offline checks

The sample opens from the landing page in one click at `/demo`. Its first screen already shows Maya Chen’s **Finite groups checkpoint**, a 56-day window, a syllabus slice, and the first planning form. The persistent banner says **“Demo — sample data, nothing is saved”** and provides **Reset demo** and **Start for real**.

In a fresh live browser context, I placed a sentinel in `self-study-checkpoints:v1`, changed the sample title, and selected Reset demo. The title returned to **“Finite groups checkpoint”**, the sentinel remained unchanged, and no `demo:` storage key appeared. The request log contained only `https://self-study-checkpoints.sociobot.in`. After the service worker controlled the page, a live offline reload kept the banner and populated sample available.

The sample itself is realistic and the isolation behavior passes. The wording inside the sample still has a finding below.

## Claims and clean-clone gates

I cloned the candidate to `/tmp/self-study-checkpoints-review2.TQ0pWb`, ran `npm ci`, and then ran every literal command in `.factory/claims.json`.

| Claim | Result | Observed result |
| --- | --- | --- |
| `workspace-planning` | PASS | The sample contains the 56-day plan, linked problems, criteria, rubric, reviewer, and evidence. |
| `human-review` | PASS | Request export, reviewer response, checksum check, and owner import complete. |
| `sealed-packet` | PASS | Packet export and in-browser ECDSA P-256 verification complete. |
| `free-no-account` | PASS | The sample opens and accepts edits without credentials or payment requests. |
| `offline-reload` | PASS | A dedicated context reloads the controlled sample while offline. |
| `demo-sandbox` | PASS | Reset restores the sample and leaves real storage unchanged. |
| `local-only` | PASS | The tested sample navigation and edits remain same-origin. |
| `local-autosave` | PASS | A real-workspace title remains after reload. |
| `scope-limits` | PASS | Landing, terms, and README limits are present. |
| `non-accredited-review` | PASS | Builder and reviewer views state the reviewer role and non-accredited status. |
| `no-tracking` | PASS | The tested resource log is same-origin and contains no tracking resource. |
| `multiple-local-plans` | PASS | Two real plans remain after reload. |
| `review-request-options` | PASS | Both the review link and JSON request are produced. |
| `review-link-disclosure` | PASS | The sharing disclosure appears beside the action and on Privacy. |

Each claim id occurs on exactly one tagged test. The complete clean-clone gates also pass:

- `npm test`: 8 Vitest checks and 54 Playwright checks passed.
- `npm run build`: passed and created `dist/`.
- Built application JavaScript: 44,312 bytes, 14.49 kB gzip.
- Built CSS: 17,384 bytes, 4.74 kB gzip.
- The live HTML, JavaScript, and CSS hashes match the fresh build.

## Structure, links, and accessibility

The live `/`, `/demo`, `/privacy`, `/terms`, `/404`, and an unknown HTTP 404 were checked directly.

- Each route has `lang=en`, one `h1`, one `main`, a route-specific title, description, canonical URL, Open Graph fields, Twitter card fields, and SVG favicon.
- The unknown path returns HTTP 404 with the designed page. Its skip link moves focus to `main`.
- Selecting Privacy moves focus to its `h1` and announces **“Privacy page.”** Browser Back restores `/`, focuses its `h1`, and announces the page.
- Internal links to home, demo, Privacy, and Terms return 200. The Source destination matches the repository supplied in this work order.
- Live Axe checks at 390 px and 1440 px found no serious or critical issues on home, demo, Privacy, Terms, or the HTTP 404.
- `/opt/fleet/lib/verify-url.sh` passed the live demo: title, language, one `h1`, `main`, image alternatives, labelled buttons, and no page or console error.
- At 390 px there is no horizontal overflow. All visible interactive targets meet the 44 × 44 CSS-pixel requirement.
- The cassette, review-slip, paper, and vermilion visual system is recognisably product-specific and follows `.factory/design.md`; it is not a generic SaaS layout.

Findings for 404 metadata, copy, and the external-link label are listed below.

## History check

I read `.factory/review-1.md`, `.factory/polish-1.md`, the current `.factory/handoff.md`, and every earlier verification report in the repository. I then checked the live site and current code rather than relying on their recorded status.

| Earlier finding | Live and code confirmation | Result |
| --- | --- | --- |
| F-1-1 README opening length | The former 37-word sentence is now four sentences of 13, 6, 8, and 10 words. | Fixed |
| F-1-2 “Your desk” | Landing now says **“Your checkpoint plan.”** | Fixed |
| F-1-3 “Blank side A” | Landing now says **“No checkpoint yet.”** | Fixed |
| F-1-4 “checkable promise” | Landing now says **“Create your first study checkpoint.”** | Fixed |
| F-1-5 unexplained seal wording | Landing now says the reviewed packet shows whether it changed. | Fixed |
| F-1-6 review terminology | Product copy consistently uses **reviewer** and **reviewer response** for the person and result. | Fixed |
| F-1-7 unlisted claims | Seven entries were added, but the signing-material statement still has no matching test; see the repeated blocking finding. | **Half-fixed** |
| F-1-8 route focus and announcements | Privacy navigation and browser Back both focus the destination `h1` and announce it. | Fixed |
| F-1-9 route metadata | Demo, Privacy, Terms, app 404, and HTTP 404 now have route-specific metadata. | Fixed, with a separate touch-icon omission in F-2-2 |
| F-1-10 static 404 shell | HTTP 404, skip-link focus, header, Privacy, Terms, footer one-liner, builder return, and build id are present. | Fixed |
| F-1-11 mobile header spacing | The 390 px links have visible separation and distinct target boxes. | Fixed |

Earlier verification findings for immutable asset caching, date feedback, plain malformed-file recovery, response headers, mobile targets, demo-backed claim entry points, and the desktop first action also remain fixed. The live hashed bundle has a one-year immutable cache header.

## Findings

### F-1-7 — BLOCKING — the earlier claim-coverage finding is only partly fixed

**Exact quote and location:** README line 56: **“Plans and private signing material stay in local storage.”** Live `/privacy`, under **What is stored**: **“Checkpoint plans, links, evidence notes, reviewer responses, and signing keys are stored in your browser’s local storage. They are not sent to us.”** The live Privacy description also says the product keeps signing keys in the browser.

**Check result:** `.factory/claims.json` has no `local-signing-key` entry. `@claim:local-only` records requests only while editing and navigating the sample; it never creates a signing key or exports a packet. `@claim:sealed-packet` creates a sample-mode key, where `saveCheckpoints()` deliberately does not write storage, and it does not record outgoing requests or inspect the exported packet for private material. The earlier review explicitly called for this observable coverage.

The landing footer also says **“Original artwork generated with Azure AI Foundry.”** The repository has prompt sidecars and design provenance, but the statement has no claims entry or consistency test.

**Why this matters:** A visitor is asked to rely on a privacy statement about the most sensitive packet material. The current listed tests do not exercise that statement in the real workspace. The zero-untested-claim rule is not met.

**Concrete fix:** Add `local-signing-key` to `.factory/claims.json`. Its one tagged test should start from `/demo`, select Start for real, complete a real checkpoint, create and import a reviewer response, record requests, export the packet, confirm the private JWK is stored only under `self-study-checkpoints:v1`, and confirm the downloaded packet contains only the public JWK. Add an `artwork-provenance` static claim test that checks the footer statement against `.factory/design.md` and the selected asset sidecar, or remove the runtime provenance statement while retaining the required design record.

### F-2-1 — P2 — sample and 404 headings still use cassette metaphor instead of product terms

**Exact quotes and locations:** Live `/demo` shows **“Sample desk”** and the `h3` **“Your tapes”** on the first sample screen. The editor labels its steps **“Track 01 / Scope”** through **“Track 04 / Packet”** and later uses **“Bind the work, response, and integrity seal.”** Both app and HTTP 404 use the `h1` **“This page is not on the study plan.”** These strings are in `src/main.ts:243`, `src/main.ts:263`, `src/main.ts:307–357`, and `public/404.html:28`.

**Why this matters:** “Desk,” “tapes,” “track,” and the 404 joke are visual-theme language, not navigation or task names. A first-time visitor has just learned the object is a checkpoint; the sample immediately renames the saved checkpoint as a tape. A screen-reader heading list also announces **“Your tapes”** without explaining that these are saved checkpoints.

**Concrete fix:** Use **“Sample checkpoint,” “Your checkpoints,” “Step 1 / Scope”** through **“Step 4 / Packet,”** and **“Add evidence and export the completion packet.”** Change both 404 headlines to **“Page not found.”** Keep cassette imagery as decoration rather than interface terminology.

### F-2-2 — P3 — the direct HTTP 404 omits the required Apple touch icon

**Exact location:** `public/404.html` has `<link rel="icon" href="/favicon.svg">` but no `rel="apple-touch-icon"`. A live unknown path confirmed that the element is absent. App routes include `/apple-touch-icon.png`.

**Why this matters:** The metadata baseline requires both the SVG favicon and 180 px touch icon on every route. The direct error document is a separate HTML page and does not inherit `index.html` metadata.

**Concrete fix:** Add `<link rel="apple-touch-icon" href="/apple-touch-icon.png">` to `public/404.html` and extend the static HTTP 404 test to assert it.

### F-2-3 — P3 — the external source link does not identify its destination

**Exact quote and location:** The footer link is **“Source”** on live app routes (`src/main.ts:125`). It points to GitHub but provides no visible or accessible external-site indication.

**Why this matters:** A visitor cannot know from the label that the link leaves the product site. The site-structure contract requires external links to say so.

**Concrete fix:** Rename it **“Source code on GitHub”** and add accessible text such as **“external site”**. Add a footer-link test covering the visible name and destination.

### F-2-4 — P3 — README still uses unexplained technical and internal terms

**Exact quotes and locations:** README line 3 says **“free local-first tool.”** Line 18 says **“ECDSA P-256 sealed JSON packet.”** Line 37 says **“The factory image includes its Chromium build.”** Line 44 says **“explicit SPA route rewrites.”** Lines 46–52 describe an internal fleet wrapper and end with a deployment warning that uses a security-oriented verb excluded by this review’s neutral-language rule. Line 56 says **“private signing material”** and **“Completion packet signatures.”**

**Why this matters:** These phrases require platform, cryptography, or factory knowledge. The README otherwise addresses learners and contributors in plain language, so the unexplained terms interrupt first-read comprehension.

**Concrete fix:** Use **“a free tool that stores plans in your browser,” “a JSON completion packet with a change check,” “The factory environment already includes Chromium,”** and **“routes each app URL to `index.html`.”** Replace the deployment paragraph with **“Factory workers deploy through the fleet wrapper shown below. Do not deploy directly with a named-app CLI.”** Replace **“private signing material”** with **“the private key used for packet change checks”** and **“packet signatures”** with **“packet change checks.”**

## Copy audit

Word counts use whitespace-separated words; hyphenated terms and number ranges count as one. No sentence exceeds 22 words and no banned marketing adjective appears. “Flag” identifies the wording findings above.

### Landing page — every visible copy unit in a clean real workspace

| Copy unit | Words | Result |
| --- | ---: | --- |
| Self-Study Checkpoints | 2 | Pass |
| Demo | 1 | Pass — route label |
| Privacy | 1 | Pass — route label |
| Review a request | 3 | Pass — result-naming action |
| Verify a packet | 3 | Pass — result-naming action |
| Self-study checkpoint builder | 3 | Pass |
| Plan a self-study checkpoint for review. | 6 | Pass |
| For independent math and computer-science learners who want clear feedback without enrolling in a course. | 15 | Pass |
| Try it with sample data | 5 | Pass — result-naming action |
| Start your checkpoint | 3 | Pass — result-naming action |
| Free. | 1 | Pass; covered by `free-no-account` |
| No account. | 2 | Pass; covered by `free-no-account` |
| Plans stay on this device. | 5 | Pass; covered by `local-autosave` and `local-only` |
| A reviewer decides. | 3 | Pass; covered by `non-accredited-review` |
| It is not accredited. | 4 | Pass; covered by `non-accredited-review` |
| How it works | 3 | Pass |
| Define a 6–12 week syllabus slice. | 6 | Pass; covered by `workspace-planning` |
| Agree on evidence and a visible rubric. | 7 | Pass; covered by `workspace-planning` |
| Export a reviewed packet that shows whether it changed. | 9 | Pass; covered by `human-review` and `sealed-packet` |
| Your checkpoint plan | 3 | Pass |
| Checkpoint builder | 2 | Pass |
| Nothing saved yet | 3 | Pass |
| No checkpoint yet | 3 | Pass |
| Create your first study checkpoint. | 5 | Pass |
| Start with the exact topic you want to defend. | 9 | Pass |
| Your work saves locally as you type. | 7 | Pass; covered by `local-autosave` |
| Start a checkpoint | 3 | Pass — result-naming action |
| What this does not do | 5 | Pass |
| It does not teach, grade proofs, verify identity, proctor work, or issue credentials. | 13 | Pass; covered by `scope-limits` |
| Your reviewer makes the judgment. | 5 | Pass; covered by `non-accredited-review` |
| Plan self-study checkpoints for reviewer feedback. | 6 | Pass |
| Free. | 1 | Pass; covered by `free-no-account` |
| No account. | 2 | Pass; covered by `free-no-account` |
| Plans stay on this device. | 5 | Pass; covered by `local-autosave` and `local-only` |
| Privacy | 1 | Pass — route label |
| Terms | 1 | Pass — route label |
| Source | 1 | **Flag F-2-3** |
| Built by Param Factory. | 4 | Pass |
| Original artwork generated with Azure AI Foundry. | 7 | **Flag F-1-7** |
| No analytics or trackers. | 4 | Pass; covered by `no-tracking` |

### README headings

| Heading | Words | Result |
| --- | ---: | --- |
| Self-Study Checkpoints | 2 | Pass |
| What the v1 does | 4 | Pass |
| Run locally | 2 | Pass |
| Test and build | 3 | Pass |
| Privacy and packet trust | 4 | Flag F-2-4: “packet trust” is less direct than “How packet change checks work” |
| License | 1 | Pass |

### README — every sentence

| Location | Sentence | Words | Result |
| --- | --- | ---: | --- |
| L3 | Self-Study Checkpoints is a free local-first tool for independent math and computer-science learners. | 13 | **Flag F-2-4** |
| L3 | Plan a 6–12 week study checkpoint. | 6 | Pass |
| L3 | Add problems, evidence, a rubric, and a reviewer. | 8 | Pass |
| L3 | Export a completion packet that shows whether its contents changed. | 10 | Pass |
| L5 | It does not teach, grade proofs, verify identity, proctor work, issue credentials, or redistribute exercises. | 15 | Pass |
| L5 | A reviewer’s response is non-accredited. | 5 | Pass |
| L7 | Live: https://self-study-checkpoints.sociobot.in | 2 | Pass |
| L9 | Try the isolated sample: https://self-study-checkpoints.sociobot.in/demo. | 5 | Pass |
| L9 | Demo edits stay in page memory and never touch your real checkpoint storage. | 13 | Pass |
| L13 | Saves multiple checkpoint plans locally. | 5 | Pass |
| L13 | No account, analytics, or tracking is used. | 7 | Pass |
| L14 | Enforces the intended 42–84 day planning window. | 7 | Pass |
| L15 | Builds linked proof, code, or mixed-evidence prompts with explicit success criteria. | 11 | Pass |
| L16 | Produces a review link or portable JSON request. | 8 | Pass |
| L16 | Anyone with the link can read the checkpoint. | 8 | Pass |
| L17 | Gives reviewers a focused rubric and exports a review response with a change check. | 14 | Pass |
| L18 | Imports that response, requires evidence for every problem, and exports an ECDSA P-256 sealed JSON packet. | 16 | **Flag F-2-4** |
| L19 | Verifies exported packet integrity in the browser. | 7 | Pass |
| L20 | Works after the first visit without a network connection via a small service worker. | 14 | Pass |
| L21 | Includes a one-click sample checkpoint whose edits are discarded when you leave. | 12 | Pass |
| L22 | Includes privacy and terms pages at `/privacy` and `/terms`. | 9 | Pass |
| L26 | Requires Node.js 20 or newer. | 5 | Pass |
| L33 | Vite prints the local URL. | 5 | Pass |
| L33 | User data remains in that browser profile’s local storage. | 9 | Pass; see F-1-7 for the separate signing-key statement |
| L37 | Playwright 1.58.2 is pinned. | 4 | Pass |
| L37 | The factory image includes its Chromium build; elsewhere, run `npx playwright install chromium` once. | 14 | **Flag F-2-4** |
| L44 | The exact clean build command is `npm ci && npm test && npm run build`. | 15 | Pass; rerun successfully |
| L44 | It writes the static site to `dist/`, with `dist/index.html` at the root. | 12 | Pass; rerun successfully |
| L44 | `public/staticwebapp.config.json` supplies explicit SPA route rewrites, the real 404 response, and security headers. | 13 | **Flag F-2-4** |
| L46 | Factory workers deploy only through the fleet wrapper. | 8 | **Flag F-2-4** |
| L46 | It resolves the allowed `sf-self-study-checkpoints` resource and its deployment token. | 10 | **Flag F-2-4** |
| L52 | Deployment warning; source wording omitted to follow the required neutral-language rule. | 11 | **Flag F-2-4** |
| L56 | Plans and private signing material stay in local storage. | 9 | **Flag F-1-7 and F-2-4** |
| L56 | A review link contains an encoded copy of the plan. | 10 | Pass |
| L56 | Anyone with that link can read it. | 7 | Pass |
| L56 | Download the request as JSON when you need a file. | 10 | Pass |
| L56 | Completion packet signatures detect changes after export but do not verify a learner’s identity, authorship, mastery, or institutional approval. | 19 | **Flag F-2-4** |
| L58 | The researched brief is in `.factory/brief.json`, the visual system and original image provenance are in `.factory/design.md`, and release verification is in `.factory/handoff.md`. | 22 | Pass |
| L62 | MIT — see `LICENSE`. | 4 | Pass |

### Terminology check

The landing page consistently uses **checkpoint**, **problem**, **evidence**, **reviewer**, **rubric**, **completion packet**, and **demo**. The sample regresses that clarity by renaming checkpoints as **tapes** and steps as **tracks**; see F-2-1.

## Missed leverage

No finding. The brief calls for planning, reviewer handoff, import/export, and a portable completion packet; all are present. Sync is not an obvious requirement for this local-only tool. Automated generation or grading would weaken the explicit human-review boundary, so an AI feature is not justified here.

## What would make this perfect

Add the missing signing-key and provenance claim coverage. Replace the remaining cassette metaphors in functional headings with checkpoint and step terms. Add the Apple touch icon to the direct 404, identify GitHub in the Source link, and rewrite the README’s technical/internal phrases in plain language. Then rerun all 14 claim commands, the full test/build gates, the live 390 px and desktop checks, the offline request-log check, and the direct HTTP 404 metadata check. The product reaches PASS only when those reruns leave zero findings and no untested statement.
