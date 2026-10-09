// Kalender per Link (iPhone/iCloud, Google-iCal, Outlook-ICS) abholen und als "Belegt"-Zeiten speichern.
// Nur auf dem Server verwenden.
import ical from 'node-ical'
import { supabaseAdmin } from './supabaseAdmin'

// Höchstens so oft wird ein Kalender automatisch neu abgeholt
export const AUFFRISCHEN_NACH_MINUTEN = 15

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

export type IcsErgebnis = { ok: true; anzahl: number } | { ok: false; fehler: string }

// Holt den Kalender, löst wiederkehrende Termine auf und ersetzt die gespeicherten Zeiten des Nutzers
export async function icsAbholen(userId: string, rohLink: string): Promise<IcsErgebnis> {
  const icsUrl = rohLink.trim().replace(/^webcal:\/\//i, 'https://')
  if (!istErlaubteUrl(icsUrl)) return { ok: false, fehler: 'Ungültiger Kalenderlink' }

  let text: string
  try {
    const res = await fetch(icsUrl, { signal: AbortSignal.timeout(15000) })
    if (!res.ok) return { ok: false, fehler: 'Kalender konnte nicht abgerufen werden' }
    text = await res.text()
  } catch {
    return { ok: false, fehler: 'Kalender konnte nicht abgerufen werden' }
  }

  const von = new Date()
  const bis = new Date()
  bis.setMonth(bis.getMonth() + 3)

  const zeiten: { start_zeit: string; end_zeit: string }[] = []
  try {
    const parsed = ical.parseICS(text)
    for (const e of Object.values(parsed) as any[]) {
      if (e.type !== 'VEVENT' || !e.start) continue
      // Auch einzelne Termine laufen hierdurch; wiederkehrende werden in einzelne Termine aufgelöst
      const instanzen = ical.expandRecurringEvent(e, { from: von, to: bis, expandOngoing: true })
      for (const i of instanzen) {
        const start = new Date(i.start as any)
        const ende = new Date((i.end || i.start) as any)
        if (ende >= von && start <= bis) zeiten.push({ start_zeit: start.toISOString(), end_zeit: ende.toISOString() })
      }
    }
  } catch {
    return { ok: false, fehler: 'Kalender konnte nicht gelesen werden' }
  }

  await supabaseAdmin.from('kalender_events').delete().eq('user_id', userId)
  if (zeiten.length > 0) {
    await supabaseAdmin.from('kalender_events').insert(
      zeiten.slice(0, 1000).map(z => ({ user_id: userId, titel: 'Belegt', ...z }))
    )
  }
  await supabaseAdmin.from('dienstleister').update({ kalender_sync_am: new Date().toISOString() }).eq('user_id', userId)

  return { ok: true, anzahl: zeiten.length }
}

// Frischt veraltete Kalender der angegebenen Profile auf. Gibt die IDs zurück, die neu abgeholt wurden.
export async function veralteteAuffrischen(ids?: number[]) {
  let abfrage = supabaseAdmin.from('dienstleister').select('id, user_id, ics_url, kalender_sync_am').not('ics_url', 'is', null)
  if (ids) abfrage = abfrage.in('id', ids)
  const { data } = await abfrage
  const grenze = Date.now() - AUFFRISCHEN_NACH_MINUTEN * 60 * 1000
  const faellig = (data || []).filter(d => d.ics_url && (!d.kalender_sync_am || new Date(d.kalender_sync_am).getTime() < grenze))

  const erledigt: number[] = []
  await Promise.all(faellig.map(async d => {
    // Zeitpunkt sofort setzen, damit parallele Aufrufe denselben Kalender nicht doppelt abholen
    await supabaseAdmin.from('dienstleister').update({ kalender_sync_am: new Date().toISOString() }).eq('id', d.id)
    const r = await icsAbholen(d.user_id, d.ics_url as string)
    if (r.ok) erledigt.push(d.id)
  }))
  return erledigt
}
