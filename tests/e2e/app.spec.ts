import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { encodeRequest, requestFromCheckpoint, sampleCheckpoint } from "../../src/model";

test("@claim:workspace-planning @claim:human-review @claim:sealed-packet builds, reviews, exports, and verifies a checkpoint", async ({ page, context }) => {
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
  expect(reviewUrl).toContain("/demo?review=");

  const reviewer = await context.newPage();
  await reviewer.goto(reviewUrl);
  await expect(reviewer).toHaveURL(/\/demo\?review=/);
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
  await page.getByRole("button", { name: "Seal and export packet" }).click();
  const packetFile = await (await packetDownload).path();
  expect(packetFile).toBeTruthy();

  await page.locator("#verify-file").setInputFiles(packetFile!);
  await expect(page.getByText(/Seal valid:/)).toBeVisible();
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

  const bounds = await page.locator('a.button.primary[href="/demo"]').evaluate((element) => {
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

test("@claim:local-only @claim:free-no-account keeps the complete demo flow on the site origin", async ({ page }) => {
  const origins = new Set<string>();
  page.on("request", (request) => origins.add(new URL(request.url()).origin));
  await page.goto("/demo");
  await page.getByLabel("Checkpoint title").fill("Local-only edit");
  await page.getByRole("button", { name: /02 Problems/ }).click();
  await page.getByRole("button", { name: /03 Review/ }).click();
  await page.getByRole("button", { name: /04 Packet/ }).click();
  expect([...origins]).toEqual(["http://127.0.0.1:4173"]);
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
