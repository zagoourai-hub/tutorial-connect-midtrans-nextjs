"use client"

import { List } from "lucide-react"
import { useEffect, useState } from "react"

export interface Heading { id: string; title: string; level: number }

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState(headings[0]?.id ?? "")
  useEffect(() => {
    function updateActive() {
      const current = [...headings].reverse().find((heading) => (document.getElementById(heading.id)?.getBoundingClientRect().top ?? Infinity) <= 140)
      setActive(current?.id ?? headings[0]?.id ?? "")
    }
    updateActive()
    window.addEventListener("scroll", updateActive, { passive: true })
    return () => window.removeEventListener("scroll", updateActive)
  }, [headings])

  return <nav className="table-of-contents" aria-label="Daftar isi halaman"><details open><summary><List size={15} aria-hidden="true" />Di halaman ini</summary><ul>{headings.map((heading) => <li key={heading.id} className={heading.level === 3 ? "toc-child" : undefined}><a href={`#${heading.id}`} aria-current={active === heading.id ? "location" : undefined}>{heading.title}</a></li>)}</ul></details></nav>
}
