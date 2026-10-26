import createMDX from "@next/mdx"
import type { NextConfig } from "next"
import path from "node:path"

const withMDX = createMDX({
  options: { rehypePlugins: [path.resolve(process.cwd(), "lib/rehype-code-meta.mjs")] },
})

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  pageExtensions: ["ts", "tsx", "mdx"],
}

export default withMDX(nextConfig)
