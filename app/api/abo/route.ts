import { NextResponse } from 'next/server'
import { supabase } from '../../Lib/supabase'
import { createAboCheckoutSession } from '../../Lib/stripeCheckout'
import { findKategorie } from '../../Lib/kategorien'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

function windowAround(monthsAgo: number) {
  const center = new Date()
  center.setMonth(center.getMonth() - monthsAgo)
  const start = new Date(center)
  start.setDate(start.getDate() - 1)
  const end = new Date(center)
  end.setDate(end.getDate() + 1)
  return { start, end }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: alleDienstleister, error } = await supabase
    .from('dienstleister')
    .select('id, user_id, name, email, gewerk, erstellt_am, abo_aktiv, stripe_subscription_id')
    .order('id', { ascending: true })

  if (error) {
    console.error('Supabase Fehler:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const ersteFuenfzigIds = new Set((alleDienstleister || []).slice(0, 50).map(d => d.id))

  // Erste 50: 6 Monate gratis. Ab Nr. 51: 1 Monat gratis.
  const sechsMonate = windowAround(6)
  const einMonat = windowAround(1)

  const faellig = (alleDienstleister || []).filter(d => {
    if (!d.abo_aktiv || !d.erstellt_am || !d.user_id || d.stripe_subscription_id) return false
    const erstellt = new Date(d.erstellt_am)
    const fenster = ersteFuenfzigIds.has(d.id) ? sechsMonate : einMonat
    return erstellt >= fenster.start && erstellt <= fenster.end
  })

  let gesendet = 0
  const fehler: string[] = []

  for (const d of faellig) {
    const kategorie = d.gewerk?.toLowerCase()
    const kat = kategorie ? findKategorie(kategorie) : undefined
    if (!kat) {
      fehler.push(`${d.email}: unbekannte Kategorie "${d.gewerk}"`)
      continue
    }

    try {
      const session = await createAboCheckoutSession({
        kategorie,
        typ: 'einfuehrung',
        userId: d.user_id,
        email: d.email,
      })

      await resend.emails.send({
        from: 'mi-werk <noreply@mi-werk.de>',
        to: d.email,
        subject: 'Dein Abo für mi-werk.de ist bereit',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
            <h2 style="color: #b45309;">Hallo ${d.name},</h2>
            <p>deine kostenlose Zeit auf <strong>mi-werk.de</strong> ist jetzt abgelaufen.</p>
            <p>Damit dein Profil weiterhin sichtbar bleibt, schließe jetzt dein Abo ab (Einführungspreis ${kat.einfuehrung}€/Monat für ${kat.label}):</p>
            <a href="${session.url}"
               style="display: inline-block; margin-top: 1.5rem; padding: 12px 28px;
                      background: #b45309; color: white; text-decoration: none;
                      border-radius: 8px; font-weight: bold;">
              Jetzt Abo abschließen
            </a>
            <p style="margin-top: 2rem; font-size: 13px; color: #666;">
              Du erhältst diese Mail, weil du ein Profil auf mi-werk.de erstellt hast.<br>
              <a href="https://mi-werk.de/datenschutz" style="color: #666;">Datenschutz</a>
            </p>
          </div>
        `,
      })
      gesendet++
    } catch (err: any) {
      console.error(`Abo-Angebot-Fehler für ${d.email}:`, err)
      fehler.push(`${d.email}: ${err.message || 'unbekannter Fehler'}`)
    }
  }

  return NextResponse.json({
    message: `${gesendet} Abo-Angebote gesendet`,
    faellig: faellig.length,
    fehler,
  })
}
