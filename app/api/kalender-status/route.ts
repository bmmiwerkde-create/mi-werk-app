import { NextResponse, NextRequest } from 'next/server'
import { supabaseAdmin } from '../../Lib/supabaseAdmin'

// Verrät für ein Profil nur, OB ein Kalender verbunden ist (nie den Link selbst)
export async function GET(req: NextRequest) {
  const id = Number(req.nextUrl.searchParams.get('id'))
  if (!id) return NextResponse.json({ verbunden: false })

  const { data } = await supabaseAdmin.from('dienstleister').select('ics_url, user_id').eq('id', id).maybeSingle()
  if (!data) return NextResponse.json({ verbunden: false })
  if (data.ics_url) return NextResponse.json({ verbunden: true })

  // Google/Outlook: verbunden, wenn schon Termine übernommen wurden
  const { count } = await supabaseAdmin.from('kalender_events').select('id', { count: 'exact', head: true }).eq('user_id', data.user_id)
  return NextResponse.json({ verbunden: (count || 0) > 0 })
}
