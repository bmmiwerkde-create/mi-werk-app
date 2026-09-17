import { Resend } from 'resend'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const { email, name } = body

  if (!email) {
    return NextResponse.json({ error: 'email fehlt' }, { status: 400 })
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Mi-Werk <noreply@mi-werk.de>',
      to: email,
      subject: 'Willkommen bei mi-werk!',
      html: `
        <h2>Willkommen bei mi-werk, ${name || ''}!</h2>
        <p>Dein Profil ist jetzt live — Kundinnen und Kunden können dich ab sofort finden und kontaktieren.</p>
        <p>Die ersten 6 Monate sind für dich kostenlos.</p>
        <p>Ein Tipp: Verbinde deinen Kalender im <a href="https://mi-werk.de/dashboard">Dashboard</a>, damit Kundinnen und Kunden direkt sehen, wann du Zeit hast.</p>
        <p><a href="https://mi-werk.de/dashboard">Zum Dashboard</a></p>
      `
    })
  } catch (err) {
    console.error('willkommen-dienstleister: Mail-Fehler', err)
  }

  return NextResponse.json({ ok: true })
}
