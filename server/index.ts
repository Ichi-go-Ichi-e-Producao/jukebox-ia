import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { registerSecurityHeaders } from "./security";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp(staticPath: string) {
  const app = express();

  // Security headers must precede both static files and the SPA fallback.
  registerSecurityHeaders(app);

  // Production builds use the Pages base path; retain root assets for compatibility.
  app.use("/jukebox-ia", express.static(staticPath));
  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes.
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  return app;
}

async function startServer() {
  // Serve static files from dist/public in production.
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  const server = createServer(createApp(staticPath));
  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

// Keep the ESM entrypoint runnable after esbuild bundling, but never listen on import.
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  startServer().catch(console.error);
}
