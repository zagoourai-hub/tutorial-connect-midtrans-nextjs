/** @param {string} value */
export function slugify(value) {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-') || 'bagian'
}

export function createSlugger() {
  const counts = new Map()
  /** @param {string} title */
  return (title) => {
    const slug = slugify(title)
    const count = counts.get(slug) ?? 0
    counts.set(slug, count + 1)
    return count ? `${slug}-${count}` : slug
  }
}

/** @param {string} source */
export function headingsFromSource(source) {
  const slug = createSlugger()
  let fence = false
  const headings = []
  for (const line of source.split(/\r?\n/)) {
    if (/^\s*```/.test(line)) fence = !fence
    const heading = !fence && line.match(/^(#{2,3})\s+(.+)$/)
    if (!heading) continue
    const title = heading[2].replace(/[`*_]/g, '').trim()
    headings.push({ title, id: slug(title), level: heading[1].length })
  }
  return headings
}

/** @param {string} source */
export function plainText(source) {
  return source.replace(/```[\s\S]*?```/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[#`*_>|]/g, ' ').replace(/\s+/g, ' ').trim()
}

/** @typedef {{slug:string,title:string,description:string,text:string}} SearchEntry */
/** @param {SearchEntry[]} entries @param {string} query */
export function searchEntries(entries, query) {
  const words = query.toLocaleLowerCase('id').trim().split(/\s+/).filter(Boolean)
  if (!words.length) return entries.slice(0, 6)
  return entries.filter((entry) => words.every((word) => `${entry.title} ${entry.description} ${entry.text}`.toLocaleLowerCase('id').includes(word))).sort((a, b) => Number(b.title.toLocaleLowerCase('id').includes(words.join(' '))) - Number(a.title.toLocaleLowerCase('id').includes(words.join(' ')))).slice(0, 8)
}
