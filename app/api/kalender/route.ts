import { getToken } from 'next-auth/jwt'
import { google } from 'googleapis'
import { NextResponse, NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  
  if (!token?.accessToken) {
    return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  }

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

  return NextResponse.json({ events })
}
