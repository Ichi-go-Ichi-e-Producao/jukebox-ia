// @vitest-environment node

import express from "express";
import { Server, createServer } from "http";
import { mkdtemp, mkdir, rm, writeFile } from "fs/promises";
import type { AddressInfo } from "net";
import { tmpdir } from "os";
import path from "path";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { registerSecurityHeaders } from "./security";

const INDEX_HTML =
  '<!doctype html><html><head><title>Fixture</title></head><body><div id="root">SPA fixture</div><script src="/assets/app.js"></script><audio src="/assets/sample.mp3"></audio></body></html>';
const SCRIPT = 'console.log("static fixture");\n';
const STYLES = "body { color: purple; }\n";
// Only a MIME/byte-delivery fixture, not a decodable audio/playback test.
const AUDIO = Buffer.from("ID3temporary-audio-fixture");

let createApp: typeof import("./index").createApp;
let staticPath: string | undefined;
let server: Server | undefined;
let baseUrl: string;

async function listen(app: express.Express): Promise<void> {
  server = createServer(app);
  const listener = server;
  await new Promise<void>((resolve, reject) => {
    listener.once("error", reject);
    listener.listen(0, "127.0.0.1", () => {
      listener.off("error", reject);
      resolve();
    });
  });
  const address = listener.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${address.port}`;
}

function expectSecurityHeaders(response: Response): void {
  expect(response.headers.get("x-powered-by")).toBeNull();
  expect(response.headers.get("x-content-type-options")).toBe("nosniff");
  expect(response.headers.get("referrer-policy")).toBe(
    "strict-origin-when-cross-origin"
  );
  expect(response.headers.get("content-security-policy-report-only")).toBeTruthy();

  // Report-only CSP must not be accompanied by independent enforced barriers.
  for (const header of [
    "content-security-policy",
    "cross-origin-embedder-policy",
    "cross-origin-resource-policy",
    "cross-origin-opener-policy",
    "origin-agent-cluster",
    "x-frame-options",
  ]) {
    expect(response.headers.get(header), header).toBeNull();
  }
}

beforeAll(async () => {
  const listenSpy = vi.spyOn(Server.prototype, "listen");
  try {
    ({ createApp } = await import("./index"));
    expect(listenSpy).not.toHaveBeenCalled();
  } finally {
    listenSpy.mockRestore();
  }
});

beforeEach(async () => {
  // Even production mode does not prove HTTPS on this HTTP listener.
  vi.stubEnv("NODE_ENV", "production");
  staticPath = await mkdtemp(path.join(tmpdir(), "jukeboxia-security-"));
  await mkdir(path.join(staticPath, "assets"));
  await Promise.all([
    writeFile(path.join(staticPath, "index.html"), INDEX_HTML),
    writeFile(path.join(staticPath, "assets", "app.js"), SCRIPT),
    writeFile(path.join(staticPath, "assets", "app.css"), STYLES),
    writeFile(path.join(staticPath, "assets", "sample.mp3"), AUDIO),
  ]);
});

afterEach(async () => {
  try {
    if (server?.listening) {
      const listener = server;
      await new Promise<void>((resolve, reject) => {
        listener.close(error => (error ? reject(error) : resolve()));
        listener.closeAllConnections();
      });
    }
  } finally {
    server = undefined;
    try {
      if (staticPath) await rm(staticPath, { recursive: true, force: true });
    } finally {
      staticPath = undefined;
      vi.unstubAllEnvs();
      vi.restoreAllMocks();
    }
  }
});

describe("segurança do servidor estático e SPA", () => {
  it("cria a aplicação sem listener e mantém trust proxy desativado", () => {
    const listenSpy = vi.spyOn(Server.prototype, "listen");
    const app = createApp(staticPath!);
    expect(listenSpy).not.toHaveBeenCalled();
    expect(app.get("trust proxy")).toBe(false);
    expect(app.enabled("x-powered-by")).toBe(false);
  });

  it.each([
    ["/", /^text\/html\b/, INDEX_HTML],
    ["/assets/app.js", /^(?:application|text)\/javascript\b/, SCRIPT],
    ["/assets/app.css", /^text\/css\b/, STYLES],
    ["/catalog/album", /^text\/html\b/, INDEX_HTML],
    ["/jukebox-ia/", /^text\/html\b/, INDEX_HTML],
    ["/jukebox-ia/assets/app.js", /^(?:application|text)\/javascript\b/, SCRIPT],
    ["/jukebox-ia/assets/app.css", /^text\/css\b/, STYLES],
    ["/jukebox-ia/catalog/album", /^text\/html\b/, INDEX_HTML],
  ])("preserva corpo, MIME e headers em %s", async (route, mime, body) => {
    await listen(createApp(staticPath!));
    const response = await fetch(`${baseUrl}${route}`);
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toMatch(mime);
    expect(await response.text()).toBe(body);
    expectSecurityHeaders(response);
    expect(response.headers.get("strict-transport-security")).toBeNull();
  });

  it("entrega áudio com audio/mpeg, bytes intactos e sem isolamento imposto", async () => {
    await listen(createApp(staticPath!));
    const response = await fetch(`${baseUrl}/assets/sample.mp3`);
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toMatch(/^audio\/mpeg\b/);
    expect(Buffer.from(await response.arrayBuffer())).toEqual(AUDIO);
    expectSecurityHeaders(response);
    expect(response.headers.get("strict-transport-security")).toBeNull();
  });

  it("preserva pedidos parciais usados para seek de áudio", async () => {
    await listen(createApp(staticPath!));
    const response = await fetch(`${baseUrl}/assets/sample.mp3`, {
      headers: { Range: "bytes=0-2" },
    });
    expect(response.status).toBe(206);
    expect(response.headers.get("content-type")).toMatch(/^audio\/mpeg\b/);
    expect(response.headers.get("content-range")).toBe(
      `bytes 0-2/${AUDIO.length}`
    );
    expect(Buffer.from(await response.arrayBuffer())).toEqual(AUDIO.subarray(0, 3));
    expectSecurityHeaders(response);
  });

  it("preserva a rota HEAD para assets", async () => {
    await listen(createApp(staticPath!));
    const response = await fetch(`${baseUrl}/assets/app.js`, { method: "HEAD" });
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toMatch(
      /^(?:application|text)\/javascript\b/
    );
    expect(await response.text()).toBe("");
    expectSecurityHeaders(response);
  });

  it("mantém CSP mínima por origem em report-only, sem upgrade HTTPS", async () => {
    await listen(createApp(staticPath!));
    const response = await fetch(`${baseUrl}/`);
    await response.text();
    const policy = response.headers.get("content-security-policy-report-only")!;
    const directives = Object.fromEntries(
      policy
        .split(";")
        .map(directive => directive.trim().split(/\s+/))
        .filter(([name]) => name)
        .map(([name, ...sources]) => [name, sources])
    );
    expect(directives).toEqual({
      "default-src": ["'self'"],
      "base-uri": ["'self'"],
      "object-src": ["'none'"],
      "script-src": ["'self'"],
      "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      "font-src": ["'self'", "https://fonts.gstatic.com"],
      "img-src": ["'self'", "https://private-us-east-1.manuscdn.com"],
      "media-src": ["'self'", "https://files.manuscdn.com"],
      "connect-src": ["'self'"],
      "frame-src": ["'self'"],
      "frame-ancestors": ["'self'"],
      "form-action": ["'self'"],
    });
    expectSecurityHeaders(response);
  });

  it.each(["development", "production"])(
    "não emite HSTS ou redirect HTTPS em HTTP (%s), mesmo com X-Forwarded-Proto forjado",
    async environment => {
      vi.stubEnv("NODE_ENV", environment);
      await listen(createApp(staticPath!));
      const response = await fetch(`${baseUrl}/`, {
        headers: { "X-Forwarded-Proto": "https" },
        redirect: "manual",
      });
      expect(response.status).toBe(200);
      expect(response.headers.get("location")).toBeNull();
      expect(response.headers.get("strict-transport-security")).toBeNull();
      expect(await response.text()).toBe(INDEX_HTML);
      expectSecurityHeaders(response);
    }
  );

  it.each<[string, string | null]>([
    ["production", "max-age=86400"],
    ["development", null],
  ])(
    "condiciona HSTS à produção E a req.secure (%s)",
    async (environment, expectedHsts) => {
      vi.stubEnv("NODE_ENV", environment);
      const app = express();
      // Simulate Express's secure getter only in this isolated middleware test.
      // This is not TLS, and the actual createApp never overrides it/trust proxy.
      app.use((req, _res, next) => {
        Object.defineProperty(req, "secure", { value: true });
        next();
      });
      registerSecurityHeaders(app);
      app.get("/", (_req, res) => res.type("text").send("secure fixture"));
      await listen(app);
      const response = await fetch(`${baseUrl}/`);
      expect(response.headers.get("strict-transport-security")).toBe(expectedHsts);
      expect(await response.text()).toBe("secure fixture");
      expectSecurityHeaders(response);
    }
  );
});
