import { NextResponse } from 'next/server'
import { supabase, Destination } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching destinations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch destinations' },
      { status: 500 }
    )
  }

  return NextResponse.json(data as Destination[])
}
