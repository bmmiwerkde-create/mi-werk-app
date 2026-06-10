import { NextResponse } from 'next/server'
import { supabase } from '../../Lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient()

  const fiveMonthsAgo = new Date()
  fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5)

  const windowStart = new Date(fiveMonthsAgo)
  windowStart.setDate(windowStart.getDate() - 1)

  const windowEnd = new Date(fiveMonthsAgo)
  windowEnd.setDate(windowEnd.getDate() + 1)

  const { data: dienstleister, error } = await supabase
    .from('dienstleister')
    .select('name, email, erstellt_am')
    .eq('abo_aktiv', true)
    .gte('erstellt_am', windowStart.toISOString())
    .lte('erstellt_am', windowEnd.toISOString())

  if (error) {
    console.error('Supabase Fehler:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!dienstleister || dienstleister.length === 0) {
    return NextResponse.json({ message: 'Keine Empfänger heute', sent: 0 })
  }

  let sent = 0

  for (const d of dienstleister) {
    try {
      await resend.emails.send({
        from: 'mi-werk <noreply@mi-werk.de>',
        to: d.email,
        subject: 'Dein kostenloses Profil läuft bald ab',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
            <h2 style="color: #b45309;">Hallo ${d.name},</h2>
            <p>dein kostenloses Profil auf <strong>mi-werk.de</strong> ist seit 5 Monaten aktiv.</p>
            <p>In 2 Monaten endet die kostenlose Phase. Danach bleibt dein Profil nur sichtbar, wenn du ein Abo abschließt.</p>
            <h3 style="margin-top: 2rem;">Was passiert als nächstes?</h3>
            <ul>
              <li>Monat 7–8: <strong>Einführungspreis</strong></li>
              <li>Ab Monat 9: regulärer Preis</li>
              <li>Ohne Abo: Profil wird ausgeblendet</li>
            </ul>
            <a href="https://mi-werk.de/abo"
               style="display: inline-block; margin-top: 1.5rem; padding: 12px 28px;
                      background: #b45309; color: white; text-decoration: none;
                      border-radius: 8px; font-weight: bold;">
              Jetzt Abo sichern
            </a>
            <p style="margin-top: 2rem; font-size: 13px; color: #666;">
              Du erhältst diese Mail, weil du ein Profil auf mi-werk.de erstellt hast.<br>
              <a href="https://mi-werk.de/datenschutz" style="color: #666;">Datenschutz</a>
            </p>
          </div>
        `,
      })
      sent++
    } catch (err) {
      console.error(`Mail-Fehler für ${d.email}:`, err)
    }
  }

  return NextResponse.json({ message: `${sent} Mails gesendet` })
}