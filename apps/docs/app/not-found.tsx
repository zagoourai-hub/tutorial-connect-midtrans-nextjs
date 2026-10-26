import Link from "next/link"
import { ArrowLeft, BookOpen } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return <main id="main-content" className="not-found"><span className="eyebrow">404 · HALAMAN TIDAK DITEMUKAN</span><span className="not-found-icon"><BookOpen size={40} /></span><h1>Sepertinya kita salah halaman.</h1><p>Tautan ini mungkin telah berubah. Lanjutkan belajar dari pengantar atau kembali ke beranda.</p><div><Link className={buttonVariants({ size: "lg" })} href="/docs/introduction/">Buka pengantar</Link><Link className={buttonVariants({ variant: "outline", size: "lg" })} href="/"><ArrowLeft size={15} />Beranda</Link></div></main>
}
