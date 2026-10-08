'use client'
// Gemeinsame Menüleiste für alle Seiten außer der Startseite.

import { useEffect, useState } from 'react'
import { supabase } from '@/app/Lib/supabase'
import { Icon } from '@/app/components/Icons'

type Aktiv = 'suche' | 'so' | 'fd' | 'login' | 'dashboard'

export default function Kopfzeile({ aktiv }: { aktiv?: Aktiv }) {
  const [menuOffen, setMenuOffen] = useState(false)
  const [angemeldet, setAngemeldet] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setAngemeldet(!!session))
  }, [])

  const links: [string, string, Aktiv][] = [
    ['/suche', 'Dienstleister finden', 'suche'],
    ['/suche#so-gehts', "So funktioniert's", 'so'],
    ['/fuer-dienstleister', 'Für Dienstleister', 'fd'],
  ]

  return (
    <header className="mw-nav">
      <div className="mw-wrap mw-nav-innen">
        <a className="mw-logo" href="/">Mi-<span>Werk</span></a>
        <nav className="mw-nav-links" aria-label="Hauptmenü">
          {links.map(([href, text, key]) => (
            <a key={href} href={href} className={aktiv === key ? 'aktiv' : ''}>{text}</a>
          ))}
          {angemeldet ? (
            <a className="mw-btn klein" href="/dashboard">Mein Profil</a>
          ) : (
            <>
              <a href="/login?modus=login" className={aktiv === 'login' ? 'aktiv' : ''}>Anmelden</a>
              <a className="mw-btn klein" href="/login">Kostenlos eintragen</a>
            </>
          )}
        </nav>
        <button className="mw-menu-btn" aria-expanded={menuOffen} aria-controls="mw-menu" onClick={() => setMenuOffen(o => !o)}>
          <Icon name="list" size={18} />Menü
        </button>
      </div>
      <div id="mw-menu" className={'mw-menu-panel' + (menuOffen ? ' an' : '')}>
        {links.map(([href, text]) => <a key={href} href={href} onClick={() => setMenuOffen(false)}>{text}</a>)}
        {angemeldet ? (
          <a className="mw-btn" href="/dashboard">Mein Profil</a>
        ) : (
          <>
            <a href="/login?modus=login">Anmelden</a>
            <a className="mw-btn" href="/login">Kostenlos eintragen</a>
          </>
        )}
      </div>
    </header>
  )
}
