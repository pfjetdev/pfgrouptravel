import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { supabase, News } from "@/lib/supabase"

async function getArticle(slug: string): Promise<News | null> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching article:', error)
    return null
  }

  return data
}

async function getRelatedArticles(slug: string, category: string): Promise<News[]> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('is_active', true)
    .eq('category', category)
    .neq('slug', slug)
    .order('published_at', { ascending: false })
    .limit(3)

  if (error) {
    console.error('Error fetching related articles:', error)
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

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(slug, article.category)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] md:h-[60vh]">
        <Image
          src={article.image_url}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        {/* Back Button */}
        <div className="absolute top-24 left-0 right-0">
          <div className="mx-auto max-w-4xl px-4">
            <Link href="/news">
              <Button variant="secondary" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to News
              </Button>
            </Link>
          </div>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 pb-12">
          <div className="mx-auto max-w-4xl px-4">
            <Badge className="mb-4 bg-primary">{article.category}</Badge>
            <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              {article.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(article.published_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{article.read_time}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
            {/* Article Content */}
            <article>
              {/* Author Card */}
              <Card className="mb-8">
                <CardContent className="flex items-center gap-4 p-4">
                  <div>
                    <p className="font-semibold">{article.author_name}</p>
                    <p className="text-sm text-muted-foreground">{article.author_role}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Article Body */}
              <div
                className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-strong:text-foreground"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              <Separator className="my-8" />

              {/* Share Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="font-semibold flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share this article
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* CTA Card */}
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Ready to Book?</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Get a free quote for your group travel needs.
                  </p>
                  <Link href="/contact">
                    <Button variant="secondary" className="w-full">
                      Contact Us
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Newsletter Card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-2">Stay Updated</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Subscribe to our newsletter for the latest travel tips and exclusive offers.
                  </p>
                  <Button variant="outline" className="w-full">
                    Subscribe
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((relArticle) => (
                <Link
                  key={relArticle.id}
                  href={`/news/${relArticle.slug}`}
                  className="group"
                >
                  <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg p-0">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={relArticle.image_url}
                        alt={relArticle.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <Badge className="absolute top-3 left-3 bg-primary/90">
                        {relArticle.category}
                      </Badge>
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(relArticle.published_at)}
                        </div>
                        <span>{relArticle.read_time}</span>
                      </div>
                      <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        {relArticle.title}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Plan Your Group Trip?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Our team of experts is ready to help you organize the perfect group travel experience. Get started with a free consultation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="secondary">
                Get a Free Quote
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Book Online
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    return {
      title: "Article Not Found",
    }
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.published_at,
      authors: [article.author_name],
      images: [
        {
          url: article.image_url,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.image_url],
    },
  }
}
