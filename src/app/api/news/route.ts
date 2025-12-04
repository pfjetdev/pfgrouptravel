import { NextResponse } from 'next/server'
import { supabase, News } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const featured = searchParams.get('featured')
  const category = searchParams.get('category')
  const limit = searchParams.get('limit')

  // If slug is provided, get single article
  if (slug) {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('is_active', true)
      .eq('slug', slug)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Article not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching news:', error)
      return NextResponse.json(
        { error: 'Failed to fetch news' },
        { status: 500 }
      )
    }

    return NextResponse.json(data as News)
  }

  // Build query for multiple articles
  let query = supabase
    .from('news')
    .select('*')
    .eq('is_active', true)

  // Filter by featured
  if (featured === 'true') {
    query = query.eq('is_featured', true)
  }

  // Filter by category
  if (category) {
    query = query.eq('category', category)
  }

  // Order by sort_order and published_at
  query = query.order('sort_order', { ascending: true })
    .order('published_at', { ascending: false })

  // Limit results
  if (limit) {
    query = query.limit(parseInt(limit))
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }

  return NextResponse.json(data as News[])
}
