import { readFile } from "node:fs/promises";
import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { encodeRequest, requestFromCheckpoint, sampleCheckpoint } from "../../src/model";

async function completeDemoFlow(page: Page, context: BrowserContext): Promise<void> {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/demo");

  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByLabel("Learner name")).toHaveValue("Maya Chen");
  await expect(page.getByLabel("Short title")).toHaveCount(0);
  await page.getByRole("button", { name: /02 Problems/ }).click();
  await expect(page.getByLabel("Short title").first()).toHaveValue("Kernel and image");
  await page.getByRole("button", { name: /04 Packet/ }).click();
  await page.getByLabel("Evidence title").nth(1).fill("Coset program and notes");
  await page.getByLabel("Public or reviewer-accessible link").nth(1).fill("https://example.com/maya/cosets");
  await page.getByLabel("Disclosure and notes").nth(1).fill("Program and written comparison completed for this checkpoint.");

  await page.getByRole("button", { name: /03 Review/ }).click();
  await page.getByRole("button", { name: "Copy review link" }).click();
  const reviewUrl = await page.evaluate(() => navigator.clipboard.readText());
  expect(reviewUrl).toContain("/?demo=1&review=");

  const reviewer = await context.newPage();
  await reviewer.goto(reviewUrl);
  await expect(reviewer).toHaveURL(/\/?demo=1&review=/);
  await expect(reviewer.getByText("Demo — sample data, nothing is saved")).toBeVisible();
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
  await page.getByRole("button", { name: "Export completion packet" }).click();
  const packetFile = await (await packetDownload).path();
  expect(packetFile).toBeTruthy();

  await page.locator("#verify-file").setInputFiles(packetFile!);
  await expect(page.getByText(/Packet check valid:/)).toBeVisible();
}

test("completes the demo owner, reviewer, and packet workflow", async ({ page, context }) => {
  await completeDemoFlow(page, context);
});

test("@claim:workspace-planning shows a complete 42–84 day sample plan", async ({ page }) => {
  await page.goto("/demo");
  await expect(page.getByLabel("Checkpoint title")).toHaveValue("Finite groups checkpoint");
  await expect(page.locator("#duration-note")).toContainText("56 days");
  await page.getByRole("button", { name: /02 Problems/ }).click();
  await expect(page.getByLabel("Visible success criteria").first()).not.toHaveValue("");
  await page.getByRole("button", { name: /03 Review/ }).click();
  await expect(page.getByLabel("Reviewer name")).not.toHaveValue("");
  await page.getByRole("button", { name: /04 Packet/ }).click();
  await expect(page.getByLabel("Public or reviewer-accessible link").first()).not.toHaveValue("");
});

test("@claim:human-review exports and imports a checksum-verified reviewer response", async ({ page, context }) => {
  await completeDemoFlow(page, context);
  await expect(page.getByText(/Packet check valid:/)).toBeVisible();
});

test("@claim:sealed-packet exports and verifies a completion packet change check", async ({ page, context }) => {
  await completeDemoFlow(page, context);
  await expect(page.getByText(/Packet check valid:/)).toBeVisible();
});

test("keeps every visible demo and reviewer control at least 44 by 44 CSS pixels at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  async function expectTargetsToFit(): Promise<void> {
    const undersized = await page.locator("a, button, input:not([type=file]), textarea, select").evaluateAll((controls) => controls
      .filter((control) => !control.classList.contains("visually-hidden"))
      .map((control) => {
        const rect = control.getBoundingClientRect();
        return {
          control: control.getAttribute("aria-label") || control.textContent?.trim() || control.tagName.toLowerCase(),
          width: rect.width,
          height: rect.height
        };
      })
      .filter(({ width, height }) => width < 44 || height < 44));

    expect(undersized).toEqual([]);
  }

  for (const route of ["/", "/demo", "/privacy", "/terms", "/404"]) {
    await page.goto(route);
    await expectTargetsToFit();
  }

  await page.goto("/demo");
  await expect(page.locator(".wordmark")).toHaveJSProperty("offsetWidth", 44);
  await expect(page.locator(".wordmark")).toHaveJSProperty("offsetHeight", 44);
  for (const link of await page.locator("footer a").all()) {
    await expect(link).toHaveJSProperty("offsetHeight", 44);
    expect(await link.evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThanOrEqual(44);
  }

  for (const step of ["02 Problems", "03 Review", "04 Packet"]) {
    await page.getByRole("button", { name: step }).click();
    await expectTargetsToFit();
  }

  const review = encodeRequest(requestFromCheckpoint(sampleCheckpoint()));
  await page.goto(`/demo?review=${review}`);
  await expectTargetsToFit();
});

test("keeps the primary sample action visible without scrolling at 1440 by 900", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const bounds = await page.locator('a.button.primary[href="/?demo=1"]').evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top,
      bottom: rect.bottom,
      viewportHeight: window.innerHeight,
      scrollY: window.scrollY
    };
  });

  expect(bounds.scrollY).toBe(0);
  expect(bounds.top).toBeGreaterThanOrEqual(0);
  expect(bounds.bottom).toBeLessThanOrEqual(bounds.viewportHeight);
});

test("legal routes and offline-first messaging are present", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page).toHaveTitle(/Privacy/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your study record is yours.");
  await page.goto("/terms");
  await expect(page.getByText("A planning tool, not a credential.")).toBeVisible();
});

test("moves skip-link focus to main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe("main");
});

test("moves focus and announces each internal route change, including browser Back", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Privacy" }).first().click();
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await expect(page.locator("#route-announcer")).toHaveText("Privacy page.");
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await expect(page.locator("#route-announcer")).toHaveText("Self-Study Checkpoints — plan study progress page.");
});

test("sets route-specific canonical and social metadata", async ({ page }) => {
  const expectations = [
    ["/", "Self-Study Checkpoints — plan study progress", "https://self-study-checkpoints.sociobot.in/"],
    ["/demo", "Demo — Self-Study Checkpoints", "https://self-study-checkpoints.sociobot.in/demo"],
    ["/privacy", "Privacy — Self-Study Checkpoints", "https://self-study-checkpoints.sociobot.in/privacy"],
    ["/terms", "Terms — Self-Study Checkpoints", "https://self-study-checkpoints.sociobot.in/terms"],
    ["/404", "Page not found — Self-Study Checkpoints", "https://self-study-checkpoints.sociobot.in/404"]
  ];
  for (const [route, title, canonical] of expectations) {
    await page.goto(route);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", canonical);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", title);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", canonical);
  }
});

test("static HTTP 404 shell has metadata, keyboard skip focus, and legal links", async ({ page }) => {
  await page.goto("/404.html");
  await expect(page).toHaveTitle("Page not found — Self-Study Checkpoints");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /requested Self-Study Checkpoints page/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "Page not found — Self-Study Checkpoints");
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute("href", "/apple-touch-icon.png");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe("main");
  await expect(page.getByRole("link", { name: "Privacy" }).last()).toHaveAttribute("href", "/privacy");
  await expect(page.getByRole("link", { name: "Terms" })).toHaveAttribute("href", "/terms");
});

test("opens the isolated sample directly with ?demo=1", async ({ page }) => {
  await page.goto("/?demo=1");
  await expect(page).toHaveTitle("Demo — Self-Study Checkpoints");
  await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
  await expect(page.getByLabel("Checkpoint title")).toHaveValue("Finite groups checkpoint");
  await page.getByRole("button", { name: "Reset demo" }).click();
  await expect(page.getByLabel("Checkpoint title")).toHaveValue("Finite groups checkpoint");
});

test("identifies the external source destination in the footer", async ({ page }) => {
  await page.goto("/");
  const source = page.getByRole("link", { name: "Source code on GitHub (external site)" });
  await expect(source).toHaveAttribute("href", "https://github.com/B-Divyesh/sf-self-study-checkpoints");
  await expect(source).toHaveAttribute("target", "_blank");
});

test("separates mobile header destinations with a visible gap", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const gap = await page.evaluate(() => {
    const demo = [...document.querySelectorAll<HTMLAnchorElement>(".site-header nav a")].find((link) => link.textContent === "Demo")!;
    const privacy = [...document.querySelectorAll<HTMLAnchorElement>(".site-header nav a")].find((link) => link.textContent === "Privacy")!;
    return privacy.getBoundingClientRect().left - demo.getBoundingClientRect().right;
  });
  expect(gap).toBeGreaterThanOrEqual(12);
});

test("updates the 6–12 week feedback while a target date is edited", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start a checkpoint" }).click();
  const startDate = await page.getByLabel("Start date").inputValue();
  const date = new Date(`${startDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 41);
  const invalidTarget = date.toISOString().slice(0, 10);

  await page.getByLabel("Target date").fill(invalidTarget);

  await expect(page.locator("#duration-note")).toContainText("41 days");
  await expect(page.locator("#duration-note")).toContainText("set a target between 42 and 84 days");
  await expect(page.locator("#date-window-error")).toHaveText("Choose a target 6–12 weeks (42–84 days) after the start.");
  await expect(page.getByLabel("Target date")).toHaveAttribute("aria-invalid", "true");
});

test("explains malformed reviewer JSON without exposing parser jargon", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start a checkpoint" }).click();
  await page.getByRole("button", { name: /04 Packet/ }).click();
  await page.locator("#review-file").setInputFiles({
    name: "review.json",
    mimeType: "application/json",
    buffer: Buffer.from("{not json")
  });
  await expect(page.getByText("This file is not valid JSON. Choose the reviewer response file you downloaded, then try again.")).toBeVisible();
  await expect(page.getByText(/Expected property name/)).toHaveCount(0);
});

test("@claim:offline-reload loads the cached shell offline after the service worker takes control", async ({ browser }) => {
  const context = await browser.newContext({ baseURL: "http://127.0.0.1:4173" });
  const page = await context.newPage();
  try {
    await page.goto("/demo");
    await page.evaluate(() => navigator.serviceWorker.ready);
    expect(await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;
      await registration.update();
      return Boolean(registration.active);
    })).toBe(true);
    await page.reload();
    await context.setOffline(true);
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Inspect a checkpoint already in progress.");
  } finally {
    await context.close();
  }
});

test("@claim:demo-sandbox keeps sample changes out of real storage", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("self-study-checkpoints:v1", JSON.stringify([{ marker: "real-data" }])));
  await page.goto("/demo");
  await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
  await expect(page.getByLabel("Checkpoint title")).toHaveValue("Finite groups checkpoint");
  await page.getByLabel("Checkpoint title").fill("Temporary demo edit");
  await page.getByRole("button", { name: "Reset demo" }).click();
  await expect(page.getByLabel("Checkpoint title")).toHaveValue("Finite groups checkpoint");
  expect(await page.evaluate(() => localStorage.getItem("self-study-checkpoints:v1"))).toBe('[{"marker":"real-data"}]');
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith("demo:")))).toEqual([]);
});

test("keeps the complete demo flow on the site origin", async ({ page }) => {
  const origins = new Set<string>();
  page.on("request", (request) => origins.add(new URL(request.url()).origin));
  await page.goto("/demo");
  await page.getByLabel("Checkpoint title").fill("Local-only edit");
  await page.getByRole("button", { name: /02 Problems/ }).click();
  await page.getByRole("button", { name: /03 Review/ }).click();
  await page.getByRole("button", { name: /04 Packet/ }).click();
  expect([...origins]).toEqual(["http://127.0.0.1:4173"]);
});

test("@claim:free-no-account opens and edits the demo without an account or external auth/payment request", async ({ page }) => {
  const urls: string[] = [];
  page.on("request", (request) => urls.push(request.url()));
  await page.goto("/demo");
  await page.getByLabel("Checkpoint title").fill("No account needed");
  await page.getByRole("button", { name: /02 Problems/ }).click();
  expect(urls.every((url) => new URL(url).origin === "http://127.0.0.1:4173")).toBe(true);
  expect(urls.some((url) => /auth|login|payment|checkout/i.test(url))).toBe(false);
});

test("@claim:local-only sends demo data only to the site origin", async ({ page }) => {
  const origins = new Set<string>();
  page.on("request", (request) => origins.add(new URL(request.url()).origin));
  await page.goto("/demo");
  await page.getByLabel("Checkpoint title").fill("Local-only edit");
  await page.getByRole("button", { name: /02 Problems/ }).click();
  await page.getByRole("button", { name: /03 Review/ }).click();
  await page.getByRole("button", { name: /04 Packet/ }).click();
  expect([...origins]).toEqual(["http://127.0.0.1:4173"]);
});

test("@claim:local-autosave keeps a typed real-workspace title after reload", async ({ page }) => {
  await page.goto("/demo");
  await page.getByRole("link", { name: "Start for real" }).click();
  await page.getByRole("button", { name: "Start a checkpoint" }).click();
  await page.getByLabel("Checkpoint title").fill("Reloaded local title");
  await page.reload();
  await expect(page.getByLabel("Checkpoint title")).toHaveValue("Reloaded local title");
});

test("@claim:scope-limits discloses the product limits on the site and in the README", async ({ page }) => {
  await page.goto("/demo");
  await page.getByRole("link", { name: "Start for real" }).click();
  await expect(page.getByText("It does not teach, grade proofs, verify identity, proctor work, or issue credentials.")).toBeVisible();
  await page.getByRole("link", { name: "Terms" }).click();
  await expect(page.getByText(/does not teach, proctor, grade automatically, or issue accredited qualifications/)).toBeVisible();
  const readme = await import("node:fs/promises").then(({ readFile }) => readFile("README.md", "utf8"));
  expect(readme).toContain("It does not teach, grade proofs, verify identity, proctor work, issue credentials");
});

test("@claim:non-accredited-review names the reviewer role and non-accredited status", async ({ page }) => {
  await page.goto("/demo");
  await page.getByRole("button", { name: /03 Review/ }).click();
  await expect(page.getByText(/The reviewer is someone you choose/)).toBeVisible();
  const review = encodeRequest(requestFromCheckpoint(sampleCheckpoint()));
  await page.goto(`/demo?review=${review}`);
  await expect(page.getByText("This is not an accredited assessment.")).toBeVisible();
});

test("@claim:no-tracking loads no analytics or tracking resource", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("/demo");
  await page.getByLabel("Utility navigation").getByRole("link", { name: "Privacy" }).click();
  await expect(page.getByText(/no advertising, behavioral analytics, third-party fonts, or tracking scripts/)).toBeVisible();
  expect(requests.every((url) => new URL(url).origin === "http://127.0.0.1:4173")).toBe(true);
  expect(requests.some((url) => /analytics|tracking|segment|pixel/i.test(url))).toBe(false);
});

test("@claim:multiple-local-plans keeps two real plans after reload", async ({ page }) => {
  await page.goto("/demo");
  await page.getByRole("link", { name: "Start for real" }).click();
  await page.getByRole("button", { name: "Start a checkpoint" }).click();
  await page.getByLabel("Checkpoint title").fill("First local plan");
  await page.getByRole("button", { name: "Create a new checkpoint" }).click();
  await page.getByLabel("Checkpoint title").fill("Second local plan");
  await page.reload();
  await expect(page.getByRole("button", { name: /First local plan/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Second local plan/ })).toBeVisible();
});

test("@claim:review-request-options produces both a review link and JSON request", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/demo");
  await page.getByRole("button", { name: /03 Review/ }).click();
  await page.getByRole("button", { name: "Copy review link" }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("/?demo=1&review=");
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Request file", exact: true }).click();
  expect((await downloaded).suggestedFilename()).toMatch(/review-request\.json$/);
});

test("@claim:review-link-disclosure explains who can read a shared review link", async ({ page }) => {
  await page.goto("/demo");
  await page.getByRole("button", { name: /03 Review/ }).click();
  await expect(page.getByText("Anyone with this link can read the checkpoint.")).toBeVisible();
  await page.getByLabel("Utility navigation").getByRole("link", { name: "Privacy" }).click();
  await expect(page.getByText("Anyone who receives that link can read it.")).toBeVisible();
});

test("@claim:local-signing-key keeps the real-workspace private key local and excludes it from the packet", async ({ page, context }) => {
  const requests: string[] = [];
  context.on("request", (request) => requests.push(request.url()));
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/?demo=1");
  await expect(page.getByText("Demo — sample data, nothing is saved")).toBeVisible();
  await page.getByRole("link", { name: "Start for real" }).click();

  const checkpoint = sampleCheckpoint();
  checkpoint.id = "real-signing-key-claim";
  checkpoint.title = "Real signing key checkpoint";
  await page.evaluate((value) => localStorage.setItem("self-study-checkpoints:v1", JSON.stringify([value])), checkpoint);
  await page.reload();
  await expect(page.getByLabel("Checkpoint title")).toHaveValue("Real signing key checkpoint");

  await page.getByRole("button", { name: /04 Packet/ }).click();
  await page.getByLabel("Evidence title").nth(1).fill("Coset program and notes");
  await page.getByLabel("Public or reviewer-accessible link").nth(1).fill("https://example.com/maya/cosets");
  await page.getByLabel("Disclosure and notes").nth(1).fill("Program and written comparison completed for this checkpoint.");
  await page.getByRole("button", { name: /03 Review/ }).click();
  await page.getByRole("button", { name: "Copy review link" }).click();
  const reviewUrl = await page.evaluate(() => navigator.clipboard.readText());
  const reviewer = await context.newPage();
  await reviewer.goto(reviewUrl);
  const scoreSelects = reviewer.locator("[data-review-score]");
  for (let index = 0; index < await scoreSelects.count(); index++) await scoreSelects.nth(index).selectOption("4");
  await reviewer.getByLabel("Relationship to learner").fill("Study group reviewer");
  await reviewer.getByLabel("Overall feedback").fill("The proof is complete, readable, and the dependencies are explicit.");
  await reviewer.getByLabel("Overall decision").selectOption("meets");
  await reviewer.getByLabel(/I attest that I inspected/).check();
  const responseDownload = reviewer.waitForEvent("download");
  await reviewer.getByRole("button", { name: "Download signed-off response" }).click();
  const responsePath = await (await responseDownload).path();
  expect(responsePath).toBeTruthy();

  await page.getByRole("button", { name: /04 Packet/ }).click();
  await page.locator("#review-file").setInputFiles(responsePath!);
  await expect(page.getByText("Reviewer response imported and checksum verified.")).toBeVisible();
  const packetDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export completion packet" }).click();
  const packetPath = await (await packetDownload).path();
  expect(packetPath).toBeTruthy();

  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("self-study-checkpoints:v1") || "[]"));
  const savedCheckpoint = stored.find((item: { id: string }) => item.id === "real-signing-key-claim");
  expect(savedCheckpoint.signingKey.privateJwk.d).toBeTruthy();
  expect(savedCheckpoint.signingKey.publicJwk.x).toBeTruthy();
  const packet = JSON.parse(await readFile(packetPath!, "utf8"));
  expect(packet.checkpoint.signingKey).toBeUndefined();
  expect(packet.signature.publicKey).toEqual(savedCheckpoint.signingKey.publicJwk);
  expect(JSON.stringify(packet)).not.toContain(savedCheckpoint.signingKey.privateJwk.d);
  expect(requests.every((url) => new URL(url).origin === "http://127.0.0.1:4173")).toBe(true);
});

test("has no serious or critical accessibility violations on public routes", async ({ page }) => {
  for (const route of ["/", "/demo", "/privacy", "/terms", "/404"]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || "")), route).toEqual([]);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.locator("main")).toHaveCount(1);
  }
});
