"use client"

import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function CopyButton({ text }: { text: string }) {
  const [message, setMessage] = useState("")

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setMessage("Kode disalin")
    } catch {
      setMessage("Gagal menyalin. Pilih kode dan salin secara manual.")
    }
  }

  return <>
    <Button variant="ghost" size="icon" className="copy-button" aria-label="Salin kode" onClick={copy}>{message === "Kode disalin" ? <Check /> : <Copy />}</Button>
    <span className="sr-only" role="status" aria-live="polite">{message}</span>
  </>
}
