import assert from "node:assert/strict"
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import test from "node:test"
import { normalizeStaticExport } from "./normalize-static-export.mjs"

test("normalizes Windows segment paths without changing flat files or pages", () => {
  const fixture = mkdtempSync(path.join(tmpdir(), "midtrans-export-"))
  try {
    const chapter = path.join(fixture, "docs", "introduction")
    const nested = path.join(chapter, "__next.docs", "$d$slug")
    mkdirSync(nested, { recursive: true })
    writeFileSync(path.join(nested, "__PAGE__.txt"), "segment payload")
    writeFileSync(path.join(chapter, "__next._tree.txt"), "tree payload")
    writeFileSync(path.join(chapter, "index.html"), "<h1>Introduction</h1>")
    assert.equal(normalizeStaticExport(fixture), 1)
    assert.equal(readFileSync(path.join(chapter, "__next.docs.$d$slug.__PAGE__.txt"), "utf8"), "segment payload")
    assert.equal(readFileSync(path.join(chapter, "__next._tree.txt"), "utf8"), "tree payload")
    assert.equal(readFileSync(path.join(chapter, "index.html"), "utf8"), "<h1>Introduction</h1>")
    normalizeStaticExport(fixture)
    assert.equal(readFileSync(path.join(chapter, "__next.docs.$d$slug.__PAGE__.txt"), "utf8"), "segment payload")
  } finally {
    assert.ok(path.resolve(fixture).startsWith(path.resolve(tmpdir()) + path.sep))
    rmSync(fixture, { recursive: true, force: true })
  }
})
