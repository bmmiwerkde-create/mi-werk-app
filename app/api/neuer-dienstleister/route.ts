import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const body = await req.json()
  const record = body.record

  await resend.emails.send({
    from: 'Mi-Werk <onboarding@resend.dev>',
    to: 'middeldorfben@gmail.com',
    subject: 'Neuer Dienstleister registriert: ' + (record.name || 'Unbekannt'),
    html: `
      <h2>Neuer Dienstleister auf mi-werk.de</h2>
      <p><strong>Name:</strong> ${record.name || '-'}</p>
      <p><strong>Gewerk:</strong> ${record.gewerk || '-'}</p>
      <p><strong>Ort:</strong> ${record.ort || '-'}</p>
      <p><strong>Beschreibung:</strong> ${record.beschreibung || '-'}</p>
      <p><a href="https://mi-werk.de/profil/${record.id}">Profil ansehen</a></p>
    `
  })

  return NextResponse.json({ ok: true })
}
