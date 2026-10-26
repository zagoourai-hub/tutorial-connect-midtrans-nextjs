"use client"

import { GitHubIcon } from "@/components/github-icon"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { DocsSearch } from "@/components/docs-search"
import { DocsSidebar } from "@/components/docs-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { sourceRepository } from "@/lib/docs-navigation"

export function SiteHeader() {
  const drawer = useRef<HTMLDialogElement>(null)
  return <header className="site-header"><div className="header-inner">
    <Link className="brand" href="/" aria-label="Midtrans Tutorial — beranda"><span className="brand-mark">M</span><span>Midtrans Tutorial<span className="brand-dot">.</span></span></Link>
    <nav className="header-links" aria-label="Navigasi utama"><Link href="/docs/introduction/">Dokumentasi</Link><a href={`${sourceRepository}/tree/main/apps/payment-example`}>Contoh project</a><a href={sourceRepository}><GitHubIcon size={15} aria-hidden="true" />GitHub</a></nav>
    <div className="header-tools"><ThemeToggle /><DocsSearch /><Button className="mobile-menu-button" variant="ghost" size="icon-lg" aria-label="Buka navigasi" onClick={() => drawer.current?.showModal()}><Menu /></Button></div>
    <dialog ref={drawer} className="mobile-drawer" aria-label="Navigasi tutorial"><div className="drawer-heading"><Link className="brand" href="/" onClick={() => drawer.current?.close()}><span className="brand-mark">M</span>Midtrans Tutorial</Link><Button variant="ghost" size="icon-lg" aria-label="Tutup navigasi" onClick={() => drawer.current?.close()}><X /></Button></div><DocsSidebar onNavigate={() => drawer.current?.close()} /><a className="drawer-source" href={sourceRepository}><GitHubIcon size={17} />Lihat source code</a></dialog>
  </div></header>
}
