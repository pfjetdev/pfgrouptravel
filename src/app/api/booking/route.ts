import { NextResponse } from 'next/server'
import { supabase, BookingRequest } from '@/lib/supabase'
import { sendTelegramMessage, formatBookingMessage } from '@/lib/telegram'

export async function POST(request: Request) {
  try {
    const body: BookingRequest = await request.json()

    // Validate required fields
    if (!body.trip_type || !body.from_airport || !body.to_airport ||
        !body.departure_date || !body.passengers || !body.cabin_class ||
        !body.full_name || !body.phone || !body.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('booking_requests')
      .insert([{
        trip_type: body.trip_type,
        from_airport: body.from_airport,
        to_airport: body.to_airport,
        departure_date: body.departure_date,
        return_date: body.return_date || null,
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
        { error: 'Failed to save booking request', details: error.message },
        { status: 500 }
      )
    }

    // Send Telegram notification (non-blocking)
    sendTelegramMessage(formatBookingMessage(body)).catch(err =>
      console.error('Telegram notification failed:', err)
    )

    return NextResponse.json({
      success: true,
      message: 'Booking request submitted successfully',
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
