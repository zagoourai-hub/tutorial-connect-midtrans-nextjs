"use client"

import { ArrowUpRight, BookOpen, LoaderCircle, Search, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { chapterHref } from "@/lib/docs-navigation"
import { searchEntries } from "@/lib/content-utils.mjs"

interface SearchEntry { slug: string; title: string; description: string; text: string }

function isSearchIndex(value: unknown): value is SearchEntry[] {
  return Array.isArray(value) && value.every((entry: unknown) => typeof entry === "object" && entry !== null && ["slug", "title", "description", "text"].every((key) => key in entry && typeof entry[key as keyof typeof entry] === "string"))
}

export function DocsSearch() {
  const dialog = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const [entries, setEntries] = useState<SearchEntry[]>([])
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle")
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState(0)
  const results = searchEntries(entries, query)

  async function loadIndex() {
    if (status === "ready" || status === "loading") return
    setStatus("loading")
    try {
      const response = await fetch("/search-index.json")
      if (!response.ok) throw new Error("Search index unavailable")
      const data: unknown = await response.json()
      if (!isSearchIndex(data)) throw new Error("Search index invalid")
      setEntries(data)
      setStatus("ready")
    } catch {
      setStatus("error")
    }
  }

  function open() {
    dialog.current?.showModal()
    input.current?.focus()
  }

  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        dialog.current?.showModal()
        input.current?.focus()
      }
    }
    window.addEventListener("keydown", shortcut)
    return () => window.removeEventListener("keydown", shortcut)
  }, [])

  return <>
    <button className="search-trigger" type="button" aria-label="Cari dokumentasi" onClick={open}><Search size={15} aria-hidden="true" /><span>Cari dokumentasi...</span><kbd>⌘ K</kbd></button>
    <dialog ref={dialog} className="search-dialog" aria-label="Cari dokumentasi" onFocus={() => { if (status === "idle") void loadIndex() }} onClick={(event) => { if (event.target === dialog.current) dialog.current?.close() }}>
      <div className="search-input-row"><Search size={20} aria-hidden="true" /><input ref={input} aria-label="Kata kunci dokumentasi" role="combobox" aria-expanded="true" aria-controls="search-results" aria-autocomplete="list" aria-activedescendant={results[selected] ? `search-result-${selected}` : undefined} placeholder="Cari tutorial, webhook, atau Prisma..." value={query} onChange={(event) => { setQuery(event.target.value); setSelected(0) }} onKeyDown={(event) => {
        if (event.key === "ArrowDown") { event.preventDefault(); setSelected((index) => Math.min(index + 1, results.length - 1)) }
        if (event.key === "ArrowUp") { event.preventDefault(); setSelected((index) => Math.max(index - 1, 0)) }
        if (event.key === "Enter" && results[selected]) window.location.assign(chapterHref(results[selected].slug))
      }} /><Button variant="ghost" size="icon" aria-label="Tutup pencarian" onClick={() => dialog.current?.close()}><X /></Button></div>
      <div className="search-body">
        {status === "loading" && <p className="search-message"><LoaderCircle className="spin" size={18} />Memuat dokumentasi...</p>}
        {status === "error" && <div className="search-message"><p>Index pencarian belum dapat dimuat.</p><Button variant="outline" onClick={() => void loadIndex()}>Coba lagi</Button></div>}
        {status === "ready" && <><p className="search-caption">{query ? `${results.length} hasil pencarian` : "Mulai jelajahi"}</p><ul id="search-results" role="listbox" aria-label="Hasil pencarian">{results.map((entry, index) => <li key={entry.slug}><Link id={`search-result-${index}`} role="option" aria-selected={index === selected} tabIndex={-1} href={chapterHref(entry.slug)} onClick={() => dialog.current?.close()}><span className="search-result-icon"><BookOpen size={18} /></span><span><strong>{entry.title}</strong><small>{entry.description}</small></span><ArrowUpRight size={16} /></Link></li>)}</ul>{!results.length && <p className="search-message">Tidak ada hasil untuk “{query}”. Coba kata seperti “checkout” atau “webhook”.</p>}</>}
      </div><div className="search-footer"><span>↑ ↓ pilih</span><span>↵ buka</span><span>esc tutup</span></div>
    </dialog>
  </>
}
