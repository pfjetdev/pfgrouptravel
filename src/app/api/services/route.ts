import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export interface ServiceRequest {
  service_type: 'hotel' | 'transfer'
  // Hotel specific
  destination?: string
  check_in_date?: string
  check_out_date?: string
  guests?: number
  // Transfer specific
  pickup_location?: string
  dropoff_location?: string
  transfer_date?: string
  passengers?: number
  // Contact info
  first_name: string
  last_name: string
  email: string
  phone: string
}

export async function POST(request: Request) {
  try {
    const body: ServiceRequest = await request.json()

    // Validate required fields
    if (!body.service_type || !body.first_name || !body.last_name ||
        !body.email || !body.phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate service-specific fields
    if (body.service_type === 'hotel') {
      if (!body.destination || !body.check_in_date || !body.check_out_date || !body.guests) {
        return NextResponse.json(
          { error: 'Missing hotel booking fields' },
          { status: 400 }
        )
      }
    } else if (body.service_type === 'transfer') {
      if (!body.pickup_location || !body.dropoff_location || !body.transfer_date || !body.passengers) {
        return NextResponse.json(
          { error: 'Missing transfer booking fields' },
          { status: 400 }
        )
      }
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('service_requests')
      .insert([{
        service_type: body.service_type,
        destination: body.destination || null,
        check_in_date: body.check_in_date || null,
        check_out_date: body.check_out_date || null,
        guests: body.guests || null,
        pickup_location: body.pickup_location || null,
        dropoff_location: body.dropoff_location || null,
        transfer_date: body.transfer_date || null,
        passengers: body.passengers || null,
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        phone: body.phone,
        status: 'new'
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save service request', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Service request submitted successfully',
      id: data.id
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
