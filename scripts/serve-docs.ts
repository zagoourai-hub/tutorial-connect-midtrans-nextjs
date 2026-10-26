import { createServer } from "node:http";
import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const contentTypes: Record<string, string> = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8", ".xml": "application/xml; charset=utf-8",
};

export function staticFile(requestPath: string, outputRoot: string): string | undefined {
  const root = realpathSync(outputRoot);
  const decoded = decodeURIComponent(new URL(requestPath, "http://localhost").pathname);
  if (decoded.includes("\0") || decoded.includes("\\")) return;
  const requested = path.resolve(root, "." + decoded);
  if (requested !== root && !requested.startsWith(root + path.sep)) return;
  for (const candidate of [requested, path.join(requested, "index.html"), requested + ".html"]) {
    if (!existsSync(candidate) || !statSync(candidate).isFile()) continue;
    const actual = realpathSync(candidate);
    if (actual.startsWith(root + path.sep)) return actual;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const output = path.resolve("apps/docs/out");
  if (!existsSync(output)) throw new Error("Build docs first: pnpm build");
  const port = Number(process.env.PORT ?? 4173);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid PORT");
  createServer((request, response) => {
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405, { Allow: "GET, HEAD" }); response.end(); return;
    }
    try {
      const file = staticFile(request.url ?? "/", output);
      if (!file) { response.writeHead(404); response.end("Not found"); return; }
      response.writeHead(200, { "Content-Type": contentTypes[path.extname(file)] ?? "application/octet-stream" });
      response.end(request.method === "HEAD" ? undefined : readFileSync(file));
    } catch { response.writeHead(400); response.end("Invalid request"); }
  }).listen(port, "127.0.0.1", () => console.log(`Static docs: http://127.0.0.1:${port}`));
}
