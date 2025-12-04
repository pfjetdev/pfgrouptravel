import { MetadataRoute } from "next"
import { supabase } from "@/lib/supabase"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://priorityflyers.com"

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/practical-information`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/multi-city`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/news`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ]

  // Dynamic news pages
  const { data: articles } = await supabase
    .from("news")
    .select("slug, updated_at")
    .eq("is_active", true)

  const newsPages: MetadataRoute.Sitemap = (articles || []).map((article) => ({
    url: `${siteUrl}/news/${article.slug}`,
    lastModified: new Date(article.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [...staticPages, ...newsPages]
}
