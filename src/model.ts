export type Problem = {
  id: string;
  title: string;
  sourceUrl: string;
  prompt: string;
  evidenceType: "proof" | "code" | "mixed";
  success: string;
};

export type RubricItem = {
  id: string;
  label: string;
  description: string;
};

export type Evidence = {
  id: string;
  problemId: string;
  title: string;
  url: string;
  notes: string;
};

export type Review = {
  kind: "self-study-review";
  version: 1;
  checkpointId: string;
  checkpointTitle: string;
  reviewerName: string;
  relationship: string;
  reviewedAt: string;
  scores: Array<{ rubricId: string; score: number; note: string }>;
  overall: string;
  verdict: "meets" | "revise" | "not-yet";
  attestation: boolean;
  checksum: string;
};

export type SigningKey = {
  publicJwk: JsonWebKey;
  privateJwk: JsonWebKey;
};

export type Checkpoint = {
  version: 1;
  id: string;
  createdAt: string;
  updatedAt: string;
  learnerName: string;
  title: string;
  topic: string;
  goal: string;
  startDate: string;
  targetDate: string;
  problems: Problem[];
  reviewerName: string;
  reviewerContact: string;
  reviewerInstructions: string;
  rubric: RubricItem[];
  passThreshold: number;
  evidence: Evidence[];
  review?: Review;
  signingKey?: SigningKey;
};

export type ReviewRequest = {
  kind: "self-study-review-request";
  version: 1;
  checkpointId: string;
  title: string;
  learnerName: string;
  topic: string;
  goal: string;
  startDate: string;
  targetDate: string;
  reviewerName: string;
  reviewerInstructions: string;
  problems: Problem[];
  rubric: RubricItem[];
  passThreshold: number;
  evidence: Evidence[];
};

export type CompletionPacket = {
  kind: "self-study-completion-packet";
  version: 1;
  exportedAt: string;
  checkpoint: Omit<Checkpoint, "signingKey">;
  signature: {
    algorithm: "ECDSA-P256-SHA256";
    publicKey: JsonWebKey;
    value: string;
  };
};

const defaultRubric: RubricItem[] = [
  { id: "correctness", label: "Correctness", description: "The reasoning or program reaches a valid result without a material gap." },
  { id: "explanation", label: "Explanation", description: "Claims, choices, and non-obvious steps are explained clearly enough to inspect." },
  { id: "coverage", label: "Coverage", description: "The submitted work addresses the agreed syllabus slice and every listed problem." },
  { id: "independence", label: "Independence", description: "Sources and assistance are disclosed; the learner can defend the submitted work." }
];

export function uid(prefix = "item"): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function isoDate(offsetDays = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

export function newCheckpoint(): Checkpoint {
  const now = new Date().toISOString();
  return {
    version: 1,
    id: uid("checkpoint"),
    createdAt: now,
    updatedAt: now,
    learnerName: "",
    title: "",
    topic: "",
    goal: "",
    startDate: isoDate(),
    targetDate: isoDate(56),
    problems: [],
    reviewerName: "",
    reviewerContact: "",
    reviewerInstructions: "Check the linked work against each criterion. Explain any revision request with a specific example.",
    rubric: structuredClone(defaultRubric),
    passThreshold: 3,
    evidence: []
  };
}

export function sampleCheckpoint(): Checkpoint {
  const checkpoint = newCheckpoint();
  checkpoint.id = "demo-checkpoint-finite-groups";
  checkpoint.learnerName = "Maya Chen";
  checkpoint.title = "Finite groups checkpoint";
  checkpoint.topic = "Groups, subgroups, homomorphisms, and quotient groups";
  checkpoint.goal = "Prove the core isomorphism results and explain where every hypothesis is used.";
  checkpoint.problems = [
    {
      id: "demo-problem-kernel",
      title: "Kernel and image",
      sourceUrl: "https://en.wikipedia.org/wiki/Isomorphism_theorems",
      prompt: "Prove the first isomorphism theorem, then identify the kernel and image in one concrete example.",
      evidenceType: "proof",
      success: "Every map is well-defined, each implication is justified, and the example is checked."
    },
    {
      id: "demo-problem-cosets",
      title: "Cosets in code",
      sourceUrl: "https://en.wikipedia.org/wiki/Coset",
      prompt: "Write a small program that enumerates left cosets and compare its output with a hand-worked example.",
      evidenceType: "mixed",
      success: "The program handles two non-trivial groups and the written comparison explains the result."
    }
  ];
  checkpoint.reviewerName = "Dr. Imani Okafor";
  checkpoint.reviewerContact = "Study group mentor";
  checkpoint.evidence = [
    {
      id: "demo-evidence-kernel",
      problemId: "demo-problem-kernel",
      title: "Draft proof",
      url: "https://example.com/maya/finite-groups-proof.pdf",
      notes: "Definitions discussed with the study group; the proof was written independently."
    }
  ];
  return checkpoint;
}

export function durationDays(start: string, end: string): number {
  if (!start || !end) return 0;
  return Math.round((new Date(`${end}T00:00:00Z`).getTime() - new Date(`${start}T00:00:00Z`).getTime()) / 86_400_000);
}

export function validateCheckpoint(checkpoint: Checkpoint): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!checkpoint.learnerName.trim()) errors.learnerName = "Add the learner name that should appear in the packet.";
  if (!checkpoint.title.trim()) errors.title = "Give this checkpoint a specific title.";
  if (!checkpoint.topic.trim()) errors.topic = "Name the syllabus slice being assessed.";
  if (checkpoint.goal.trim().length < 20) errors.goal = "Describe an observable outcome in at least 20 characters.";
  const days = durationDays(checkpoint.startDate, checkpoint.targetDate);
  if (!Number.isFinite(days) || days < 42 || days > 84) errors.targetDate = "Choose a target 6–12 weeks (42–84 days) after the start.";
  if (!checkpoint.problems.length) errors.problems = "Add at least one problem or project prompt.";
  if (checkpoint.problems.some((problem) => !problem.title.trim() || !problem.sourceUrl.trim() || !problem.prompt.trim() || !problem.success.trim())) {
    errors.problems = "Complete the title, source link, prompt, and success criteria for every problem.";
  }
  if (!checkpoint.reviewerName.trim()) errors.reviewerName = "Name the person you intend to invite.";
  return errors;
}

export function requestFromCheckpoint(checkpoint: Checkpoint): ReviewRequest {
  const { id, title, learnerName, topic, goal, startDate, targetDate, reviewerName, reviewerInstructions, problems, rubric, passThreshold, evidence } = checkpoint;
  return { kind: "self-study-review-request", version: 1, checkpointId: id, title, learnerName, topic, goal, startDate, targetDate, reviewerName, reviewerInstructions, problems, rubric, passThreshold, evidence };
}

export function encodeRequest(request: ReviewRequest): string {
  const bytes = new TextEncoder().encode(JSON.stringify(request));
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

export function decodeRequest(value: string): ReviewRequest {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const parsed = JSON.parse(new TextDecoder().decode(bytes));
  if (parsed?.kind !== "self-study-review-request" || parsed?.version !== 1) throw new Error("This is not a supported review request.");
  return parsed;
}

export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const object = value as Record<string, unknown>;
  return `{${Object.keys(object).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(object[key])}`).join(",")}}`;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlToBytes(value: string): Uint8Array<ArrayBuffer> {
  const binary = atob(value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "="));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export async function sha256(value: unknown): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(stableStringify(value)));
  return bytesToBase64Url(new Uint8Array(hash));
}

export async function createSigningKey(): Promise<SigningKey> {
  const pair = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  return {
    publicJwk: await crypto.subtle.exportKey("jwk", pair.publicKey),
    privateJwk: await crypto.subtle.exportKey("jwk", pair.privateKey)
  };
}

export async function createCompletionPacket(checkpoint: Checkpoint): Promise<CompletionPacket> {
  const signingKey = checkpoint.signingKey || await createSigningKey();
  const { signingKey: _privateMaterial, ...publicCheckpoint } = checkpoint;
  const unsigned = { kind: "self-study-completion-packet", version: 1, exportedAt: new Date().toISOString(), checkpoint: publicCheckpoint } as const;
  const privateKey = await crypto.subtle.importKey("jwk", signingKey.privateJwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, privateKey, new TextEncoder().encode(stableStringify(unsigned)));
  return { ...unsigned, signature: { algorithm: "ECDSA-P256-SHA256", publicKey: signingKey.publicJwk, value: bytesToBase64Url(new Uint8Array(signature)) } };
}

export async function verifyCompletionPacket(packet: CompletionPacket): Promise<boolean> {
  if (packet?.kind !== "self-study-completion-packet" || packet?.version !== 1 || packet?.signature?.algorithm !== "ECDSA-P256-SHA256") return false;
  const unsigned = { kind: packet.kind, version: packet.version, exportedAt: packet.exportedAt, checkpoint: packet.checkpoint };
  try {
    const publicKey = await crypto.subtle.importKey("jwk", packet.signature.publicKey, { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
    return crypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, publicKey, base64UrlToBytes(packet.signature.value), new TextEncoder().encode(stableStringify(unsigned)));
  } catch {
    return false;
  }
}
