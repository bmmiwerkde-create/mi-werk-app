import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import ical from 'node-ical'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function istErlaubteUrl(raw: string) {
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return false
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return false

  const host = url.hostname.toLowerCase()
  if (host === 'localhost' || host === '0.0.0.0' || host === '::1') return false
  if (/^127\./.test(host)) return false
  if (/^10\./.test(host)) return false
  if (/^192\.168\./.test(host)) return false
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(host)) return false
  if (/^169\.254\./.test(host)) return false

  return true
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  if (!userId) {
    return NextResponse.json({ error: 'userId fehlt' }, { status: 400 })
  }

  const { data: profil } = await supabaseAdmin
    .from('dienstleister')
    .select('ics_url')
    .eq('user_id', userId)
    .single()

  if (!profil?.ics_url) {
    return NextResponse.json({ error: 'Kein Kalenderlink hinterlegt' }, { status: 400 })
  }

  const icsUrl = profil.ics_url.replace(/^webcal:\/\//i, 'https://')
  if (!istErlaubteUrl(icsUrl)) {
    return NextResponse.json({ error: 'Ungültiger Kalenderlink' }, { status: 400 })
  }

  const res = await fetch(icsUrl)
  if (!res.ok) {
    return NextResponse.json({ error: 'Kalender konnte nicht abgerufen werden' }, { status: 502 })
  }
  const text = await res.text()

  const parsed = ical.parseICS(text)
  const now = new Date()
  const inDreiMonaten = new Date()
  inDreiMonaten.setMonth(inDreiMonaten.getMonth() + 3)

  const events = Object.values(parsed)
    .filter((e: any) => e.type === 'VEVENT' && e.start && e.end)
    .filter((e: any) => new Date(e.end) >= now && new Date(e.start) <= inDreiMonaten)
    .map((e: any) => ({
      start: new Date(e.start).toISOString(),
      end: new Date(e.end).toISOString(),
      title: e.summary,
    }))

  await supabaseAdmin.from('kalender_events').delete().eq('user_id', userId)
  if (events.length > 0) {
    await supabaseAdmin.from('kalender_events').insert(
      events.map((e) => ({
        user_id: userId,
        titel: 'Belegt',
        start_zeit: e.start,
        end_zeit: e.end,
      }))
    )
  }

  return NextResponse.json({ events })
}
