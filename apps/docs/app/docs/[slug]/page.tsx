import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { ArrowLeft, ArrowRight, ChevronRight, Clock3, FilePenLine } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"
import { DocsSidebar } from "@/components/docs-sidebar"
import { TableOfContents } from "@/components/table-of-contents"
import { chapterHref, chapters, sourceRepository } from "@/lib/docs-navigation"
import { createSlugger, headingsFromSource } from "@/lib/content-utils.mjs"
import Introduction from "@/content/introduction.mdx"
import Setup from "@/content/setup.mdx"
import MidtransSetup from "@/content/midtrans-setup.mdx"
import Prisma from "@/content/prisma.mdx"
import Validation from "@/content/validation.mdx"
import MidtransSdk from "@/content/midtrans-sdk.mdx"
import CheckoutApi from "@/content/checkout-api.mdx"
import PaymentButton from "@/content/payment-button.mdx"
import Webhook from "@/content/webhook.mdx"
import PaymentStatus from "@/content/payment-status.mdx"
import Testing from "@/content/testing.mdx"
import Production from "@/content/production.mdx"
import SnapPopup from "@/content/snap-popup.mdx"

const content = [Introduction, Setup, MidtransSetup, Prisma, Validation, MidtransSdk, CheckoutApi, PaymentButton, Webhook, PaymentStatus, Testing, Production, SnapPopup]

export const dynamicParams = false

export function generateStaticParams() {
  return chapters.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const chapter = chapters.find((entry) => entry.slug === slug)
  if (!chapter) return {}
  return { title: chapter.title, description: chapter.description, alternates: { canonical: chapterHref(slug) }, openGraph: { title: chapter.title, description: chapter.description, url: chapterHref(slug), type: "article" } }
}

function textContent(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(textContent).join("")
  if (node && typeof node === "object" && "props" in node) return textContent((node.props as { children?: ReactNode }).children)
  return ""
}

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const index = chapters.findIndex((entry) => entry.slug === slug)
  if (index < 0) notFound()
  const chapter = chapters[index]
  const Content = content[index]
  const source = await readFile(resolve(process.cwd(), `content/${chapter.slug}.mdx`), "utf8")
  const headings = headingsFromSource(source)
  const slugHeading = createSlugger()
  function H2({ children, ...props }: ComponentProps<"h2">) {
    const id = slugHeading(textContent(children))
    return <h2 id={id} {...props}>{children}<a className="heading-anchor" href={`#${id}`} aria-label={`Tautan ke ${textContent(children)}`}>#</a></h2>
  }
  function H3({ children, ...props }: ComponentProps<"h3">) {
    const id = slugHeading(textContent(children))
    return <h3 id={id} {...props}>{children}<a className="heading-anchor" href={`#${id}`} aria-label={`Tautan ke ${textContent(children)}`}>#</a></h3>
  }

  return <div className="docs-grid"><aside className="desktop-sidebar"><DocsSidebar /></aside><main id="main-content" className="docs-main"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/docs/introduction/">Dokumentasi</Link><ChevronRight size={12} /><span>{chapter.group}</span><ChevronRight size={12} /><span aria-current="page">{chapter.title}</span></nav><div className="chapter-meta"><span className="eyebrow">{String(index + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")} · {chapter.group}</span><span><Clock3 size={13} />{chapter.minutes} menit baca</span></div><h1>{chapter.title}</h1><p className="chapter-description">{chapter.description}</p><div className="mobile-toc"><TableOfContents headings={headings} /></div><article className="prose"><Content components={{ h2: H2, h3: H3 }} /></article><div className="chapter-edit"><a href={`${sourceRepository}/edit/main/apps/docs/content/${slug}.mdx`}><FilePenLine size={15} />Perbaiki halaman ini</a><span>Belajar selangkah demi selangkah.</span></div><nav className="chapter-pagination" aria-label="Chapter sebelumnya dan berikutnya">{chapters[index - 1] ? <Link href={chapterHref(chapters[index - 1].slug)}><span><ArrowLeft size={14} />Sebelumnya</span><strong>{chapters[index - 1].title}</strong></Link> : <span />}{chapters[index + 1] && <Link className="pagination-next" href={chapterHref(chapters[index + 1].slug)}><span>Berikutnya<ArrowRight size={14} /></span><strong>{chapters[index + 1].title}</strong></Link>}</nav></main><aside className="desktop-toc"><TableOfContents headings={headings} /><div className="toc-help"><span className="brand-mark small">M</span><strong>Belajar sambil membangun.</strong><p>Jalankan kode contoh, lalu ikuti alur pembayarannya.</p><a href={`${sourceRepository}/tree/main/apps/payment-example`}>Buka contoh project ↗</a></div></aside></div>
}
