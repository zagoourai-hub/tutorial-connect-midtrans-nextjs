import { readFile, realpath } from "node:fs/promises"
import { extname, resolve, sep } from "node:path"
import { CodeBlock } from "@/components/code-block"

export async function SourceCode({ path }: { path: string }) {
  const root = await realpath(resolve(process.cwd(), "../payment-example"))
  if (!/^(?:(?:app|components|lib|prisma|scripts)\/|prisma\.config\.ts$|package\.json$|\.env\.example$)/.test(path) || path.split(/[\\/]/).includes("..")) throw new Error(`Path source tidak diizinkan: ${path}`)
  const file = await realpath(resolve(root, path))
  if (!file.startsWith(root + sep)) throw new Error("Source berada di luar aplikasi contoh")
  const code = await readFile(file, "utf8")
  const language = path === ".env.example" ? "bash" : ({ ".ts": "typescript", ".tsx": "tsx", ".json": "json", ".prisma": "prisma", ".sql": "sql", ".mjs": "javascript" }[extname(path)] ?? "text")
  return <CodeBlock code={code} language={language} title={path} source={path} />
}
