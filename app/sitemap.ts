import type { MetadataRoute } from "next"
import { concepts } from "@/lib/concepts"

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.howreactnativeworks.com"

// Only published concepts are listed — drafts stay out of the index.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...concepts
      .filter((c) => c.published)
      .map((c) => ({
        url: `${BASE}/learn/${c.id}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
  ]
}
