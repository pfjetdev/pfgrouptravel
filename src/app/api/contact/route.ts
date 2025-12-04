import { NextResponse } from 'next/server'
import { supabase, ContactRequest } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body: ContactRequest = await request.json()

    // Validate required fields
    if (!body.first_name || !body.last_name || !body.email ||
        !body.phone || !body.inquiry_type || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('contact_requests')
      .insert([{
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        phone: body.phone,
        inquiry_type: body.inquiry_type,
        group_size: body.group_size || null,
        message: body.message,
        status: 'new'
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save contact request' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Contact request submitted successfully',
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
