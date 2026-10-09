import { NextResponse } from 'next/server'
import { supabaseAdmin, nutzerAusAnfrage } from '../../Lib/supabaseAdmin'
import { icsAbholen } from '../../Lib/kalenderSync'

// Kalender-Link des angemeldeten Dienstleisters sofort abholen (Knopf „Verbinden“)
export async function GET(req: Request) {
  const user = await nutzerAusAnfrage(req)
  if (!user) return NextResponse.json({ error: 'Bitte melde dich erneut an.' }, { status: 401 })

  const { data: profil } = await supabaseAdmin
    .from('dienstleister')
    .select('ics_url')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!profil?.ics_url) {
    return NextResponse.json({ error: 'Kein Kalenderlink hinterlegt' }, { status: 400 })
  }

  const ergebnis = await icsAbholen(user.id, profil.ics_url)
  if (ergebnis.ok === false) return NextResponse.json({ error: ergebnis.fehler }, { status: 502 })

  // Nur die Anzahl zählt für die Anzeige; Termin-Details verlassen den Server nicht
  return NextResponse.json({ events: Array.from({ length: ergebnis.anzahl }, () => ({})) })
}
