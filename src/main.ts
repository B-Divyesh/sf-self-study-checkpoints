import "./styles.css";
import {
  type Checkpoint,
  type CompletionPacket,
  type Review,
  type ReviewRequest,
  createCompletionPacket,
  createSigningKey,
  decodeRequest,
  encodeRequest,
  newCheckpoint,
  requestFromCheckpoint,
  sha256,
  uid,
  validateCheckpoint,
  verifyCompletionPacket
} from "./model";

const STORAGE_KEY = "self-study-checkpoints:v1";
const STEPS = ["Scope", "Problems", "Review", "Packet"] as const;
const root = document.querySelector<HTMLDivElement>("#app")!;

let checkpoints = loadCheckpoints();
let activeId = checkpoints[0]?.id || "";
let step = 0;
let notice = "";
let request: ReviewRequest | null = requestFromUrl();
let deleted: { checkpoint: Checkpoint; index: number } | null = null;

function loadCheckpoints(): Checkpoint[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCheckpoints(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checkpoints));
    setSaveLabel("Saved on this device");
  } catch {
    setNotice("Storage is full or unavailable. Export your work before leaving this page.", "error");
  }
}

function activeCheckpoint(): Checkpoint | undefined {
  return checkpoints.find((item) => item.id === activeId);
}

function requestFromUrl(): ReviewRequest | null {
  const value = new URLSearchParams(location.search).get("review");
  if (!value) return null;
  try {
    return decodeRequest(value);
  } catch (error) {
    notice = error instanceof Error ? error.message : "The review link could not be read.";
    return null;
  }
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function svg(name: "tape" | "check" | "download" | "link" | "lock" | "plus"): string {
  const paths = {
    tape: '<rect x="3" y="6" width="18" height="13" rx="2"/><circle cx="8" cy="12" r="2.5"/><circle cx="16" cy="12" r="2.5"/><path d="m9 18 2-3h2l2 3"/>',
    check: '<path d="m4 12 5 5L20 6"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 20h16"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>'
  };
  return `<svg aria-hidden="true" viewBox="0 0 24 24">${paths[name]}</svg>`;
}

function setNotice(message: string, kind: "success" | "error" = "success"): void {
  notice = message;
  const region = document.querySelector<HTMLElement>("#notice");
  if (region) {
    region.className = `notice ${kind}`;
    region.innerHTML = `${escapeHtml(message)}${deleted ? ' <button class="text-button" data-action="undo-delete">Undo</button>' : ""}`;
  }
}

function setSaveLabel(message: string): void {
  const label = document.querySelector("#save-status");
  if (label) label.textContent = message;
}

function shell(content: string, page: "app" | "legal" | "review" = "app"): string {
  return `
    <header class="site-header">
      <a class="wordmark" href="/" aria-label="Self-Study Checkpoints home">${svg("tape")}<span>Self-Study<br>Checkpoints</span></a>
      <nav aria-label="Utility navigation">
        ${page === "app" ? '<button class="quiet-button" data-action="open-request">Review a request</button><button class="quiet-button" data-action="verify-packet">Verify a packet</button>' : '<a class="quiet-link" href="/">Back to builder</a>'}
      </nav>
      <input class="visually-hidden" id="request-file" type="file" accept="application/json,.json" tabindex="-1" aria-label="Choose a review request file">
      <input class="visually-hidden" id="verify-file" type="file" accept="application/json,.json" tabindex="-1" aria-label="Choose a completion packet to verify">
    </header>
    <div class="offline-banner" id="offline-banner" role="status" hidden>Offline — your desk still works. Changes remain on this device.</div>
    ${content}
    <div id="notice" class="notice" aria-live="polite">${escapeHtml(notice)}</div>
    <footer>
      <div><strong>Peer reviewed, never accredited.</strong><p>Your work stays in this browser unless you export or share it.</p></div>
      <nav aria-label="Legal"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="https://github.com/B-Divyesh/sf-self-study-checkpoints">Source</a></nav>
      <p class="provenance">Hero artwork generated for this product with Azure AI Foundry. No analytics or trackers.</p>
    </footer>`;
}

function render(): void {
  const path = location.pathname.replace(/\/$/, "") || "/";
  if (path === "/privacy" || path === "/terms") {
    root.innerHTML = shell(renderLegal(path), "legal");
  } else if (request) {
    root.innerHTML = shell(renderReviewer(request), "review");
  } else {
    root.innerHTML = shell(renderApp(), "app");
  }
  syncNetworkState();
}

function renderLegal(path: string): string {
  const privacy = path === "/privacy";
  document.title = `${privacy ? "Privacy" : "Terms"} — Self-Study Checkpoints`;
  return `<main id="main" class="legal-page">
    <p class="eyebrow">Plain-language ${privacy ? "privacy note" : "terms"}</p>
    <h1>${privacy ? "Your study record is yours." : "A planning tool, not a credential."}</h1>
    <p class="lede">Effective 28 August 2026</p>
    ${privacy ? `
      <h2>What is stored</h2><p>Checkpoint plans, links, evidence notes, reviewer responses, and signing keys are stored in your browser’s local storage. They are not sent to us.</p>
      <h2>What you choose to share</h2><p>Review links encode a copy of your checkpoint in the URL. Anyone who receives that link can read it. Exported JSON files contain the details shown before export. Remove private or sensitive material before sharing.</p>
      <h2>Network and analytics</h2><p>The app loads only files from this site. It uses no advertising, behavioral analytics, third-party fonts, or tracking scripts. The hosting platform may retain ordinary security and access logs.</p>
      <h2>Delete your data</h2><p>Delete checkpoints in the builder or clear this site’s browser data. Download an export first if you need a copy. The service worker keeps only public application files for offline use, not your study record.</p>` : `
      <h2>Purpose</h2><p>Self-Study Checkpoints helps independent learners plan an assessment, request human feedback, and package evidence. It does not teach, proctor, grade automatically, or issue accredited qualifications.</p>
      <h2>Your responsibility</h2><p>Only link to exercises and resources you are allowed to share. Do not upload copyrighted problem text, confidential work, personal data, or credentials. You are responsible for checking the accuracy of every packet.</p>
      <h2>Peer review</h2><p>A reviewer response is an opinion from the named person, not an identity-verified signature. The cryptographic packet seal detects later edits; it does not prove identity, authorship, mastery, or institutional approval.</p>
      <h2>Availability and warranty</h2><p>The tool is provided under the MIT License, without warranty. Local browser data can be lost, so keep exports of important work. The service may change or become unavailable.</p>`}
    <p><a class="button secondary" href="/">Return to your desk</a></p>
  </main>`;
}

function renderApp(): string {
  document.title = "Self-Study Checkpoints — evidence for independent learning";
  const active = activeCheckpoint();
  return `<main id="main">
    <section class="hero" aria-labelledby="page-title">
      <div class="hero-copy">
        <p class="eyebrow">Independent study, made inspectable</p>
        <h1 id="page-title">Make your next hard topic count.</h1>
        <p class="lede">Set a rigorous checkpoint. Hand the rubric to someone you trust. Leave with a portable record—not a pretend credential.</p>
        <a class="button primary" href="#workbench">${active ? "Continue your checkpoint" : "Build a checkpoint"}<span aria-hidden="true"> ↓</span></a>
        <p class="trust-line">Free · local-first · no account · no automated proof grading</p>
      </div>
      <picture class="hero-art">
        <source media="(max-width: 760px)" srcset="/assets/checkpoint-cassette-768.webp">
        <img src="/assets/checkpoint-cassette-1280.webp" srcset="/assets/checkpoint-cassette-768.webp 768w, /assets/checkpoint-cassette-1280.webp 1280w" sizes="(max-width: 760px) 100vw, 58vw" width="1280" height="853" fetchpriority="high" decoding="async" alt="A transparent cassette, graph-paper review slip, pencil, and tape check mark arranged on a study desk">
      </picture>
    </section>
    <section class="principles" aria-label="How it works">
      <p><span>01</span> Define a 6–12 week syllabus slice.</p>
      <p><span>02</span> Agree on evidence and a visible rubric.</p>
      <p><span>03</span> Export a peer-reviewed, integrity-sealed packet.</p>
    </section>
    <section class="workbench" id="workbench" aria-labelledby="workbench-title">
      <div class="workbench-heading">
        <div><p class="eyebrow">Your desk</p><h2 id="workbench-title">Checkpoint builder</h2></div>
        <div class="save-state"><span class="status-dot" aria-hidden="true"></span><span id="save-status">${active ? "Saved on this device" : "Nothing saved yet"}</span></div>
      </div>
      ${active ? renderWorkspace(active) : renderEmpty()}
    </section>
  </main>`;
}

function renderEmpty(): string {
  return `<div class="empty-state">
    <div class="empty-tape" aria-hidden="true">${svg("tape")}</div>
    <p class="eyebrow">Blank side A</p>
    <h3>Turn a reading plan into a checkable promise.</h3>
    <p>Start with the exact topic you want to defend. Your work saves locally as you type.</p>
    <button class="button primary" data-action="new-checkpoint">${svg("plus")} Start a checkpoint</button>
  </div>`;
}

function renderWorkspace(checkpoint: Checkpoint): string {
  const errors = validateCheckpoint(checkpoint);
  return `<div class="workspace">
    <aside class="library" aria-label="Saved checkpoints">
      <div class="library-top"><h3>Your tapes</h3><button class="icon-button" data-action="new-checkpoint" aria-label="Create a new checkpoint">${svg("plus")}</button></div>
      <ul>${checkpoints.map((item) => `<li><button class="library-item ${item.id === checkpoint.id ? "active" : ""}" data-action="switch-checkpoint" data-id="${escapeHtml(item.id)}"><span>${escapeHtml(item.title || "Untitled checkpoint")}</span><small>${escapeHtml(item.topic || "Add a topic")}</small></button></li>`).join("")}</ul>
      <button class="text-button danger-text" data-action="delete-checkpoint" data-id="${escapeHtml(checkpoint.id)}">Delete this checkpoint</button>
    </aside>
    <div class="editor">
      <ol class="step-tabs" aria-label="Checkpoint steps">${STEPS.map((label, index) => `<li><button class="step-tab ${index === step ? "active" : ""}" data-action="step" data-step="${index}" ${index === step ? 'aria-current="step"' : ""}><span>0${index + 1}</span>${label}${stepComplete(checkpoint, index) ? `<i aria-label="complete">${svg("check")}</i>` : ""}</button></li>`).join("")}</ol>
      <form class="sheet" id="checkpoint-form" novalidate>
        ${step === 0 ? renderScope(checkpoint, errors) : ""}
        ${step === 1 ? renderProblems(checkpoint, errors) : ""}
        ${step === 2 ? renderReviewPlan(checkpoint, errors) : ""}
        ${step === 3 ? renderPacket(checkpoint, errors) : ""}
        <div class="step-actions">
          ${step > 0 ? '<button class="button secondary" type="button" data-action="previous-step">← Previous</button>' : '<span></span>'}
          ${step < 3 ? `<button class="button primary" type="button" data-action="next-step">Next: ${STEPS[step + 1]} →</button>` : ""}
        </div>
      </form>
    </div>
  </div>`;
}

function field(label: string, name: keyof Checkpoint, value: string, options: { type?: string; hint?: string; required?: boolean; error?: string; textarea?: boolean } = {}): string {
  const id = `field-${String(name)}`;
  const described = [options.hint ? `${id}-hint` : "", options.error ? `${id}-error` : ""].filter(Boolean).join(" ");
  return `<div class="field ${options.error ? "has-error" : ""}">
    <label for="${id}">${label}${options.required ? " <span aria-hidden=\"true\">*</span>" : ""}</label>
    ${options.hint ? `<p class="hint" id="${id}-hint">${options.hint}</p>` : ""}
    ${options.textarea ? `<textarea id="${id}" data-field="${String(name)}" ${options.required ? "required" : ""} ${described ? `aria-describedby="${described}"` : ""}>${escapeHtml(value)}</textarea>` : `<input id="${id}" data-field="${String(name)}" type="${options.type || "text"}" value="${escapeHtml(value)}" ${options.required ? "required" : ""} ${described ? `aria-describedby="${described}"` : ""}>`}
    ${options.error ? `<p class="field-error" id="${id}-error" role="alert">${escapeHtml(options.error)}</p>` : ""}
  </div>`;
}

function renderScope(checkpoint: Checkpoint, errors: Record<string, string>): string {
  const days = Math.max(0, Math.round((new Date(`${checkpoint.targetDate}T00:00:00Z`).getTime() - new Date(`${checkpoint.startDate}T00:00:00Z`).getTime()) / 86_400_000));
  return `<div class="sheet-heading"><p class="track-label">Track 01 / Scope</p><h3>Name the claim you want to defend.</h3><p>Keep the slice narrow enough to assess deeply in one sitting.</p></div>
    <div class="form-grid">
      ${field("Learner name", "learnerName", checkpoint.learnerName, { required: true, error: errors.learnerName })}
      ${field("Checkpoint title", "title", checkpoint.title, { required: true, hint: "Example: Groups, homomorphisms, and quotients", error: errors.title })}
      ${field("Syllabus slice", "topic", checkpoint.topic, { required: true, hint: "Name chapters, concepts, or a small project boundary.", error: errors.topic })}
      ${field("Observable outcome", "goal", checkpoint.goal, { required: true, textarea: true, hint: "What should you be able to prove, explain, or build without hidden grading?", error: errors.goal })}
      <div class="date-pair">
        ${field("Start date", "startDate", checkpoint.startDate, { type: "date", required: true })}
        ${field("Target date", "targetDate", checkpoint.targetDate, { type: "date", required: true, error: errors.targetDate })}
      </div>
      <p class="duration-note ${days < 42 || days > 84 ? "warning" : "good"}"><strong>${days || "—"} days</strong> ${days >= 42 && days <= 84 ? "— inside the recommended 6–12 week window." : "— set a target between 42 and 84 days."}</p>
    </div>`;
}

function renderProblems(checkpoint: Checkpoint, errors: Record<string, string>): string {
  return `<div class="sheet-heading"><p class="track-label">Track 02 / Problems</p><h3>Choose work that exposes understanding.</h3><p>Link to source material; do not paste or redistribute copyrighted exercises.</p></div>
    ${errors.problems ? `<p class="form-summary" role="alert">${escapeHtml(errors.problems)}</p>` : ""}
    <div class="item-list">${checkpoint.problems.length ? checkpoint.problems.map((problem, index) => `<fieldset class="artifact-card">
      <legend>Problem ${String(index + 1).padStart(2, "0")}</legend>
      <div class="field"><label for="problem-title-${problem.id}">Short title <span aria-hidden="true">*</span></label><input id="problem-title-${problem.id}" required data-problem="${problem.id}" data-problem-field="title" value="${escapeHtml(problem.title)}"></div>
      <div class="field"><label for="problem-url-${problem.id}">Source link <span aria-hidden="true">*</span></label><p class="hint">Use a lawful public link or citation; the packet stores the link, not the exercise.</p><input id="problem-url-${problem.id}" required type="url" inputmode="url" data-problem="${problem.id}" data-problem-field="sourceUrl" value="${escapeHtml(problem.sourceUrl)}"></div>
      <div class="field"><label for="problem-prompt-${problem.id}">Submission prompt <span aria-hidden="true">*</span></label><textarea id="problem-prompt-${problem.id}" required data-problem="${problem.id}" data-problem-field="prompt">${escapeHtml(problem.prompt)}</textarea></div>
      <div class="field"><label for="problem-type-${problem.id}">Evidence type</label><select id="problem-type-${problem.id}" data-problem="${problem.id}" data-problem-field="evidenceType"><option value="proof" ${problem.evidenceType === "proof" ? "selected" : ""}>Written proof</option><option value="code" ${problem.evidenceType === "code" ? "selected" : ""}>Code and explanation</option><option value="mixed" ${problem.evidenceType === "mixed" ? "selected" : ""}>Mixed evidence</option></select></div>
      <div class="field"><label for="problem-success-${problem.id}">Visible success criteria <span aria-hidden="true">*</span></label><textarea id="problem-success-${problem.id}" required data-problem="${problem.id}" data-problem-field="success">${escapeHtml(problem.success)}</textarea></div>
      <button class="text-button danger-text" type="button" data-action="remove-problem" data-id="${problem.id}">Remove problem</button>
    </fieldset>`).join("") : `<div class="inline-empty"><p>No problems yet. Start with one task that a reviewer can inspect without guessing your intent.</p></div>`}</div>
    <button class="button secondary" type="button" data-action="add-problem">${svg("plus")} Add a problem</button>`;
}

function renderReviewPlan(checkpoint: Checkpoint, errors: Record<string, string>): string {
  return `<div class="sheet-heading"><p class="track-label">Track 03 / Review</p><h3>Make the judgment visible before the attempt.</h3><p>The reviewer is someone you choose. Their response is peer feedback, not accreditation or identity verification.</p></div>
    <div class="reviewer-fields">
      ${field("Reviewer name", "reviewerName", checkpoint.reviewerName, { required: true, error: errors.reviewerName })}
      ${field("Contact note", "reviewerContact", checkpoint.reviewerContact, { hint: "Optional—email or how you know them. Kept local until export." })}
      ${field("Instructions for the reviewer", "reviewerInstructions", checkpoint.reviewerInstructions, { textarea: true })}
    </div>
    <div class="rubric-heading"><div><h4>Rubric</h4><p>Each line is scored 1–4. A score of ${checkpoint.passThreshold} or higher meets the line.</p></div><label for="threshold">Pass at <select id="threshold" data-field="passThreshold"><option value="2" ${checkpoint.passThreshold === 2 ? "selected" : ""}>2 / 4</option><option value="3" ${checkpoint.passThreshold === 3 ? "selected" : ""}>3 / 4</option><option value="4" ${checkpoint.passThreshold === 4 ? "selected" : ""}>4 / 4</option></select></label></div>
    <div class="rubric-list">${checkpoint.rubric.map((item, index) => `<fieldset class="rubric-row"><legend>Criterion ${index + 1}</legend><div class="field"><label for="rubric-label-${item.id}">Name</label><input id="rubric-label-${item.id}" data-rubric="${item.id}" data-rubric-field="label" value="${escapeHtml(item.label)}"></div><div class="field"><label for="rubric-description-${item.id}">What the reviewer should inspect</label><textarea id="rubric-description-${item.id}" data-rubric="${item.id}" data-rubric-field="description">${escapeHtml(item.description)}</textarea></div>${checkpoint.rubric.length > 1 ? `<button type="button" class="text-button" data-action="remove-rubric" data-id="${item.id}">Remove criterion</button>` : ""}</fieldset>`).join("")}</div>
    <button class="text-button add-line" type="button" data-action="add-rubric">${svg("plus")} Add a criterion</button>
    <div class="handoff-strip"><div>${svg("link")}<p><strong>Ready for a human check?</strong><br><span>Share a private-by-possession link or download the same request as JSON.</span></p></div><div class="handoff-actions"><button class="button primary" type="button" data-action="copy-review-link">Copy review link</button><button class="button secondary" type="button" data-action="download-request">${svg("download")} Request file</button></div></div>`;
}

function renderPacket(checkpoint: Checkpoint, errors: Record<string, string>): string {
  const missingEvidence = checkpoint.problems.filter((problem) => !checkpoint.evidence.some((evidence) => evidence.problemId === problem.id && evidence.url.trim()));
  const valid = Object.keys(errors).length === 0;
  const ready = valid && missingEvidence.length === 0 && Boolean(checkpoint.review?.attestation);
  return `<div class="sheet-heading"><p class="track-label">Track 04 / Packet</p><h3>Bind the work, response, and integrity seal.</h3><p>Evidence stays as links. Use a durable repository, document, or archive you control.</p></div>
    <div class="evidence-block"><div class="section-line"><h4>Evidence links</h4><span>${checkpoint.evidence.length}/${checkpoint.problems.length} problems covered</span></div>
      ${checkpoint.problems.length ? checkpoint.problems.map((problem) => {
        const evidence = checkpoint.evidence.find((item) => item.problemId === problem.id);
        return `<fieldset class="evidence-row"><legend>${escapeHtml(problem.title || "Untitled problem")}</legend>
          <div class="field"><label for="evidence-title-${problem.id}">Evidence title</label><input id="evidence-title-${problem.id}" data-evidence-problem="${problem.id}" data-evidence-field="title" value="${escapeHtml(evidence?.title || "")}"></div>
          <div class="field"><label for="evidence-url-${problem.id}">Public or reviewer-accessible link</label><input id="evidence-url-${problem.id}" type="url" inputmode="url" data-evidence-problem="${problem.id}" data-evidence-field="url" value="${escapeHtml(evidence?.url || "")}"></div>
          <div class="field"><label for="evidence-notes-${problem.id}">Disclosure and notes</label><textarea id="evidence-notes-${problem.id}" data-evidence-problem="${problem.id}" data-evidence-field="notes">${escapeHtml(evidence?.notes || "")}</textarea></div>
        </fieldset>`;
      }).join("") : '<p class="form-summary">Add problems in Track 02 before attaching evidence.</p>'}
    </div>
    <div class="review-return"><div><p class="eyebrow">Reviewer return</p><h4>${checkpoint.review ? `Response from ${escapeHtml(checkpoint.review.reviewerName)}` : "Import the reviewer’s response"}</h4><p>${checkpoint.review ? `${verdictLabel(checkpoint.review.verdict)} · reviewed ${formatDate(checkpoint.review.reviewedAt)}` : "Ask the reviewer to download their response, then import that JSON file here."}</p></div><button class="button secondary" type="button" data-action="import-review">${svg("download")} ${checkpoint.review ? "Replace response" : "Import response"}</button><input class="visually-hidden" id="review-file" type="file" accept="application/json,.json" tabindex="-1" aria-label="Choose a reviewer response file"></div>
    <div class="packet-checks"><h4>Completion check</h4><ul>
      ${checkLine(valid, "Plan is complete and inside the 6–12 week window")}
      ${checkLine(checkpoint.problems.length > 0 && missingEvidence.length === 0, missingEvidence.length ? `Evidence missing for ${missingEvidence.length} problem${missingEvidence.length === 1 ? "" : "s"}` : "Every problem has an evidence link")}
      ${checkLine(Boolean(checkpoint.review?.attestation), checkpoint.review?.attestation ? "Reviewer attested to their response" : "Reviewer response not imported")}
    </ul></div>
    <div class="seal-box"><div class="seal-icon">${svg("lock")}</div><div><h4>Portable completion packet</h4><p>The JSON export includes the plan, source links, evidence, peer response, public verification key, and an ECDSA integrity seal. The seal detects edits; it does not prove identity or confer credit.</p><button class="button primary" type="button" data-action="export-packet" ${ready ? "" : "disabled"}>${svg("download")} Seal and export packet</button>${!ready ? '<p class="button-note">Complete all three checks to export.</p>' : ""}</div></div>`;
}

function checkLine(done: boolean, label: string): string {
  return `<li class="${done ? "done" : "todo"}"><span aria-hidden="true">${done ? svg("check") : "○"}</span>${escapeHtml(label)}</li>`;
}

function stepComplete(checkpoint: Checkpoint, index: number): boolean {
  const errors = validateCheckpoint(checkpoint);
  if (index === 0) return !["learnerName", "title", "topic", "goal", "targetDate"].some((key) => errors[key]);
  if (index === 1) return !errors.problems;
  if (index === 2) return !errors.reviewerName && checkpoint.rubric.length > 0;
  return Boolean(checkpoint.review && checkpoint.evidence.length >= checkpoint.problems.length);
}

function renderReviewer(reviewRequest: ReviewRequest): string {
  document.title = `Review ${reviewRequest.title} — Self-Study Checkpoints`;
  return `<main id="main" class="review-page">
    <section class="review-intro"><p class="eyebrow">Peer review request</p><h1>${escapeHtml(reviewRequest.title)}</h1><p class="lede">${escapeHtml(reviewRequest.learnerName)} asks you to inspect a self-study checkpoint in <strong>${escapeHtml(reviewRequest.topic)}</strong>.</p><div class="noncredential-note"><strong>This is not an accredited assessment.</strong> Your response is a transparent peer opinion. The app does not verify your identity or grade the work.</div></section>
    <div class="review-layout">
      <aside class="review-brief"><p class="track-label">The agreement</p><dl><div><dt>Window</dt><dd>${formatDate(reviewRequest.startDate)} – ${formatDate(reviewRequest.targetDate)}</dd></div><div><dt>Outcome</dt><dd>${escapeHtml(reviewRequest.goal)}</dd></div><div><dt>Reviewer</dt><dd>${escapeHtml(reviewRequest.reviewerName || "Open request")}</dd></div></dl><p>${escapeHtml(reviewRequest.reviewerInstructions)}</p></aside>
      <form id="review-form" class="review-form" novalidate>
        <section><h2>1. Inspect the work</h2>${reviewRequest.problems.map((problem, index) => { const evidence = reviewRequest.evidence.find((item) => item.problemId === problem.id); return `<article class="problem-review"><p class="eyebrow">Problem ${index + 1} · ${escapeHtml(problem.evidenceType)}</p><h3>${escapeHtml(problem.title)}</h3><p>${escapeHtml(problem.prompt)}</p><p><strong>Success looks like:</strong> ${escapeHtml(problem.success)}</p><p><a href="${safeUrl(problem.sourceUrl)}" target="_blank" rel="noreferrer">Open source ↗</a>${evidence?.url ? ` · <a href="${safeUrl(evidence.url)}" target="_blank" rel="noreferrer">Open evidence ↗</a>` : " · Evidence link not included"}</p>${evidence?.notes ? `<p class="evidence-note"><strong>Learner’s note:</strong> ${escapeHtml(evidence.notes)}</p>` : ""}</article>`; }).join("")}</section>
        <section><h2>2. Score the agreed rubric</h2><p>Use 1 for “not demonstrated” through 4 for “clearly demonstrated.” The agreed threshold is ${reviewRequest.passThreshold}.</p>${reviewRequest.rubric.map((item) => `<fieldset class="score-row"><legend>${escapeHtml(item.label)}</legend><p>${escapeHtml(item.description)}</p><label for="score-${item.id}">Score <span aria-hidden="true">*</span></label><select id="score-${item.id}" data-review-score="${item.id}" required><option value="">Choose 1–4</option><option value="1">1 — Not demonstrated</option><option value="2">2 — Partly demonstrated</option><option value="3">3 — Demonstrated</option><option value="4">4 — Clearly demonstrated</option></select><label for="note-${item.id}">Specific note</label><textarea id="note-${item.id}" data-review-note="${item.id}"></textarea></fieldset>`).join("")}</section>
        <section><h2>3. Return your response</h2><div class="field"><label for="reviewer-name">Your name <span aria-hidden="true">*</span></label><input id="reviewer-name" required value="${escapeHtml(reviewRequest.reviewerName)}"></div><div class="field"><label for="relationship">Relationship to learner</label><input id="relationship" placeholder="Example: study group peer"></div><div class="field"><label for="overall">Overall feedback <span aria-hidden="true">*</span></label><textarea id="overall" required></textarea></div><div class="field"><label for="verdict">Overall decision <span aria-hidden="true">*</span></label><select id="verdict" required><option value="">Choose a decision</option><option value="meets">Meets this checkpoint</option><option value="revise">Revise and return</option><option value="not-yet">Not yet demonstrated</option></select></div><label class="check-field"><input id="attestation" type="checkbox" required><span>I attest that I inspected the linked work and that this response reflects my own judgment. I understand this is non-accredited peer review.</span></label><button class="button primary" type="submit">${svg("download")} Download signed-off response</button><p class="button-note">Send the downloaded JSON file back to ${escapeHtml(reviewRequest.learnerName)}. It contains your typed attestation and a checksum, not a verified digital identity.</p></section>
      </form>
    </div>
  </main>`;
}

function safeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol) ? escapeHtml(parsed.href) : "#";
  } catch { return "#"; }
}

function verdictLabel(verdict: Review["verdict"]): string {
  return verdict === "meets" ? "Meets checkpoint" : verdict === "revise" ? "Revision requested" : "Not yet demonstrated";
}

function formatDate(value: string): string {
  if (!value) return "Not set";
  const date = new Date(value.length === 10 ? `${value}T00:00:00Z` : value);
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(date);
}

function downloadJson(filename: string, data: unknown): void {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename.replace(/[^a-z0-9._-]+/gi, "-").toLowerCase();
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function slug(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "checkpoint";
}

async function readJsonFile(input: HTMLInputElement): Promise<unknown> {
  const file = input.files?.[0];
  if (!file) throw new Error("Choose a JSON file first.");
  if (file.size > 2_000_000) throw new Error("That file is larger than the 2 MB safety limit.");
  return JSON.parse(await file.text());
}

async function handleReviewSubmit(form: HTMLFormElement): Promise<void> {
  if (!request) return;
  if (!form.reportValidity()) return;
  const scores = request.rubric.map((item) => ({
    rubricId: item.id,
    score: Number((form.querySelector(`[data-review-score="${CSS.escape(item.id)}"]`) as HTMLSelectElement).value),
    note: (form.querySelector(`[data-review-note="${CSS.escape(item.id)}"]`) as HTMLTextAreaElement).value.trim()
  }));
  const unsigned = {
    kind: "self-study-review" as const,
    version: 1 as const,
    checkpointId: request.checkpointId,
    checkpointTitle: request.title,
    reviewerName: (form.querySelector("#reviewer-name") as HTMLInputElement).value.trim(),
    relationship: (form.querySelector("#relationship") as HTMLInputElement).value.trim(),
    reviewedAt: new Date().toISOString(),
    scores,
    overall: (form.querySelector("#overall") as HTMLTextAreaElement).value.trim(),
    verdict: (form.querySelector("#verdict") as HTMLSelectElement).value as Review["verdict"],
    attestation: (form.querySelector("#attestation") as HTMLInputElement).checked
  };
  const review: Review = { ...unsigned, checksum: await sha256(unsigned) };
  downloadJson(`${slug(request.title)}-review.json`, review);
  setNotice("Reviewer response downloaded. Send the JSON file back to the learner.");
}

function updateCheckpointField(target: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): void {
  const checkpoint = activeCheckpoint();
  if (!checkpoint) return;
  const fieldName = target.dataset.field as keyof Checkpoint | undefined;
  if (fieldName) {
    if (fieldName === "passThreshold") checkpoint.passThreshold = Number(target.value);
    else (checkpoint as unknown as Record<string, unknown>)[fieldName] = target.value;
  }
  const problemId = target.dataset.problem;
  if (problemId) {
    const problem = checkpoint.problems.find((item) => item.id === problemId);
    if (problem && target.dataset.problemField) (problem as unknown as Record<string, string>)[target.dataset.problemField] = target.value;
  }
  const rubricId = target.dataset.rubric;
  if (rubricId) {
    const rubric = checkpoint.rubric.find((item) => item.id === rubricId);
    if (rubric && target.dataset.rubricField) (rubric as unknown as Record<string, string>)[target.dataset.rubricField] = target.value;
  }
  const evidenceProblem = target.dataset.evidenceProblem;
  if (evidenceProblem) {
    let evidence = checkpoint.evidence.find((item) => item.problemId === evidenceProblem);
    if (!evidence) {
      evidence = { id: uid("evidence"), problemId: evidenceProblem, title: "", url: "", notes: "" };
      checkpoint.evidence.push(evidence);
    }
    if (target.dataset.evidenceField) (evidence as unknown as Record<string, string>)[target.dataset.evidenceField] = target.value;
    if (!evidence.title.trim() && !evidence.url.trim() && !evidence.notes.trim()) checkpoint.evidence = checkpoint.evidence.filter((item) => item.id !== evidence!.id);
  }
  checkpoint.updatedAt = new Date().toISOString();
  saveCheckpoints();
}

document.addEventListener("input", (event) => {
  const target = event.target;
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) updateCheckpointField(target);
});

document.addEventListener("change", (event) => {
  const target = event.target;
  if (target instanceof HTMLSelectElement && (target.dataset.field || target.dataset.problem)) updateCheckpointField(target);
});

document.addEventListener("submit", (event) => {
  if (event.target instanceof HTMLFormElement && event.target.id === "review-form") {
    event.preventDefault();
    void handleReviewSubmit(event.target);
  }
});

document.addEventListener("click", async (event) => {
  const button = (event.target as Element).closest<HTMLElement>("[data-action]");
  if (!button) return;
  const action = button.dataset.action;
  const checkpoint = activeCheckpoint();
  if (action === "new-checkpoint") {
    const created = newCheckpoint(); checkpoints.unshift(created); activeId = created.id; step = 0; saveCheckpoints(); render(); location.hash = "workbench";
  } else if (action === "switch-checkpoint") {
    activeId = button.dataset.id || ""; step = 0; render();
  } else if (action === "delete-checkpoint" && checkpoint) {
    if (confirm(`Delete “${checkpoint.title || "Untitled checkpoint"}” from this device?`)) {
      const index = checkpoints.findIndex((item) => item.id === checkpoint.id); deleted = { checkpoint: structuredClone(checkpoint), index }; checkpoints.splice(index, 1); activeId = checkpoints[0]?.id || ""; saveCheckpoints(); render(); setNotice("Checkpoint deleted from this device.");
    }
  } else if (action === "undo-delete" && deleted) {
    checkpoints.splice(deleted.index, 0, deleted.checkpoint); activeId = deleted.checkpoint.id; deleted = null; saveCheckpoints(); render(); setNotice("Checkpoint restored.");
  } else if (action === "step") {
    step = Number(button.dataset.step); render(); document.querySelector("#workbench-title")?.scrollIntoView({ block: "start" });
  } else if (action === "previous-step") {
    step = Math.max(0, step - 1); render();
  } else if (action === "next-step") {
    step = Math.min(3, step + 1); render(); document.querySelector("#workbench-title")?.scrollIntoView({ block: "start" });
  } else if (action === "add-problem" && checkpoint) {
    checkpoint.problems.push({ id: uid("problem"), title: "", sourceUrl: "", prompt: "", evidenceType: "proof", success: "" }); saveCheckpoints(); render();
  } else if (action === "remove-problem" && checkpoint) {
    const problem = checkpoint.problems.find((item) => item.id === button.dataset.id);
    if (problem && confirm(`Remove “${problem.title || "this problem"}” and its evidence link?`)) { checkpoint.problems = checkpoint.problems.filter((item) => item.id !== problem.id); checkpoint.evidence = checkpoint.evidence.filter((item) => item.problemId !== problem.id); saveCheckpoints(); render(); }
  } else if (action === "add-rubric" && checkpoint) {
    checkpoint.rubric.push({ id: uid("criterion"), label: "", description: "" }); saveCheckpoints(); render();
  } else if (action === "remove-rubric" && checkpoint) {
    checkpoint.rubric = checkpoint.rubric.filter((item) => item.id !== button.dataset.id); saveCheckpoints(); render();
  } else if (action === "copy-review-link" && checkpoint) {
    const errors = validateCheckpoint(checkpoint); if (Object.keys(errors).length) { setNotice("Finish the required plan fields before sharing a review request.", "error"); return; }
    const link = `${location.origin}/?review=${encodeRequest(requestFromCheckpoint(checkpoint))}`;
    try { await navigator.clipboard.writeText(link); setNotice("Private-by-possession review link copied. Share it only with your reviewer."); } catch { window.prompt("Copy this review link", link); }
  } else if (action === "download-request" && checkpoint) {
    const errors = validateCheckpoint(checkpoint); if (Object.keys(errors).length) { setNotice("Finish the required plan fields before downloading a request.", "error"); return; }
    downloadJson(`${slug(checkpoint.title)}-review-request.json`, requestFromCheckpoint(checkpoint)); setNotice("Review request downloaded.");
  } else if (action === "import-review") {
    document.querySelector<HTMLInputElement>("#review-file")?.click();
  } else if (action === "export-packet" && checkpoint) {
    button.setAttribute("aria-busy", "true"); button.textContent = "Sealing…";
    try { if (!checkpoint.signingKey) { checkpoint.signingKey = await createSigningKey(); saveCheckpoints(); } const packet = await createCompletionPacket(checkpoint); downloadJson(`${slug(checkpoint.title)}-completion-packet.json`, packet); setNotice("Integrity-sealed completion packet downloaded."); }
    catch { setNotice("The browser could not create a seal. Try a current browser or export from another device.", "error"); }
    finally { render(); }
  } else if (action === "open-request") {
    document.querySelector<HTMLInputElement>("#request-file")?.click();
  } else if (action === "verify-packet") {
    document.querySelector<HTMLInputElement>("#verify-file")?.click();
  }
});

document.addEventListener("change", async (event) => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || input.type !== "file") return;
  try {
    const data = await readJsonFile(input) as Record<string, unknown>;
    if (input.id === "request-file") {
      if (data.kind !== "self-study-review-request" || data.version !== 1) throw new Error("That file is not a supported review request.");
      request = data as unknown as ReviewRequest; history.pushState({}, "", "/"); render();
    } else if (input.id === "review-file") {
      const checkpoint = activeCheckpoint(); if (!checkpoint) return;
      if (data.kind !== "self-study-review" || data.version !== 1 || data.checkpointId !== checkpoint.id) throw new Error("This response belongs to a different checkpoint or has an unsupported format.");
      const { checksum, ...unsigned } = data;
      if (await sha256(unsigned) !== checksum) throw new Error("The reviewer response checksum does not match. Ask the reviewer to export it again.");
      checkpoint.review = data as unknown as Review; checkpoint.updatedAt = new Date().toISOString(); saveCheckpoints(); render(); setNotice("Reviewer response imported and checksum verified.");
    } else if (input.id === "verify-file") {
      if (data.kind !== "self-study-completion-packet") throw new Error("That file is not a completion packet.");
      const valid = await verifyCompletionPacket(data as unknown as CompletionPacket);
      setNotice(valid ? `Seal valid: “${(data.checkpoint as Checkpoint).title}” has not changed since export.` : "Seal invalid. The packet is damaged, edited, or unsupported.", valid ? "success" : "error");
    }
  } catch (error) {
    setNotice(error instanceof Error ? error.message : "The selected file could not be read.", "error");
  } finally { input.value = ""; }
});

function syncNetworkState(): void {
  const banner = document.querySelector<HTMLElement>("#offline-banner");
  if (banner) banner.hidden = navigator.onLine;
}

window.addEventListener("online", () => { syncNetworkState(); setNotice("Back online. Your local work did not need to sync."); });
window.addEventListener("offline", syncNetworkState);
window.addEventListener("popstate", () => { request = requestFromUrl(); render(); });

if ("serviceWorker" in navigator && import.meta.env.PROD) window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => undefined));

render();
