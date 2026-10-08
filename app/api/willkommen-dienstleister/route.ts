import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { nutzerAusAnfrage } from '../../Lib/supabaseAdmin'

const esc = (v: unknown) => String(v ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string))

// Farben wie auf der Webseite
const INK = '#14324A'
const KUPFER = '#A9552A'
const HELL = '#FBF8F3'
const TEXT = '#33414D'
const GRAU = '#5B6670'

function schritt(nr: number, titel: string, text: string) {
  return `
    <tr><td style="padding:0 0 14px">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%"><tr>
        <td width="40" valign="top"><div style="width:30px;height:30px;border-radius:15px;background:${KUPFER};color:#fff;font:bold 15px/30px Arial,sans-serif;text-align:center">${nr}</div></td>
        <td valign="top" style="font:15px/1.5 Arial,sans-serif;color:${TEXT}"><b style="color:${INK}">${titel}</b><br>${text}</td>
      </tr></table>
    </td></tr>`
}

function mailHtml(name: string) {
  const hallo = name ? `Willkommen bei Mi-Werk, ${esc(name)}!` : 'Willkommen bei Mi-Werk!'
  return `<!doctype html>
<html lang="de"><body style="margin:0;padding:0;background:${HELL}">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${HELL};padding:24px 12px">
<tr><td align="center">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;background:#ffffff;border:1px solid #E7E0D5;border-radius:16px;overflow:hidden">
    <tr><td style="background:${INK};padding:22px 28px">
      <span style="font:bold 26px Georgia,serif;color:#ffffff">Mi-<span style="color:#E7B48C">Werk</span></span>
      <div style="font:13px Arial,sans-serif;color:#C9D6E2;margin-top:4px">Dienstleister in deiner Region</div>
    </td></tr>
    <tr><td style="padding:28px 28px 8px">
      <h1 style="margin:0 0 12px;font:bold 24px/1.25 Georgia,serif;color:${INK}">${hallo}</h1>
      <p style="margin:0 0 14px;font:15px/1.6 Arial,sans-serif;color:${TEXT}">Schön, dass du dabei bist. Dein Profil ist angelegt. Kundinnen und Kunden in deiner Region können dich jetzt finden und direkt kontaktieren, ganz ohne Vermittler.</p>
      <div style="background:#F6EDE4;border-radius:12px;padding:14px 16px;margin:0 0 22px;font:15px/1.5 Arial,sans-serif;color:${INK}">
        <b>Die ersten 12 Monate sind für dich kostenlos.</b>
      </div>
      <p style="margin:0 0 12px;font:bold 16px Arial,sans-serif;color:${INK}">So holst du das Beste aus deinem Profil:</p>
    </td></tr>
    <tr><td style="padding:0 28px">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        ${schritt(1, 'Kalender verbinden', 'Google, Outlook oder iPhone. Kunden sehen dann sofort, wann du Zeit hast, und zwar nur „frei“ oder „belegt“, nie Details.')}
        ${schritt(2, 'Logo und Fotos hochladen', 'Bis zu 6 Fotos von deiner Arbeit machen dein Profil persönlich und vertrauenswürdig.')}
        ${schritt(3, 'Profil vervollständigen', 'Beschreibung, Preis und Kontaktdaten helfen Kunden bei der Entscheidung.')}
      </table>
    </td></tr>
    <tr><td align="center" style="padding:10px 28px 30px">
      <a href="https://www.mi-werk.de/dashboard" style="display:inline-block;background:${KUPFER};color:#ffffff;text-decoration:none;font:bold 16px Arial,sans-serif;padding:14px 28px;border-radius:10px">Zum Dashboard</a>
    </td></tr>
    <tr><td style="padding:18px 28px;border-top:1px solid #E7E0D5;font:13px/1.6 Arial,sans-serif;color:${GRAU}">
      Fragen? Antworte einfach an <a href="mailto:bm.miwerk.de@gmail.com" style="color:${KUPFER}">bm.miwerk.de@gmail.com</a>.<br>
      Mi-Werk UG (haftungsbeschränkt) · Forstring 24 · 44869 Bochum ·
      <a href="https://www.mi-werk.de/impressum" style="color:${GRAU}">Impressum</a> ·
      <a href="https://www.mi-werk.de/datenschutz" style="color:${GRAU}">Datenschutz</a>
    </td></tr>
  </table>
</td></tr>
</table>
</body></html>`
}

export async function POST(req: Request) {
  // Nur an das eigene, angemeldete Konto senden (sonst könnte man beliebige Adressen anschreiben lassen)
  const user = await nutzerAusAnfrage(req)
  if (!user?.email) {
    return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })
  }
  const body = await req.json().catch(() => ({}))
  const name = String(body?.name || '').slice(0, 80)

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Mi-Werk <noreply@mi-werk.de>',
      replyTo: 'bm.miwerk.de@gmail.com',
      to: user.email,
      subject: 'Willkommen bei Mi-Werk – so startest du',
      html: mailHtml(name),
    })
  } catch (err) {
    console.error('willkommen-dienstleister: Mail-Fehler', err)
  }

  return NextResponse.json({ ok: true })
}
