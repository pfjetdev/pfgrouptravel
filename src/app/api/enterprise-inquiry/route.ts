import { NextResponse } from 'next/server'
import { supabase, EnterpriseInquiry } from '@/lib/supabase'
import { sendTelegramMessage, formatEnterpriseMessage } from '@/lib/telegram'

export async function POST(request: Request) {
  try {
    const body: EnterpriseInquiry = await request.json()

    // Validate required fields
    if (!body.company_name || !body.contact_name || !body.email ||
        !body.phone || !body.industry_type || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('enterprise_inquiries')
      .insert([{
        company_name: body.company_name,
        contact_name: body.contact_name,
        email: body.email,
        phone: body.phone,
        industry_type: body.industry_type,
        annual_travel_budget: body.annual_travel_budget || null,
        number_of_employees: body.number_of_employees || null,
        message: body.message,
        status: 'new'
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save enterprise inquiry' },
        { status: 500 }
      )
    }

    // Send Telegram notification (non-blocking)
    sendTelegramMessage(formatEnterpriseMessage(body)).catch(err =>
      console.error('Telegram notification failed:', err)
    )

    return NextResponse.json({
      success: true,
      message: 'Enterprise inquiry submitted successfully',
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
