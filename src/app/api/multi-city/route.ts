import { NextResponse } from 'next/server'
import { supabase, MultiCityBookingRequest } from '@/lib/supabase'
import { sendTelegramMessage, formatMultiCityMessage } from '@/lib/telegram'

export async function POST(request: Request) {
  try {
    const body: MultiCityBookingRequest = await request.json()

    // Validate required fields
    if (!body.flights || !Array.isArray(body.flights) || body.flights.length === 0 ||
        !body.passengers || !body.cabin_class ||
        !body.full_name || !body.phone || !body.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate each flight segment
    for (const flight of body.flights) {
      if (!flight.from || !flight.to || !flight.date) {
        return NextResponse.json(
          { error: 'Each flight segment must have from, to, and date' },
          { status: 400 }
        )
      }
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('multi_city_requests')
      .insert([{
        flights: body.flights,
        passengers: body.passengers,
        cabin_class: body.cabin_class,
        full_name: body.full_name,
        phone: body.phone,
        email: body.email,
        status: 'new'
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save multi-city request' },
        { status: 500 }
      )
    }

    // Send Telegram notification (non-blocking)
    sendTelegramMessage(formatMultiCityMessage(body)).catch(err =>
      console.error('Telegram notification failed:', err)
    )

    return NextResponse.json({
      success: true,
      message: 'Multi-city booking request submitted successfully',
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
