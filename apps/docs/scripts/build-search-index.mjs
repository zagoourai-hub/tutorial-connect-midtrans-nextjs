import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { plainText } from '../lib/content-utils.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const chapters = JSON.parse(await readFile(resolve(root, 'content/chapters.json'), 'utf8'))
const entries = await Promise.all(chapters.map(async (chapter) => ({ ...chapter, text: plainText(await readFile(resolve(root, `content/${chapter.slug}.mdx`), 'utf8')) })))
await mkdir(resolve(root, 'public'), { recursive: true })
await writeFile(resolve(root, 'public/search-index.json'), JSON.stringify(entries) + '\n')
console.log(`Search index: ${entries.length} chapter`)
