import { createClient } from '@supabase/supabase-js'

// Config
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Topics to generate
const TOPICS = [
  {
    topic: 'Рост спроса на group travel в 2025 году',
    category: 'Industry Trends',
    author: { name: 'Sarah Mitchell', role: 'Travel Expert', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' }
  },
  {
    topic: 'Какие направления чаще всего бронируют группы',
    category: 'Destinations',
    author: { name: 'Emily Rodriguez', role: 'Destination Specialist', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' }
  },
  {
    topic: 'Авиакомпании, которые лучше всего работают с групповыми тарифами',
    category: 'Tips & Tricks',
    author: { name: 'Michael Chen', role: 'Corporate Travel Specialist', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' }
  },
  {
    topic: 'Появление новых маршрутов и лоукост-хабов',
    category: 'News',
    author: { name: 'James Wilson', role: 'Industry Analyst', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' }
  },
  {
    topic: 'Как меняются цены на билеты при групповых перелётах',
    category: 'Tips & Tricks',
    author: { name: 'Sarah Mitchell', role: 'Travel Expert', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' }
  },
  {
    topic: 'Перспективы чартерных перевозок для бизнеса и туризма',
    category: 'Corporate Travel',
    author: { name: 'Michael Chen', role: 'Corporate Travel Specialist', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' }
  },
  {
    topic: 'Как авиакомпании пересматривают условия групповых тарифов',
    category: 'News',
    author: { name: 'James Wilson', role: 'Industry Analyst', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' }
  }
]

// Unsplash images for articles
const IMAGES = [
  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1559268950-2d7ceb2efa3a?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=1200&h=600&fit=crop',
]

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[а-яё]/g, (char) => {
      const map: Record<string, string> = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
        'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
      }
      return map[char] || char
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

async function generateArticle(topic: string): Promise<{ title: string; excerpt: string; content: string }> {
  const prompt = `You are a professional travel journalist writing for Priority Flyers, a group travel booking company.

Write a comprehensive article about: "${topic}"

The article should be:
- Written in English (this is important!)
- Professional but engaging tone
- Focused on group travel (10+ passengers)
- Include practical advice and insights
- Reference current 2025 trends
- Mention Priority Flyers as a solution where appropriate

Return JSON with this exact structure:
{
  "title": "Catchy English title (max 70 chars)",
  "excerpt": "Brief summary in 1-2 sentences (max 200 chars)",
  "content": "Full HTML article with <h2>, <p>, <ul>, <li> tags. 4-6 sections, 800-1200 words total."
}

Important:
- Content must be valid HTML
- Use proper semantic tags
- No markdown, only HTML
- Make it informative and valuable for group travel organizers`

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.YOUR_SITE_URL || 'http://localhost:3000',
      'X-Title': process.env.YOUR_SITE_NAME || 'Group Travel'
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  const content = data.choices[0].message.content

  try {
    return JSON.parse(content)
  } catch {
    console.error('Failed to parse JSON:', content)
    throw new Error('Invalid JSON response from AI')
  }
}

function estimateReadTime(content: string): string {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  const minutes = Math.ceil(words / 200)
  return `${minutes} min read`
}

async function saveToSupabase(article: {
  title: string
  slug: string
  excerpt: string
  content: string
  image_url: string
  category: string
  read_time: string
  author_name: string
  author_role: string
  author_avatar: string
  is_featured: boolean
  sort_order: number
}) {
  // Check if article with this slug already exists
  const { data: existing } = await supabase
    .from('news')
    .select('id')
    .eq('slug', article.slug)
    .single()

  if (existing) {
    // Update existing article
    const { error } = await supabase
      .from('news')
      .update({
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        image_url: article.image_url,
        category: article.category,
        read_time: article.read_time,
        author_name: article.author_name,
        author_role: article.author_role,
        author_avatar: article.author_avatar,
        is_featured: article.is_featured,
        sort_order: article.sort_order,
        published_at: new Date().toISOString()
      })
      .eq('slug', article.slug)

    if (error) throw error
    console.log(`✅ Updated: ${article.title}`)
  } else {
    // Insert new article
    const { error } = await supabase
      .from('news')
      .insert(article)

    if (error) throw error
    console.log(`✅ Created: ${article.title}`)
  }
}

async function main() {
  console.log('🚀 Starting article generation...\n')

  // Get current max sort_order
  const { data: maxSortData } = await supabase
    .from('news')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()

  let sortOrder = (maxSortData?.sort_order || 0) + 1

  // Process all topics in parallel for speed
  const results = await Promise.allSettled(
    TOPICS.map(async ({ topic, category, author }, index) => {
      console.log(`📝 Generating: ${topic}`)

      const generated = await generateArticle(topic)
      const slug = slugify(generated.title)

      await saveToSupabase({
        title: generated.title,
        slug,
        excerpt: generated.excerpt,
        content: generated.content,
        image_url: IMAGES[index % IMAGES.length],
        category,
        read_time: estimateReadTime(generated.content),
        author_name: author.name,
        author_role: author.role,
        author_avatar: author.avatar,
        is_featured: index === 0, // First article is featured
        sort_order: sortOrder + index
      })

      return generated.title
    })
  )

  // Summary
  console.log('\n📊 Summary:')
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`  ✅ ${result.value}`)
    } else {
      console.log(`  ❌ ${TOPICS[index].topic}: ${result.reason}`)
    }
  })

  const successful = results.filter(r => r.status === 'fulfilled').length
  console.log(`\n🎉 Done! Generated ${successful}/${TOPICS.length} articles.`)
}

main().catch(console.error)
