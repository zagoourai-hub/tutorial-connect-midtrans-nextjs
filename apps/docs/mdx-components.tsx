import type { MDXComponents } from "mdx/types"
import { Children, isValidElement, type ComponentProps } from "react"
import { Callout } from "@/components/callout"
import { CodeBlock } from "@/components/code-block"
import { SourceCode } from "@/components/source-code"

function MdxPre({ children }: ComponentProps<"pre">) {
  const code = Children.only(children)
  if (!isValidElement<{ children?: string; className?: string; "data-title"?: string }>(code)) return <pre>{children}</pre>
  return <CodeBlock code={String(code.props.children ?? "")} language={code.props.className?.replace("language-", "")} title={code.props["data-title"]} />
}

const components: MDXComponents = {
  pre: MdxPre,
  table: ({ children }) => <div className="table-scroll"><table>{children}</table></div>,
  Callout,
  SourceCode,
}

export function useMDXComponents(): MDXComponents {
  return components
}
