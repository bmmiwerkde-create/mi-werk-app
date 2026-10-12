import { NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '../../Lib/supabaseAdmin'
import { veralteteAuffrischen } from '../../Lib/kalenderSync'
import { Resend } from 'resend'

// Kostenlose Zeit: die ersten 50 Dienstleister 12 Monate, ab Nr. 51 einen Monat.
// Danach gibt es eine Mail mit 7 Tagen Schonfrist; wer bis dahin kein Abo hat, wird ausgeblendet.
// Statt fester Zeitfenster merken sich die Spalten frei_erinnerung_am / frei_ablauf_mail_am,
// welche Mail schon raus ist – fällt der Lauf einen Tag aus, holt der nächste ihn nach.
const SCHONFRIST_TAGE = 7
const TAG_MS = 24 * 60 * 60 * 1000

function plusMonate(datum: Date, monate: number) {
  const d = new Date(datum)
  d.setMonth(d.getMonth() + monate)
  return d
}

function mail(name: string, absaetze: string[], knopf: string) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
      <h2 style="color: #b45309;">Hallo ${name},</h2>
      ${absaetze.map(a => `<p>${a}</p>`).join('\n      ')}
      <a href="https://www.mi-werk.de/abo"
         style="display: inline-block; margin-top: 1.5rem; padding: 12px 28px;
                background: #b45309; color: white; text-decoration: none;
                border-radius: 8px; font-weight: bold;">
        ${knopf}
      </a>
      <p style="margin-top: 2rem; font-size: 13px; color: #666;">
        Du erhältst diese Mail, weil du ein Profil auf mi-werk.de erstellt hast.<br>
        <a href="https://www.mi-werk.de/datenschutz" style="color: #666;">Datenschutz</a>
      </p>
    </div>
  `
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Alle Dienstleister holen, nach id sortiert, um die ersten 50 zu bestimmen
  const { data: alleDienstleister, error: alleError } = await supabase
    .from('dienstleister')
    .select('id, name, email, erstellt_am, abo_aktiv, stripe_subscription_id, frei_erinnerung_am, frei_ablauf_mail_am')
    .order('id', { ascending: true })

  if (alleError) {
    console.error('Supabase Fehler:', alleError)
    return NextResponse.json({ error: alleError.message }, { status: 500 })
  }

  const ersteFuenfzigIds = new Set((alleDienstleister || []).slice(0, 50).map(d => d.id))
  const jetzt = new Date()
  const resend = new Resend(process.env.RESEND_API_KEY)
  const ergebnis = { erinnert: 0, abgelaufen: 0, ausgeblendet: 0, fehler: [] as string[] }

  async function senden(d: { email: string | null }, betreff: string, html: string) {
    if (!d.email) return
    await resend.emails.send({ from: 'mi-werk <noreply@mi-werk.de>', to: d.email, subject: betreff, html })
  }

  async function merken(id: number, felder: Record<string, unknown>) {
    const { error } = await supabase.from('dienstleister').update(felder).eq('id', id)
    if (error) throw error
  }

  for (const d of alleDienstleister || []) {
    // Bezahlte Abos und bereits ausgeblendete Profile brauchen nichts
    if (!d.abo_aktiv || d.stripe_subscription_id || !d.erstellt_am) continue

    const ersteFuenfzig = ersteFuenfzigIds.has(d.id)
    const freiBis = plusMonate(new Date(d.erstellt_am), ersteFuenfzig ? 12 : 1)
    const name = d.name || ''

    try {
      // 1) Nur die ersten 50: Vorwarnung einen Monat vor Ende der 12 Monate
      if (ersteFuenfzig && !d.frei_erinnerung_am && !d.frei_ablauf_mail_am && jetzt >= plusMonate(freiBis, -1)) {
        await senden(d, 'Dein kostenloses Profil läuft bald ab', mail(name, [
          'dein kostenloses Profil auf <strong>mi-werk.de</strong> ist seit 11 Monaten aktiv.',
          `In einem Monat (am ${freiBis.toLocaleDateString('de-DE')}) endet die kostenlose Phase. Damit dein Profil danach sichtbar bleibt, schließe vorher ein Abo ab.`,
        ], 'Jetzt Abo sichern'))
        await merken(d.id, { frei_erinnerung_am: jetzt.toISOString() })
        ergebnis.erinnert++
        continue
      }

      // 2) Kostenlose Zeit vorbei: Mail mit 7 Tagen Schonfrist
      if (!d.frei_ablauf_mail_am && jetzt >= freiBis) {
        const ausblendenAm = new Date(jetzt.getTime() + SCHONFRIST_TAGE * TAG_MS)
        await senden(d, 'Deine kostenlose Zeit auf mi-werk.de ist abgelaufen', mail(name, [
          'deine kostenlose Zeit auf <strong>mi-werk.de</strong> ist jetzt abgelaufen.',
          `Dein Profil bleibt noch bis zum ${ausblendenAm.toLocaleDateString('de-DE')} sichtbar. Schließ bis dahin ein Abo ab, sonst wird es ausgeblendet. Deine Daten bleiben gespeichert – mit einem Abo ist es jederzeit sofort wieder sichtbar.`,
        ], 'Jetzt Abo abschließen'))
        await merken(d.id, { frei_ablauf_mail_am: jetzt.toISOString() })
        ergebnis.abgelaufen++
        continue
      }

      // 3) Schonfrist vorbei und immer noch kein Abo: Profil ausblenden
      if (d.frei_ablauf_mail_am && jetzt.getTime() - new Date(d.frei_ablauf_mail_am).getTime() >= SCHONFRIST_TAGE * TAG_MS) {
        await merken(d.id, { abo_aktiv: false })
        await senden(d, 'Dein Profil auf mi-werk.de ist ausgeblendet', mail(name, [
          'weil noch kein Abo abgeschlossen wurde, ist dein Profil auf <strong>mi-werk.de</strong> jetzt für Kunden ausgeblendet.',
          'Deine Angaben, Fotos und dein Kalender bleiben gespeichert. Sobald du ein Abo abschließt, ist dein Profil sofort wieder sichtbar.',
        ], 'Profil wieder sichtbar machen'))
        ergebnis.ausgeblendet++
      }
    } catch (err: any) {
      console.error(`check-abos: Fehler bei Dienstleister ${d.id}:`, err)
      ergebnis.fehler.push(`${d.id}: ${err?.message || 'unbekannter Fehler'}`)
    }
  }

  // Alle verbundenen Kalender einmal täglich auffrischen
  const kalender = await veralteteAuffrischen().catch(() => [])

  return NextResponse.json({ ...ergebnis, kalenderAktualisiert: kalender.length })
}
