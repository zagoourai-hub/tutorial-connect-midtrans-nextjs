import { copyFileSync, readdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

export function normalizeStaticExport(outputRoot) {
  let count = 0
  function visit(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const filename = path.join(directory, entry.name)
      if (entry.isDirectory()) { visit(filename); continue }
      if (!entry.isFile() || !entry.name.endsWith(".txt")) continue
      const parts = path.relative(outputRoot, filename).split(path.sep)
      const segment = parts.findIndex((part) => part.startsWith("__next."))
      if (segment < 0 || segment === parts.length - 1) continue
      // Next.js static export on Windows emits nested segment paths (vercel/next.js#92339).
      copyFileSync(filename, path.join(outputRoot, ...parts.slice(0, segment), parts.slice(segment).join(".")))
      count++
    }
  }
  visit(outputRoot)
  return count
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(`Normalized ${normalizeStaticExport(path.resolve("out"))} static segment files`)
}
