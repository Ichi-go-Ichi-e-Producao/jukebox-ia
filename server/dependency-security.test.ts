import { describe, expect, it } from "vitest";
import { z } from "zod";
import postcss from "postcss";
import { createRequire } from "module";
import { realpathSync } from "fs";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { Readable } from "stream";
import { pipeline } from "stream/promises";

function requireFromDirectPackage(name: string) {
  return createRequire(realpathSync(path.resolve("node_modules", name, "package.json")));
}

// Small benign inputs only. These do not certify all denial-of-service scenarios.
describe("compatibilidade das dependências de segurança", () => {
  it("mantém a correção de GHSA-p4f5-76q4-ffq7 nas resoluções de Vite", async () => {
    const fixedVersion = "7.3.8";
    const manifest = JSON.parse(await readFile(path.resolve("package.json"), "utf8"));
    expect(manifest.devDependencies.vite).toBe(fixedVersion);
    for (const selector of ["vite@7", "vitest@4.1.12>vite", "@vitest/mocker@4.1.12>vite"]) {
      expect(manifest.pnpm.overrides[selector]).toBe(fixedVersion);
    }
    expect(requireFromDirectPackage("vite")("vite/package.json").version).toBe(fixedVersion);
    const vitestRequire = requireFromDirectPackage("vitest");
    expect(vitestRequire("vite/package.json").version).toBe(fixedVersion);
    const mockerRequire = createRequire(vitestRequire.resolve("@vitest/mocker"));
    expect(mockerRequire("vite/package.json").version).toBe(fixedVersion);
  });

  it("preserva safeParse para dados válidos e inválidos", () => {
    const schema = z.object({ title: z.string().min(1) });
    expect(schema.safeParse({ title: "Lúmen" }).success).toBe(true);
    expect(schema.safeParse({ title: "" }).success).toBe(false);
  });

  it("rejeita coleção limitada com um caso pequeno", () => {
    const result = z.array(z.string()).max(2).safeParse(["a", "b", "c"]);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.code === "too_big")).toBe(true);
    }
  });

  it("preserva processamento CSS e geração de mapa normal", async () => {
    const result = await postcss([]).process(".safe { color: red; }", {
      from: "safe.css",
      to: "output.css",
      map: { inline: false },
    });
    expect(result.css).toContain("color: red");
    expect(result.map?.toJSON().sources).toContain("safe.css");
  });

  it("preserva a API síncrona de source-map-js consumida pelo PostCSS", () => {
    const { SourceMapGenerator, SourceMapConsumer } = requireFromDirectPackage("postcss")("source-map-js");
    const generator = new SourceMapGenerator({ file: "output.css" });
    generator.addMapping({ generated: { line: 1, column: 0 }, original: { line: 1, column: 0 }, source: "safe.css" });
    const consumer = new SourceMapConsumer(generator.toJSON());
    expect(consumer.originalPositionFor({ line: 1, column: 0 }).source).toBe("safe.css");
  });

  it("preserva consultas fixas de Browserslist usadas pelo Autoprefixer", () => {
    const browserslist = requireFromDirectPackage("autoprefixer")("browserslist");
    const targets = browserslist(["defaults"]);
    expect(Array.isArray(targets)).toBe(true);
    expect(targets.length).toBeGreaterThan(0);
  });

  it("preserva extract em stream com cwd e strip usados pelo instalador oxide", async () => {
    const tailwindRequire = requireFromDirectPackage("@tailwindcss/vite");
    const oxideRequire = createRequire(tailwindRequire.resolve("@tailwindcss/oxide"));
    const tar = oxideRequire("tar");
    expect(typeof tar.extract).toBe("function");
    expect(typeof tar.x).toBe("function");
    const root = await mkdtemp(path.join(tmpdir(), "jukeboxia-tar-smoke-"));
    try {
      const source = path.join(root, "source");
      const output = path.join(root, "output");
      await mkdir(path.join(source, "package"), { recursive: true });
      await mkdir(output);
      await writeFile(path.join(source, "package", "sample.txt"), "Lúmen\n");
      await pipeline(tar.create({ cwd: source, gzip: true }, ["package"]), tar.extract({ cwd: output, strip: 1 }));
      expect(await readFile(path.join(output, "sample.txt"), "utf8")).toBe("Lúmen\n");
      await expect(pipeline(Readable.from([Buffer.from("not an archive")]), tar.extract({ cwd: output, strip: 1 }))).rejects.toBeDefined();
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
