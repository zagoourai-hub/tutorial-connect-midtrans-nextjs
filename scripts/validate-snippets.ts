import { readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function exampleSource(relativePath: string, exampleRoot: string): string {
  if (!relativePath || path.isAbsolute(relativePath) || relativePath.includes("\\") || relativePath.split("/").includes("..")) {
    throw new Error(`Invalid example path: ${relativePath}`);
  }
  if (relativePath !== ".env.example" && !/\.(?:ts|tsx|prisma|json|sql)$/.test(relativePath)) {
    throw new Error(`Unsupported example source: ${relativePath}`);
  }
  const root = realpathSync(exampleRoot);
  const resolved = realpathSync(path.resolve(root, relativePath));
  if (!resolved.startsWith(root + path.sep) || !statSync(resolved).isFile() || resolved.includes(`${path.sep}node_modules${path.sep}`)) {
    throw new Error(`Example path escapes source: ${relativePath}`);
  }
  return resolved;
}

export function sourceReferences(content: string): string[] {
  const references = [...content.matchAll(/<SourceCode\s+path=["']([^"']+)["']\s*\/>/g)].map((match) => match[1]);
  if ((content.match(/<SourceCode\b/g) ?? []).length !== references.length) {
    throw new Error("SourceCode requires a literal path and no additional attributes");
  }
  return references;
}

export function verifySnippets(contentRoot: string, exampleRoot: string): number {
  let count = 0;
  for (const filename of readdirSync(contentRoot).filter((name) => name.endsWith(".mdx"))) {
    const content = readFileSync(path.join(contentRoot, filename), "utf8");
    for (const reference of sourceReferences(content)) {
      try { exampleSource(reference, exampleRoot); } catch (error) {
        throw new Error(`${filename}: ${error instanceof Error ? error.message : "Invalid source"}`);
      }
      count++;
    }
  }
  if (!count) throw new Error("No source references found; tutorial examples are not verified");
  return count;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const count = verifySnippets("apps/docs/content", "apps/payment-example");
  console.log(`PASS: ${count} source references; code is read directly from source during MDX rendering`);
}
