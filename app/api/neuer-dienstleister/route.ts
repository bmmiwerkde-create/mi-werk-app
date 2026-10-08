import { Resend } from 'resend'
import { NextResponse } from 'next/server'

// Eingaben aus dem Formular sicher in die HTML-Mail einsetzen
const esc = (v: unknown) => String(v ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string))

export async function POST(req: Request) {
  const body = await req.json()
  const record = body.record

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Mi-Werk <noreply@mi-werk.de>',
      to: 'bm.miwerk.de@gmail.com',
      subject: 'Neuer Dienstleister registriert: ' + String(record.name || 'Unbekannt').slice(0, 80),
      html: `
        <h2>Neuer Dienstleister auf mi-werk.de</h2>
        <p><strong>Name:</strong> ${esc(record.name) || '-'}</p>
        <p><strong>Gewerk:</strong> ${esc(record.gewerk) || '-'}</p>
        <p><strong>Ort:</strong> ${esc([record.postleitzahl, record.ort].filter(Boolean).join(' ')) || '-'}</p>
        <p><strong>E-Mail:</strong> ${record.email ? `<a href="mailto:${esc(record.email)}">${esc(record.email)}</a>` : '-'}</p>
        <p><strong>Telefon:</strong> ${record.telefon ? `<a href="tel:${esc(String(record.telefon).replace(/[^0-9+]/g, ''))}">${esc(record.telefon)}</a>` : '-'}</p>
        <p><strong>Beschreibung:</strong> ${esc(record.beschreibung) || '-'}</p>
        <p><a href="https://www.mi-werk.de/profil/${Number(record.id) || ''}">Profil ansehen</a></p>
      `
    })
  } catch (err) {
    console.error('neuer-dienstleister: Mail-Fehler', err)
  }

  return NextResponse.json({ ok: true })
}
