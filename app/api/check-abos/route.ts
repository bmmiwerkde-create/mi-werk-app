import { NextResponse } from 'next/server'
import { supabase } from '../../Lib/supabase'
import { Resend } from 'resend'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let sent = 0

  // ===== ERSTE 50 DIENSTLEISTER: 5-MONATS-ERINNERUNG (6 Monate gratis) =====
  const fiveMonthsAgo = new Date()
  fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5)

  const fiveWindowStart = new Date(fiveMonthsAgo)
  fiveWindowStart.setDate(fiveWindowStart.getDate() - 1)

  const fiveWindowEnd = new Date(fiveMonthsAgo)
  fiveWindowEnd.setDate(fiveWindowEnd.getDate() + 1)

  // Alle Dienstleister holen, nach id sortiert, um die ersten 50 zu bestimmen
  const { data: alleDienstleister, error: alleError } = await supabase
    .from('dienstleister')
    .select('id, name, email, erstellt_am, abo_aktiv')
    .order('id', { ascending: true })

  if (alleError) {
    console.error('Supabase Fehler:', alleError)
    return NextResponse.json({ error: alleError.message }, { status: 500 })
  }

  const ersteFuenfzigIds = new Set((alleDienstleister || []).slice(0, 50).map(d => d.id))

  // Erste 50: 5-Monats-Erinnerung (6 Monate gratis -> Erinnerung nach 5 Monaten)
  const fuenfMonateEmpfaenger = (alleDienstleister || []).filter(d =>
    ersteFuenfzigIds.has(d.id) &&
    d.abo_aktiv &&
    d.erstellt_am &&
    new Date(d.erstellt_am) >= fiveWindowStart &&
    new Date(d.erstellt_am) <= fiveWindowEnd
  )

  for (const d of fuenfMonateEmpfaenger) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'mi-werk <noreply@mi-werk.de>',
        to: d.email,
        subject: 'Dein kostenloses Profil läuft bald ab',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
            <h2 style="color: #b45309;">Hallo ${d.name},</h2>
            <p>dein kostenloses Profil auf <strong>mi-werk.de</strong> ist seit 5 Monaten aktiv.</p>
            <p>In 1 Monat endet die kostenlose Phase. Danach bleibt dein Profil nur sichtbar, wenn du ein Abo abschließt.</p>
            <h3 style="margin-top: 2rem;">Was passiert als nächstes?</h3>
            <ul>
              <li>Ab Monat 7: regulärer Preis</li>
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

  // ===== AB DIENSTLEISTER 51: 1-MONATS-ERINNERUNG (1 Monat gratis) =====
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

  const oneWindowStart = new Date(oneMonthAgo)
  oneWindowStart.setDate(oneWindowStart.getDate() - 1)

  const oneWindowEnd = new Date(oneMonthAgo)
  oneWindowEnd.setDate(oneWindowEnd.getDate() + 1)

  const einMonatEmpfaenger = (alleDienstleister || []).filter(d =>
    !ersteFuenfzigIds.has(d.id) &&
    d.abo_aktiv &&
    d.erstellt_am &&
    new Date(d.erstellt_am) >= oneWindowStart &&
    new Date(d.erstellt_am) <= oneWindowEnd
  )

  for (const d of einMonatEmpfaenger) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'mi-werk <noreply@mi-werk.de>',
        to: d.email,
        subject: 'Dein kostenloser Monat auf mi-werk.de läuft bald ab',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
            <h2 style="color: #b45309;">Hallo ${d.name},</h2>
            <p>dein kostenloses Profil auf <strong>mi-werk.de</strong> ist seit 1 Monat aktiv.</p>
            <p>Damit dein Profil weiterhin sichtbar bleibt, schließe jetzt ein Abo ab.</p>
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

  return NextResponse.json({
    message: `${sent} Mails gesendet`,
    fuenfMonate: fuenfMonateEmpfaenger.length,
    einMonat: einMonatEmpfaenger.length,
  })
}