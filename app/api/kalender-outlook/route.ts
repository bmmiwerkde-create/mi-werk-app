import { getToken } from 'next-auth/jwt'
import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token?.accessToken || token.provider !== 'microsoft-entra-id') {
    return NextResponse.json({ error: 'Nicht mit Microsoft eingeloggt' }, { status: 401 })
  }

  const userId = req.nextUrl.searchParams.get('userId')

  const now = new Date().toISOString()
  const inDreiMonaten = new Date()
  inDreiMonaten.setMonth(inDreiMonaten.getMonth() + 3)

  const res = await fetch(
    `https://graph.microsoft.com/v1.0/me/calendarView?startDateTime=${now}&endDateTime=${inDreiMonaten.toISOString()}&$select=subject,start,end&$top=100`,
    {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        'Content-Type': 'application/json',
      }
    }
  )

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: err }, { status: res.status })
  }

  const data = await res.json()
  const events = (data.value || []).map((e: any) => ({
    start: e.start.dateTime,
    end: e.end.dateTime,
    title: e.subject,
  }))

  if (userId && events.length > 0) {
    await supabaseAdmin.from('kalender_events').delete().eq('user_id', userId)
    await supabaseAdmin.from('kalender_events').insert(
      events.map((e: any) => ({
        user_id: userId,
        titel: 'Belegt',
        start_zeit: e.start,
        end_zeit: e.end,
      }))
    )
  }

  return NextResponse.json({ events })
}
