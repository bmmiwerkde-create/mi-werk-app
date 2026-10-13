'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../Lib/supabase'
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

const VERTRAUEN: [string, string][] = [
  ['shield', 'Unternehmen aus Bochum'],
  ['check', 'Keine Provision, kein Vermittler'],
  ['lock', 'Für Suchende kostenlos'],
]

type Profi = { id: number; name: string; gewerk: string | null; ort: string | null; logo: string | null; profilbild: string | null }

export default function LandingPage() {
  const [was, setWas] = useState('')
  const [wo, setWo] = useState('')
  const [plz, setPlz] = useState('')
  const [wann, setWann] = useState('')
  const [zeit, setZeit] = useState('')
  const [preis, setPreis] = useState('')
  const [warteliste, setWarteliste] = useState({ was: '', wo: '', email: '' })
  const [gemeldet, setGemeldet] = useState(false)
  const [profis, setProfis] = useState<Profi[]>([])

  // Echte Dienstleister zeigen statt erfundener Beispiele
  useEffect(() => {
    supabase.from('dienstleister').select('id, name, gewerk, ort, logo, profilbild')
      .eq('abo_aktiv', true).order('id', { ascending: false }).limit(3)
      .then(({ data }) => { if (data) setProfis(data as Profi[]) })
  }, [])

  function suchen(e: React.FormEvent) {
    e.preventDefault()
    const p = new URLSearchParams()
    if (was.trim()) p.set('was', was.trim())
    if (wo.trim()) p.set('ort', wo.trim())
    if (plz) p.set('plz', plz)
    if (wann) p.set('datum', wann)
    if (zeit) p.set('zeit', zeit)
    if (preis) p.set('preis', preis)
    window.location.href = '/suche' + (p.toString() ? '?' + p.toString() : '')
  }

  function aufWarteliste(e: React.FormEvent) {
    e.preventDefault()
    // Entwurf: Speichern folgt, sobald die Tabelle für die Warteliste angelegt ist
    setGemeldet(true)
  }

  // Neu auf Mi-Werk: am Computer neben der Überschrift, auf dem Handy unter der Suche
  const profiKarte = (zusatz: string) => profis.length > 0 && (
    <div className={"mw-karte mw-start-profis " + zusatz}>
      <div className="mw-kicker" style={{ marginBottom: 12 }}>Neu auf Mi-Werk</div>
      {profis.map(p => (
        <a key={p.id} className="mw-start-profi" href={'/profil/' + p.id}>
          {p.logo || p.profilbild
            ? <img src={(p.logo || p.profilbild) as string} alt="" />
            : <span className="mw-start-avatar"><Icon name="user" size={22} /></span>}
          <div>
            <b>{p.name}</b>
            <div className="mw-muted">{[p.gewerk, p.ort].filter(Boolean).join(' · ')}</div>
          </div>
          <Icon name="arrow" size={18} />
        </a>
      ))}
      <a className="mw-link" href="/suche" style={{ display: 'inline-block', marginTop: 10, fontSize: 14 }}>Alle Dienstleister ansehen →</a>
    </div>
  )

  return (
    <>
      <Kopfzeile />
      <main>
        {/* Kopfbereich mit Suche */}
        <section className="mw-start-kopf">
          <div className="mw-wrap mw-start-raster">
            <div>
              <div className="mw-start-wahl" role="group" aria-label="Was möchtest du tun?">
                <a className="an" href="#suche">Ich suche einen Dienstleister</a>
                <a href="/fuer-dienstleister">Ich bin Dienstleister</a>
              </div>
              <div className="mw-kicker">Neu · gestartet in Bochum</div>
              <h1 className="mw-h1 mw-start-titel">Finde Dienstleister in deiner Nähe – und sieh sofort, <span>wer Zeit hat.</span></h1>
            </div>

            {profiKarte('mw-nur-gross')}
          </div>
          <div className="mw-wrap">
          {/* Gleiche Filter wie auf der Suchseite */}
          <form id="suche" className="mw-karte mw-start-filter" onSubmit={suchen}>
            <div className="mw-filter" style={{ marginTop: 0 }}>
              <div className="breit">
                <label className="mw-label" htmlFor="s-was">Was suchst du?</label>
                <input id="s-was" className="mw-feld" value={was} onChange={e => setWas(e.target.value)} placeholder="Name, Gewerk oder Ort" />
              </div>
              <div>
                <label className="mw-label" htmlFor="s-stadt">Stadt</label>
                <input id="s-stadt" className="mw-feld" value={wo} onChange={e => setWo(e.target.value)} placeholder="z. B. Bochum" />
              </div>
              <div>
                <label className="mw-label" htmlFor="s-plz">PLZ</label>
                <input id="s-plz" className="mw-feld" value={plz} onChange={e => setPlz(e.target.value.replace(/\D/g, '').slice(0, 5))} placeholder="z. B. 44787" inputMode="numeric" maxLength={5} />
              </div>
              <div>
                <label className="mw-label" htmlFor="s-datum">Datum</label>
                <input id="s-datum" className={'mw-feld' + (wann ? '' : ' leer')} type="date" value={wann} onChange={e => setWann(e.target.value)} />
              </div>
              <div>
                <label className="mw-label" htmlFor="s-zeit">Uhrzeit</label>
                <input id="s-zeit" className={'mw-feld' + (zeit ? '' : ' leer')} type="time" value={zeit} onChange={e => setZeit(e.target.value)} />
              </div>
              <div>
                <label className="mw-label" htmlFor="s-preis">Max. Preis (€/Std.)</label>
                <input id="s-preis" className="mw-feld" value={preis} onChange={e => setPreis(e.target.value.replace(/[^0-9]/g, ''))} placeholder="z. B. 80" inputMode="numeric" />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button className="mw-btn voll" type="submit"><Icon name="search" size={18} />Suchen</button>
              </div>
            </div>
          </form>
          <div className="mw-start-beliebt">
            <span className="mw-muted">Beliebt:</span>
            {BELIEBT.map(b => <a key={b} className="mw-chip" href={'/suche?was=' + encodeURIComponent(b)}>{b}</a>)}
          </div>
          {profiKarte('mw-nur-klein')}
          </div>
        </section>

        {/* Vertrauen */}
        <div className="mw-start-vertrauen">
          <div className="mw-wrap">
            {VERTRAUEN.map(([icon, text]) => <span key={text}><Icon name={icon} size={18} />{text}</span>)}
          </div>
        </div>

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
            <div>
              <div className="mw-kicker">Wer steckt dahinter?</div>
              <h2 className="mw-h2" style={{ marginBottom: 12 }}>Hi, ich bin Ben – 22, aus Bochum.</h2>
              <p style={{ margin: 0, lineHeight: 1.65, maxWidth: 620 }}>
                Hinter Mi-Werk steht keine anonyme Plattform, sondern ein junges Unternehmen aus Bochum:
                die Mi-Werk UG (haftungsbeschränkt). Mi-Werk ist neu und wächst gerade Profi für Profi –
                wenn du Fragen hast, schreib mir einfach.
              </p>
              <a className="mw-link" href="/kontakt" style={{ display: 'inline-block', marginTop: 12 }}>Kontakt aufnehmen →</a>
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
