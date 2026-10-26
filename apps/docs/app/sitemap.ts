import type { MetadataRoute } from "next"
import { chapterHref, chapters, siteOrigin } from "@/lib/docs-navigation"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: new URL("/", siteOrigin).href, priority: 1 }, ...chapters.map((chapter) => ({ url: new URL(chapterHref(chapter.slug), siteOrigin).href, priority: 0.8 }))]
}
