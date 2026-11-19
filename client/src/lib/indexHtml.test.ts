import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const html = readFileSync(new URL("../../index.html", import.meta.url), "utf8");

describe("HTML de entrada da Jukeboxia", () => {
  it("preserva o ponto de montagem e o entrypoint real da aplicação", () => {
    expect(html).toContain('<div id="root"></div>');
    expect(html).toContain('<script type="module" src="/src/main.tsx"></script>');
  });

  it("não injeta analytics sem endpoint e website ID configurados", () => {
    expect(html).not.toContain("%VITE_ANALYTICS_ENDPOINT%");
    expect(html).not.toContain("%VITE_ANALYTICS_WEBSITE_ID%");
    expect(html).not.toMatch(/<script[^>]*\bsrc=["'][^"']*\/umami["']/i);
    expect(html).not.toContain("data-website-id");
  });
});
