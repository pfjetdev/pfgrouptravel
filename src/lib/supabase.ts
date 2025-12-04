import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Using service role key for server-side operations (bypasses RLS)
export const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Types for our database tables
export interface BookingRequest {
  id?: string
  created_at?: string
  // Flight info
  trip_type: 'roundTrip' | 'oneWay' | 'multiCity'
  from_airport: string
  to_airport: string
  departure_date: string
  return_date?: string | null
  passengers: number
  cabin_class: 'economy' | 'business' | 'first'
  // Contact info
  full_name: string
  phone: string
  email: string
  status?: 'new' | 'contacted' | 'processing' | 'completed' | 'cancelled'
}

export interface ContactRequest {
  id?: string
  created_at?: string
  first_name: string
  last_name: string
  email: string
  phone: string
  inquiry_type: string
  group_size?: string | null
  message: string
  status?: 'new' | 'replied' | 'closed'
}

export interface MultiCityBookingRequest {
  id?: string
  created_at?: string
  // Flights array stored as JSONB
  flights: Array<{
    from: string
    to: string
    date: string
  }>
  passengers: number
  cabin_class: 'economy' | 'business' | 'first'
  // Contact info
  full_name: string
  phone: string
  email: string
  status?: 'new' | 'contacted' | 'processing' | 'completed' | 'cancelled'
}

export interface Destination {
  id: string
  created_at: string
  city: string
  country: string
  image_url: string
  price: string
  sort_order: number
  is_active: boolean
}

export interface News {
  id: string
  created_at: string
  title: string
  slug: string
  excerpt: string
  content: string
  image_url: string
  category: string
  read_time: string
  author_name: string
  author_role: string
  author_avatar: string | null
  published_at: string
  is_featured: boolean
  is_active: boolean
  sort_order: number
}
