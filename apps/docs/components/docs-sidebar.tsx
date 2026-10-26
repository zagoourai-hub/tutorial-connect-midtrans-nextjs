"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, ChevronDown, FileCode2 } from "lucide-react"
import { chapterGroups, chapterHref, chapters } from "@/lib/docs-navigation"

export function DocsSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname().replace(/\/$/, "")
  return <nav aria-label="Daftar chapter" className="docs-navigation">{chapterGroups.map((group) => <details key={group} open><summary>{group}<ChevronDown size={13} aria-hidden="true" /></summary><ul>{chapters.filter((chapter) => chapter.group === group).map((chapter) => {
    const active = pathname === `/docs/${chapter.slug}`
    return <li key={chapter.slug}><Link href={chapterHref(chapter.slug)} onClick={onNavigate} aria-current={active ? "page" : undefined}>{group === "Pengenalan" ? <BookOpen size={15} aria-hidden="true" /> : <FileCode2 size={15} aria-hidden="true" />}<span>{chapter.title}</span>{chapter.slug === "snap-popup" && <span className="nav-optional">opsional</span>}</Link></li>
  })}</ul></details>)}</nav>
}
