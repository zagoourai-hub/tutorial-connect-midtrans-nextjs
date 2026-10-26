import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { staticFile } from "./serve-docs.ts";

function htmlFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(filename) : entry.name.endsWith(".html") ? [filename] : [];
  });
}

export function verifyLinks(outputRoot: string): number {
  const errors: string[] = [];
  let count = 0;
  for (const filename of htmlFiles(outputRoot)) {
    const html = readFileSync(filename, "utf8");
    const route = "/" + path.relative(outputRoot, filename).replaceAll(path.sep, "/").replace(/index\.html$/, "");
    for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
      const href = match[1].replaceAll("&amp;", "&");
      if (/^(?:https?:|mailto:|tel:)/.test(href)) continue;
      const url = new URL(href, `http://docs.local${route}`);
      const target = staticFile(url.pathname, outputRoot);
      if (!target) { errors.push(`${route} -> ${href}`); continue; }
      if (url.hash) {
        const id = decodeURIComponent(url.hash.slice(1));
        const targetHtml = readFileSync(target, "utf8");
        const ids = [...targetHtml.matchAll(/\bid="([^"]+)"/g)].map((entry) => entry[1]);
        if (!ids.includes(id)) errors.push(`${route} -> missing anchor ${href}`);
      }
      count++;
    }
  }
  if (errors.length) throw new Error(errors.join("\n"));
  if (!count) throw new Error("No links found in static output");
  return count;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(`PASS: ${verifyLinks("apps/docs/out")} internal links and anchors`);
}
