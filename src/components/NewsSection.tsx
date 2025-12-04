import Image from "next/image"
import Link from "next/link"
import { Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase, News } from "@/lib/supabase"

async function getNews(): Promise<News[]> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('published_at', { ascending: false })
    .limit(3)

  if (error) {
    console.error('Error fetching news:', error)
    return []
  }

  return data || []
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export async function NewsSection() {
  const news = await getNews()

  if (news.length === 0) {
    return null
  }

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Latest News & Tips
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Stay updated with travel trends, tips, and exclusive offers for group bookings.
            </p>
          </div>
          <Link href="/news">
            <Button variant="outline" className="self-start sm:self-auto">
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* News Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {news.map((article) => (
            <div
              key={article.id}
              className="overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={article.image_url}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <Badge className="absolute top-4 left-4 bg-primary hover:bg-primary">
                  {article.category}
                </Badge>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(article.published_at)}</span>
                </div>
                <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-3">
                  <Link href={`/news/${article.slug}`}>{article.title}</Link>
                </h3>
                <p className="text-muted-foreground line-clamp-2 mb-4">
                  {article.excerpt}
                </p>
                <Link
                  href={`/news/${article.slug}`}
                  className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                  Read More
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
