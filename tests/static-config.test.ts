import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

type StaticWebAppConfig = {
  globalHeaders: Record<string, string>;
  routes: Array<{ route: string; headers?: Record<string, string> }>;
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
});
