import type { Metadata } from 'next'
import Kopfzeile from '@/components/Kopfzeile'
import { IconBadge } from '../components/Icons'

export const metadata: Metadata = {
  title: 'Für Dienstleister – Mi-Werk',
  description: 'Profil anlegen, Kalender verbinden und von Kunden in deiner Region gefunden werden. Für die ersten 50 Dienstleister 12 Monate kostenlos.',
  alternates: { canonical: 'https://www.mi-werk.de/fuer-dienstleister' },
}

const INHALT = [
  ['user', 'Profilbild und Logo', 'Damit Kunden dich wiedererkennen.'],
  ['eye', 'Bis zu 6 Fotos', 'Zeig deine Arbeit, deine Räume oder dein Team.'],
  ['calendar', 'Verfügbarkeitskalender', 'Google, Outlook oder iPhone. Kunden sehen nur frei oder belegt.'],
  ['star', 'Bewertungen', 'Sterne und Kommentare deiner Kunden.'],
]

export default function FuerDienstleister() {
  return (
    <div>
      <Kopfzeile aktiv="fd" />

      <section className="mw-abschnitt">
        <div className="mw-wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, alignItems: 'center' }}>
          <div>
            <div className="mw-kicker">Für Dienstleister</div>
            <h1 className="mw-h1">Werde gefunden, wenn Kunden dich brauchen.</h1>
            <p className="mw-muted" style={{ fontSize: 18, margin: '16px 0 26px' }}>
              Kunden sehen auf deinem Profil, wann du Zeit hast, und melden sich direkt bei dir, ohne Vermittler.
            </p>
            <a className="mw-btn" href="/login">Jetzt kostenlos eintragen</a>
            <p className="mw-muted" style={{ fontSize: 14, marginTop: 12 }}>
              Für die ersten 50 Dienstleister 12 Monate kostenlos. Schon registriert? <a className="mw-link" href="/login?modus=login">Anmelden</a>
            </p>
          </div>
          <div className="mw-karte" style={{ padding: 24 }}>
            <b style={{ color: 'var(--mw-ink)' }}>Dein Profil enthält</b>
            <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>
              {INHALT.map(([icon, titel, text]) => (
                <div key={titel} style={{ display: 'flex', gap: 12 }}>
                  <IconBadge name={icon} size={44} />
                  <div><b>{titel}</b><div className="mw-muted" style={{ fontSize: 14 }}>{text}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mw-abschnitt hell">
        <div className="mw-wrap">
          <div className="mw-kicker">So geht's</div>
          <h2 className="mw-h2">In wenigen Minuten startklar</h2>
          <div className="mw-schritte">
            {[
              ['Konto erstellen', 'Mit E-Mail und Passwort registrieren.'],
              ['Profil anlegen', 'Name, Bereich und Ort angeben, danach Logo und Fotos hochladen.'],
              ['Kalender verbinden', 'Google, Outlook oder iPhone. Übertragen wird nur frei oder belegt.'],
            ].map(([titel, text], i) => (
              <div key={titel} className="mw-karte" style={{ padding: 24 }}>
                <div className="mw-serif" style={{ fontSize: 15, fontWeight: 700, color: 'var(--mw-cta)', marginBottom: 8 }}>Schritt {i + 1}</div>
                <h3 className="mw-h3" style={{ marginBottom: 6 }}>{titel}</h3>
                <p className="mw-muted" style={{ margin: 0 }}>{text}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <a className="mw-btn" href="/login">Jetzt kostenlos eintragen</a>
          </div>
        </div>
      </section>

    </div>
  )
}
