import Image from "next/image"
import Link from "next/link"
import { Calendar, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { supabase, News } from "@/lib/supabase"

async function getNews(category?: string): Promise<News[]> {
  let query = supabase
    .from('news')
    .select('*')
    .eq('is_active', true)

  if (category && category !== 'All') {
    query = query.eq('category', category)
  }

  const { data, error } = await query
    .order('sort_order', { ascending: true })
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching news:', error)
    return []
  }

  return data || []
}

async function getCategories(): Promise<{ name: string; count: number }[]> {
  const { data, error } = await supabase
    .from('news')
    .select('category')
    .eq('is_active', true)

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  const categoryMap = new Map<string, number>()
  let total = 0

  data?.forEach((item) => {
    const count = categoryMap.get(item.category) || 0
    categoryMap.set(item.category, count + 1)
    total++
  })

  const categories = [
    { name: "All", count: total },
    ...Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  ]

  return categories
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category: selectedCategory } = await searchParams
  const activeCategory = selectedCategory || 'All'

  const allNews = await getNews(activeCategory)
  const categories = await getCategories()

  const featuredArticle = activeCategory === 'All'
    ? allNews.find(article => article.is_featured) || allNews[0]
    : allNews[0]
  const articles = allNews.filter(article => article.id !== featuredArticle?.id)

  if (!featuredArticle) {
    return (
      <div className="min-h-screen">
        <section className="bg-gradient-to-br from-primary/10 via-background to-background pt-32 pb-16">
          <div className="mx-auto max-w-6xl px-4">
            <Badge variant="secondary" className="mb-4">
              Blog & Updates
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              News & Travel Tips
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              No articles available at the moment. Check back soon!
            </p>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background pt-32 pb-16">
        <div className="mx-auto max-w-6xl px-4">
          <Badge variant="secondary" className="mb-4">
            Blog & Updates
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            News & Travel Tips
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Stay informed with the latest travel trends, expert tips, and exclusive insights
            for group bookings.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b py-4">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.name === 'All' ? '/news' : `/news?category=${encodeURIComponent(category.name)}`}
              >
                <Button
                  variant={category.name === activeCategory ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                >
                  {category.name}
                  <span className="ml-1.5 text-xs opacity-70">({category.count})</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <Link href={`/news/${featuredArticle.slug}`} className="group block">
            <Card className="overflow-hidden p-0">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto md:min-h-[350px]">
                  <Image
                    src={featuredArticle.image_url}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {activeCategory === 'All' && featuredArticle.is_featured && (
                    <Badge className="absolute top-4 left-4 bg-primary">Featured</Badge>
                  )}
                </div>
                <CardContent className="flex flex-col justify-center p-8">
                  <Badge variant="secondary" className="w-fit mb-4">
                    {featuredArticle.category}
                  </Badge>
                  <h2 className="text-2xl font-bold group-hover:text-primary transition-colors md:text-3xl">
                    {featuredArticle.title}
                  </h2>
                  <p className="mt-4 text-muted-foreground">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(featuredArticle.published_at)}
                    </div>
                    <span>{featuredArticle.read_time}</span>
                  </div>
                  <Button className="mt-6 w-fit">
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* Articles Grid */}
      {articles.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-bold mb-8">
              {activeCategory === 'All' ? 'Latest Articles' : `${activeCategory} Articles`}
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="group"
                >
                  <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg p-0">
                    <div className="relative h-48 overflow-hidden rounded-t-xl">
                      <Image
                        src={article.image_url}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <Badge className="absolute top-3 left-3 bg-primary/90">
                        {article.category}
                      </Badge>
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(article.published_at)}
                        </div>
                        <span>{article.read_time}</span>
                      </div>
                      <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                        Read More
                        <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
