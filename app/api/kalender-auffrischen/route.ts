import { NextResponse } from 'next/server'
import { veralteteAuffrischen } from '../../Lib/kalenderSync'

// Wird beim Öffnen von Profil und Suche aufgerufen: holt Kalender neu ab,
// die länger als AUFFRISCHEN_NACH_MINUTEN nicht aktualisiert wurden.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const ids = (Array.isArray(body?.ids) ? body.ids : [])
    .map((x: unknown) => Number(x))
    .filter((x: number) => Number.isInteger(x) && x > 0)
    .slice(0, 50)
  if (ids.length === 0) return NextResponse.json({ aktualisiert: [] })

  const aktualisiert = await veralteteAuffrischen(ids)
  return NextResponse.json({ aktualisiert })
}
