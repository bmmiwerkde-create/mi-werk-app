import { getToken } from 'next-auth/jwt'
import { google } from 'googleapis'
import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  
  if (!token?.accessToken) {
    return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  }

  const userId = req.nextUrl.searchParams.get('userId')

  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: token.accessToken as string })
  const calendar = google.calendar({ version: 'v3', auth })
  
  const now = new Date()
  const inDreiMonaten = new Date()
  inDreiMonaten.setMonth(inDreiMonaten.getMonth() + 3)

  const { data } = await calendar.events.list({
    calendarId: 'primary',
    timeMin: now.toISOString(),
    timeMax: inDreiMonaten.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 100,
  })

  const events = data.items?.map(e => ({
    start: e.start?.dateTime || e.start?.date,
    end: e.end?.dateTime || e.end?.date,
    title: e.summary,
  })) || []

  if (userId && events.length > 0) {
    await supabaseAdmin
      .from('kalender_events')
      .delete()
      .eq('user_id', userId)

    await supabaseAdmin
      .from('kalender_events')
      .insert(events.map(e => ({
        user_id: userId,
        titel: e.title || 'Termin',
        start_zeit: e.start,
        end_zeit: e.end,
      })))
  }

  return NextResponse.json({ events })
}
