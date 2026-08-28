import { describe, expect, it } from "vitest";
import {
  createCompletionPacket,
  decodeRequest,
  durationDays,
  encodeRequest,
  newCheckpoint,
  requestFromCheckpoint,
  stableStringify,
  validateCheckpoint,
  verifyCompletionPacket
} from "../src/model";

function completeCheckpoint() {
  const checkpoint = newCheckpoint();
  checkpoint.learnerName = "Ada Learner";
  checkpoint.title = "Finite groups checkpoint";
  checkpoint.topic = "Groups, subgroups, and homomorphisms";
  checkpoint.goal = "Prove core results and explain each choice without omitted steps.";
  checkpoint.reviewerName = "Emmy Reviewer";
  checkpoint.problems.push({
    id: "problem-1",
    title: "Kernel and image",
    sourceUrl: "https://example.com/problem",
    prompt: "Prove the requested result and annotate each dependency.",
    evidenceType: "proof" as const,
    success: "Every implication is justified and the theorem hypotheses are used explicitly."
  });
  return checkpoint;
}

describe("checkpoint model", () => {
  it("enforces the intended 6–12 week window", () => {
    expect(durationDays("2026-08-28", "2026-10-23")).toBe(56);
    const checkpoint = completeCheckpoint();
    checkpoint.targetDate = checkpoint.startDate;
    expect(validateCheckpoint(checkpoint).targetDate).toMatch(/42–84/);
  });

  it("round-trips Unicode review requests", () => {
    const request = requestFromCheckpoint(completeCheckpoint());
    request.goal = "Explain Cayley’s theorem — clearly.";
    expect(decodeRequest(encodeRequest(request))).toEqual(request);
  });

  it("uses deterministic canonical JSON", () => {
    expect(stableStringify({ z: 1, a: { d: 2, b: 3 } })).toBe('{"a":{"b":3,"d":2},"z":1}');
  });

  it("detects edits to an integrity-sealed packet", async () => {
    const packet = await createCompletionPacket(completeCheckpoint());
    expect(await verifyCompletionPacket(packet)).toBe(true);
    packet.checkpoint.goal = "Changed after export";
    expect(await verifyCompletionPacket(packet)).toBe(false);
  });
});
