/**
 * Telegram notification utility
 * Sends form submissions to Telegram channel/group
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

interface TelegramMessage {
  chat_id: string
  text: string
  parse_mode: 'HTML' | 'Markdown'
}

/**
 * Send message to Telegram
 */
export async function sendTelegramMessage(message: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('⚠️ Telegram credentials not configured. Skipping notification.')
    return false
  }

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

    const payload: TelegramMessage = {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('❌ Telegram API error:', error)
      return false
    }

    console.log('✅ Telegram notification sent successfully')
    return true
  } catch (error) {
    console.error('❌ Failed to send Telegram message:', error)
    return false
  }
}

/**
 * Format booking request for Telegram
 */
export function formatBookingMessage(data: {
  trip_type: string
  from_airport: string
  to_airport: string
  departure_date: string
  return_date?: string | null
  passengers: number
  cabin_class: string
  full_name: string
  phone: string
  email: string
}): string {
  const tripTypeEmoji = data.trip_type === 'roundTrip' ? '🔄' : data.trip_type === 'oneWay' ? '➡️' : '🗺️'

  return `
<b>Group Travel</b>

🎫 <b>NEW BOOKING REQUEST</b> ${tripTypeEmoji}

👤 <b>Passenger Info:</b>
• Name: ${data.full_name}
• Phone: ${data.phone}
• Email: ${data.email}

✈️ <b>Flight Details:</b>
• Type: ${data.trip_type}
• From: ${data.from_airport}
• To: ${data.to_airport}
• Departure: ${data.departure_date}
${data.return_date ? `• Return: ${data.return_date}` : ''}
• Passengers: ${data.passengers}
• Class: ${data.cabin_class}

⏰ <i>Received at ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PST</i>
  `.trim()
}

/**
 * Format contact request for Telegram
 */
export function formatContactMessage(data: {
  first_name: string
  last_name: string
  email: string
  phone: string
  inquiry_type: string
  group_size?: string | null
  message: string
}): string {
  return `
<b>Group Travel</b>

💬 <b>NEW CONTACT REQUEST</b>

👤 <b>Contact Info:</b>
• Name: ${data.first_name} ${data.last_name}
• Phone: ${data.phone}
• Email: ${data.email}

📋 <b>Inquiry Details:</b>
• Type: ${data.inquiry_type}
${data.group_size ? `• Group Size: ${data.group_size}` : ''}

💭 <b>Message:</b>
${data.message}

⏰ <i>Received at ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PST</i>
  `.trim()
}

/**
 * Format enterprise inquiry for Telegram
 */
export function formatEnterpriseMessage(data: {
  company_name: string
  contact_name: string
  email: string
  phone: string
  industry_type: string
  annual_travel_budget?: string | null
  number_of_employees?: string | null
  message: string
}): string {
  return `
<b>Group Travel</b>

🏢 <b>NEW ENTERPRISE INQUIRY</b> 💼

🏛️ <b>Company Info:</b>
• Company: ${data.company_name}
• Contact: ${data.contact_name}
• Industry: ${data.industry_type}
${data.number_of_employees ? `• Employees: ${data.number_of_employees}` : ''}
${data.annual_travel_budget ? `• Budget: ${data.annual_travel_budget}` : ''}

📞 <b>Contact:</b>
• Phone: ${data.phone}
• Email: ${data.email}

💭 <b>Requirements:</b>
${data.message}

⏰ <i>Received at ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PST</i>
  `.trim()
}

/**
 * Format multi-city booking for Telegram
 */
export function formatMultiCityMessage(data: {
  flights: Array<{ from: string; to: string; date: string }>
  passengers: number
  cabin_class: string
  full_name: string
  phone: string
  email: string
}): string {
  const flightsList = data.flights
    .map((f, i) => `  ${i + 1}. ${f.from} → ${f.to} (${f.date})`)
    .join('\n')

  return `
<b>Group Travel</b>

🗺️ <b>NEW MULTI-CITY BOOKING</b>

👤 <b>Passenger Info:</b>
• Name: ${data.full_name}
• Phone: ${data.phone}
• Email: ${data.email}

✈️ <b>Flight Segments:</b>
${flightsList}

👥 <b>Details:</b>
• Passengers: ${data.passengers}
• Class: ${data.cabin_class}

⏰ <i>Received at ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PST</i>
  `.trim()
}
