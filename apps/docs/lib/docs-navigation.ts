import chapterList from "@/content/chapters.json"

export const chapters = chapterList
export type Chapter = (typeof chapters)[number]
export const chapterGroups = [...new Set(chapters.map((chapter) => chapter.group))]
export const sourceRepository = "https://github.com/zagoourai-hub/tutorial-connect-midtrans-nextjs"
export const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export function chapterHref(slug: string) {
  return `/docs/${slug}/`
}
