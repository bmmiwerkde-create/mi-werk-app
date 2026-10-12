'use client'

import { useState } from 'react'
import Kopfzeile from '@/components/Kopfzeile'
import { Icon, IconBadge, iconNameFuerKategorie } from '../components/Icons'

const BELIEBT = ['Friseur', 'Nachhilfe', 'Personal Trainer', 'Webdesign', 'Kosmetik', 'Hundetrainer']

const KATEGORIEN = [
  'Beauty & Pflege', 'Fitness & Sport', 'Bildung & Coaching', 'IT & Digital',
  'Tiere', 'Events & Veranstaltung', 'Familie & Soziales', 'Gesundheit',
]

const VORTEILE: [string, string, string][] = [
  ['calendar', 'Freie Termine auf einen Blick', 'Dienstleister verbinden ihren Kalender. Du siehst, wer wann Zeit hat – bevor du anrufst.'],
  ['phone', 'Direkt in Kontakt', 'Kein Vermittler, keine Provision. Du schreibst oder rufst direkt beim Profi an.'],
  ['pin', 'Aus deiner Region', 'Nur Dienstleister in deiner Nähe – mit Profil, Fotos und Bewertungen.'],
]

const SCHRITTE: [string, string][] = [
  ['Suchen', 'Gib ein, was du brauchst, wo und wann.'],
  ['Freie Zeiten sehen', 'Im Profil siehst du die Woche des Dienstleisters.'],
  ['Direkt melden', 'Per Telefon oder E-Mail – ohne Umweg.'],
]

// Beispielkarte im Kopfbereich: zeigt, wie ein Profil mit Kalender aussieht (keine echte Person)
const BEISPIEL_WOCHE: [string, boolean][] = [['Mo', true], ['Di', false], ['Mi', true], ['Do', true], ['Fr', false]]

export default function LandingPage() {
  const [was, setWas] = useState('')
  const [wo, setWo] = useState('')
  const [wann, setWann] = useState('')
  const [warteliste, setWarteliste] = useState({ was: '', wo: '', email: '' })
  const [gemeldet, setGemeldet] = useState(false)

  function suchen(e: React.FormEvent) {
    e.preventDefault()
    const p = new URLSearchParams()
    if (was.trim()) p.set('was', was.trim())
    if (wo.trim()) p.set('ort', wo.trim())
    if (wann) p.set('datum', wann)
    window.location.href = '/suche' + (p.toString() ? '?' + p.toString() : '')
  }

  function aufWarteliste(e: React.FormEvent) {
    e.preventDefault()
    // Entwurf: Speichern folgt, sobald die Tabelle für die Warteliste angelegt ist
    setGemeldet(true)
  }

  return (
    <>
      <Kopfzeile />
      <main>
        {/* Kopfbereich mit Suche */}
        <section className="mw-start-kopf">
          <div className="mw-wrap mw-start-raster">
            <div>
              <div className="mw-kicker">Neu · gestartet in Bochum</div>
              <h1 className="mw-h1 mw-start-titel">Finde Dienstleister in deiner Nähe – und sieh sofort, <span>wer Zeit hat.</span></h1>
              <form className="mw-start-suche" onSubmit={suchen}>
                <label className="mw-start-feld">
                  <Icon name="search" size={18} />
                  <input value={was} onChange={e => setWas(e.target.value)} placeholder="Was suchst du?" aria-label="Was suchst du?" />
                </label>
                <label className="mw-start-feld">
                  <Icon name="pin" size={18} />
                  <input value={wo} onChange={e => setWo(e.target.value)} placeholder="Ort oder PLZ" aria-label="Wo?" />
                </label>
                <label className="mw-start-feld">
                  <Icon name="calendar" size={18} />
                  <input type="date" value={wann} onChange={e => setWann(e.target.value)} aria-label="Wann?" className={wann ? '' : 'leer'} />
                </label>
                <button className="mw-btn" type="submit"><Icon name="search" size={18} />Suchen</button>
              </form>
              <div className="mw-start-beliebt">
                <span className="mw-muted">Beliebt:</span>
                {BELIEBT.map(b => <a key={b} className="mw-chip" href={'/suche?was=' + encodeURIComponent(b)}>{b}</a>)}
              </div>
            </div>

            <div className="mw-karte mw-start-beispiel" aria-hidden="true">
              <div className="mw-start-beispiel-kopf">
                <div className="mw-start-avatar"><Icon name="beauty" size={24} /></div>
                <div>
                  <b>Studio Lena</b>
                  <div className="mw-muted">Kosmetik · Bochum</div>
                </div>
              </div>
              <div className="mw-sterne">★★★★★ <span className="mw-muted">4,9</span></div>
              <div className="mw-start-woche">
                {BEISPIEL_WOCHE.map(([tag, frei]) => (
                  <div key={tag}>
                    <small>{tag}</small>
                    <span className={'mw-badge ' + (frei ? 'mw-frei' : 'mw-belegt')}>{frei ? 'frei' : 'belegt'}</span>
                  </div>
                ))}
              </div>
              <div className="mw-start-beispiel-fuss"><Icon name="clock" size={14} /> Kalender live verbunden</div>
              <span className="mw-start-beispiel-label">Beispiel</span>
            </div>
          </div>
        </section>

        {/* Vorteile */}
        <section className="mw-abschnitt">
          <div className="mw-wrap mw-start-drei">
            {VORTEILE.map(([icon, titel, text]) => (
              <div key={titel}>
                <IconBadge name={icon} size={48} />
                <h3 className="mw-h3" style={{ margin: '14px 0 6px' }}>{titel}</h3>
                <p className="mw-muted" style={{ margin: 0, lineHeight: 1.55 }}>{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Kategorien */}
        <section className="mw-abschnitt hell">
          <div className="mw-wrap">
            <h2 className="mw-h2" style={{ marginBottom: 20 }}>Was suchst du?</h2>
            <div className="mw-kat-grid">
              {KATEGORIEN.map(k => (
                <a key={k} className="mw-kat" href={'/suche?kat=' + encodeURIComponent(k)} style={{ textDecoration: 'none' }}>
                  <IconBadge name={iconNameFuerKategorie(k)} size={40} />
                  <b>{k}</b>
                </a>
              ))}
            </div>
            <a className="mw-link" href="/suche" style={{ display: 'inline-block', marginTop: 16 }}>Alle Bereiche ansehen →</a>
          </div>
        </section>

        {/* So funktioniert's */}
        <section className="mw-abschnitt">
          <div className="mw-wrap">
            <h2 className="mw-h2" style={{ marginBottom: 24 }}>So funktioniert&apos;s</h2>
            <div className="mw-start-drei">
              {SCHRITTE.map(([titel, text], i) => (
                <div key={titel} className="mw-start-schritt">
                  <span>{i + 1}</span>
                  <div>
                    <b>{titel}</b>
                    <p className="mw-muted" style={{ margin: '4px 0 0' }}>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gründer */}
        <section className="mw-abschnitt hell">
          <div className="mw-wrap mw-start-gruender">
            <div className="mw-start-foto" aria-label="Foto von Ben">B</div>
            <div>
              <div className="mw-kicker">Wer steckt dahinter?</div>
              <h2 className="mw-h2" style={{ marginBottom: 12 }}>Hi, ich bin Ben – 22, aus Bochum.</h2>
              <p style={{ margin: 0, lineHeight: 1.65, maxWidth: 620 }}>
                Ich habe Mi-Werk gebaut, weil es mich genervt hat, ewig herumzutelefonieren – nur um zu hören,
                dass keiner Zeit hat. Hier siehst du das vorher. Mi-Werk ist neu und wächst gerade Profi für Profi.
              </p>
            </div>
          </div>
        </section>

        {/* Warteliste */}
        <section className="mw-abschnitt">
          <div className="mw-wrap">
            <div className="mw-karte mw-start-warteliste">
              <div>
                <h2 className="mw-h2" style={{ marginBottom: 8 }}>Noch nicht dabei, wen du suchst?</h2>
                <p className="mw-muted" style={{ margin: 0 }}>Sag uns, wen du brauchst – wir suchen gezielt nach Profis in deiner Nähe und melden uns.</p>
              </div>
              {gemeldet ? (
                <div className="mw-hinweis"><Icon name="check" size={18} />Danke! Wir melden uns, sobald wir jemanden gefunden haben.</div>
              ) : (
                <form className="mw-start-warteliste-form" onSubmit={aufWarteliste}>
                  <input className="mw-feld" required placeholder="z. B. Fotograf" value={warteliste.was} onChange={e => setWarteliste({ ...warteliste, was: e.target.value })} aria-label="Wen suchst du?" />
                  <input className="mw-feld" required placeholder="Stadt oder PLZ" value={warteliste.wo} onChange={e => setWarteliste({ ...warteliste, wo: e.target.value })} aria-label="Wo?" />
                  <input className="mw-feld" required type="email" placeholder="Deine E-Mail" value={warteliste.email} onChange={e => setWarteliste({ ...warteliste, email: e.target.value })} aria-label="E-Mail" />
                  <button className="mw-btn" type="submit">Eintragen</button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Für Dienstleister */}
        <section className="mw-start-band">
          <div className="mw-wrap mw-start-band-innen">
            <div>
              <h2 className="mw-h2" style={{ color: '#fff', marginBottom: 6 }}>Du bist selbstständig?</h2>
              <p style={{ margin: 0, opacity: .85 }}>Zeig Kunden, wann du Zeit hast. Die ersten 50 Dienstleister sind 12 Monate kostenlos dabei.</p>
            </div>
            <a className="mw-btn" href="/fuer-dienstleister">Jetzt eintragen <Icon name="arrow" size={18} /></a>
          </div>
        </section>
      </main>
    </>
  )
}
