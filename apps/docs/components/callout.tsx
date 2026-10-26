import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react"
import type { ReactNode } from "react"

const variants = { info: Info, warning: TriangleAlert, error: CircleAlert, success: CircleCheck }

export function Callout({ children, title = "Catatan", type = "info" }: { children: ReactNode; title?: string; type?: keyof typeof variants }) {
  const Icon = variants[type]
  return <aside className={`callout callout-${type}`}><Icon size={19} aria-hidden="true" /><div><strong>{title}</strong><div>{children}</div></div></aside>
}
