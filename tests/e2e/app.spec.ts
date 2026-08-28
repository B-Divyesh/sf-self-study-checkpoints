import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("builds, reviews, exports, and verifies a checkpoint", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await page.getByRole("button", { name: "Start a checkpoint" }).click();

  await page.getByLabel("Learner name").fill("Ada Learner");
  await page.getByLabel("Checkpoint title").fill("Finite groups checkpoint");
  await page.getByLabel("Syllabus slice").fill("Groups, subgroups, and homomorphisms");
  await page.getByLabel("Observable outcome").fill("Prove the core isomorphism results and explain every non-obvious step.");
  await page.getByRole("button", { name: /Next: Problems/ }).click();

  await page.getByRole("button", { name: "Add a problem" }).click();
  await page.getByLabel("Short title").fill("Kernel and image");
  await page.getByLabel("Source link").fill("https://example.com/algebra/problem-4");
  await page.getByLabel("Submission prompt").fill("Prove the result, then state where every hypothesis is used.");
  await page.getByLabel("Visible success criteria").fill("Every implication is justified and notation is defined.");
  await page.getByRole("button", { name: /Next: Review/ }).click();

  await page.getByLabel("Reviewer name").fill("Emmy Reviewer");
  await page.getByRole("button", { name: /Next: Packet/ }).click();
  await page.getByLabel("Evidence title").fill("Proof write-up");
  await page.getByLabel("Public or reviewer-accessible link").fill("https://example.com/ada/proof.pdf");
  await page.getByLabel("Disclosure and notes").fill("Discussed definitions with a study group; proof written independently.");

  await page.getByRole("button", { name: /03 Review/ }).click();
  await page.getByRole("button", { name: "Copy review link" }).click();
  const reviewUrl = await page.evaluate(() => navigator.clipboard.readText());
  expect(reviewUrl).toContain("?review=");

  const reviewer = await context.newPage();
  await reviewer.goto(reviewUrl);
  await expect(reviewer.getByText("This is not an accredited assessment.")).toBeVisible();
  const scoreSelects = reviewer.locator("[data-review-score]");
  for (let index = 0; index < await scoreSelects.count(); index++) await scoreSelects.nth(index).selectOption("4");
  await reviewer.getByLabel("Relationship to learner").fill("Study group peer");
  await reviewer.getByLabel("Overall feedback").fill("The proof is complete, readable, and the dependencies are explicit.");
  await reviewer.getByLabel("Overall decision").selectOption("meets");
  await reviewer.getByLabel(/I attest that I inspected/).check();
  const reviewDownload = reviewer.waitForEvent("download");
  await reviewer.getByRole("button", { name: "Download signed-off response" }).click();
  const reviewFile = await (await reviewDownload).path();
  expect(reviewFile).toBeTruthy();

  await page.getByRole("button", { name: /04 Packet/ }).click();
  await page.locator("#review-file").setInputFiles(reviewFile!);
  await expect(page.getByText("Reviewer response imported and checksum verified.")).toBeVisible();
  const packetDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "Seal and export packet" }).click();
  const packetFile = await (await packetDownload).path();
  expect(packetFile).toBeTruthy();

  await page.locator("#verify-file").setInputFiles(packetFile!);
  await expect(page.getByText(/Seal valid:/)).toBeVisible();
});

test("legal routes and offline-first messaging are present", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page).toHaveTitle(/Privacy/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your study record is yours.");
  await page.goto("/terms");
  await expect(page.getByText("A planning tool, not a credential.")).toBeVisible();
});

test("has no serious or critical accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""))).toEqual([]);
});
