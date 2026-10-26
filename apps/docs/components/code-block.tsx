import { bundledLanguages, codeToHtml } from "shiki"
import { CopyButton } from "@/components/copy-button"
import { sourceRepository } from "@/lib/docs-navigation"

export async function CodeBlock({ code, language = "text", title, source }: { code: string; language?: string; title?: string; source?: string }) {
  const lang = language === "sh" ? "bash" : language
  const html = await codeToHtml(code, { lang: lang in bundledLanguages ? lang : "text", themes: { light: "github-dark", dark: "github-dark-dimmed" } })

  return <figure className="code-block">
    <figcaption><span>{title ?? (lang === "bash" ? "Terminal" : "Contoh kode")}</span><span className="code-language">{language}</span></figcaption>
    <div className="code-body"><div dangerouslySetInnerHTML={{ __html: html }} /><CopyButton text={code} /></div>
    {source && <a className="code-source" href={`${sourceRepository}/blob/main/apps/payment-example/${source}`}>Lihat file sumber: {source} ↗</a>}
  </figure>
}
