import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

type StaticWebAppConfig = {
  globalHeaders: Record<string, string>;
  routes: Array<{ route: string; rewrite?: string; statusCode?: number; headers?: Record<string, string> }>;
};

const config = JSON.parse(readFileSync(resolve(process.cwd(), "public/staticwebapp.config.json"), "utf8")) as StaticWebAppConfig;

describe("Azure Static Web Apps response policy", () => {
  it("keeps hashed bundles immutable while documents and service-worker checks stay short-lived", () => {
    const hashedAssets = config.routes.find((entry) => entry.route === "/bundles/*");
    const shell = config.routes.find((entry) => entry.route === "/*");

    expect(hashedAssets?.headers?.["Cache-Control"]).toBe("public, max-age=31536000, immutable");
    expect(shell?.headers?.["Cache-Control"]).toBe("public, max-age=300, must-revalidate");
  });

  it("sets a restrictive CSP for the self-contained static app", () => {
    const csp = config.globalHeaders["Content-Security-Policy"];
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("script-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
  });

  it("serves a real 404 page without an invalid rewrite/status route", () => {
    expect(config).toHaveProperty("responseOverrides.404.rewrite", "/404.html");
    expect(config.routes.some((route) => "rewrite" in route && "statusCode" in route)).toBe(false);
    expect(config.routes.filter((route) => route.rewrite === "/index.html").map((route) => route.route)).toEqual(["/demo", "/privacy", "/terms", "/404"]);
    expect(config).not.toHaveProperty("navigationFallback");
  });
});

describe("factory deployment contract", () => {
  it("documents the fleet deploy path and never the obsolete unprefixed app target", () => {
    const readme = readFileSync(resolve(process.cwd(), "README.md"), "utf8");
    expect(readme).toContain("/opt/fleet/lib/deploy-static.sh self-study-checkpoints /work/repo/dist");
    expect(readme).not.toContain("swa deploy dist --env production --app-name self-study-checkpoints");
  });
});

describe("product claims", () => {
  it("@claim:artwork-provenance records the footer statement against the selected original asset", () => {
    const app = readFileSync(resolve(process.cwd(), "src/main.ts"), "utf8");
    const design = readFileSync(resolve(process.cwd(), ".factory/design.md"), "utf8");
    const asset = JSON.parse(readFileSync(resolve(process.cwd(), "assets/src/checkpoint-cassette-01.json"), "utf8")) as Record<string, string>;

    expect(app).toContain("Original artwork generated with Azure AI Foundry");
    expect(design).toContain("Azure AI Foundry factory image deployment");
    expect(asset.status).toBe("selected");
    expect(asset.generator).toContain("Azure AI Foundry");
    expect(asset.prompt).toContain("self-study checkpoint");
  });
});
