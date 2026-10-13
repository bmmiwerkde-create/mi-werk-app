'use client'
// Dashboard: Arbeitstage und -zeiten. Vorausgefüllt mit Mo–Fr 8–18 Uhr; daraus berechnet
// das Profil, ob ein Tag frei, teilweise frei, belegt oder geschlossen ist.

import { useState } from 'react'
import { supabase } from '../Lib/supabase'
import { arbeitszeitenVon, arbeitszeitenText, WOCHENTAGE } from '../Lib/verfuegbarkeit'
import UhrzeitFeld from './UhrzeitFeld'

export default function ArbeitszeitenKarte({ profilId, gespeichert, nachSpeichern }: {
  profilId: number
  gespeichert: unknown
  nachSpeichern: () => void
}) {
  const start = arbeitszeitenVon(gespeichert)
  const [tage, setTage] = useState<number[]>(start.tage)
  const [von, setVon] = useState(start.von)
  const [bis, setBis] = useState(start.bis)
  const [meldung, setMeldung] = useState('')
  const [speichern, setSpeichern] = useState(false)

  function umschalten(tag: number) {
    setTage(tage.includes(tag) ? tage.filter(t => t !== tag) : [...tage, tag].sort((a, b) => a - b))
    setMeldung('')
  }

  async function sichern() {
    if (!von || !bis) { setMeldung('Fehler: Bitte Beginn und Ende als Uhrzeit eintragen, z. B. 08:00.'); return }
    if (bis <= von) { setMeldung('Fehler: Das Ende muss nach dem Beginn liegen.'); return }
    if (tage.length === 0) { setMeldung('Fehler: Bitte mindestens einen Arbeitstag auswählen.'); return }
    setSpeichern(true)
    const { error } = await supabase.from('dienstleister').update({ arbeitszeiten: { tage, von, bis } }).eq('id', profilId)
    setSpeichern(false)
    if (error) { setMeldung('Fehler: ' + error.message); return }
    setMeldung('Gespeichert: ' + arbeitszeitenText({ tage, von, bis }))
    nachSpeichern()
  }

  return (
    <div className="mw-karte mw-block">
      <h2 className="mw-h3" style={{ marginBottom: 4 }}>Meine Arbeitszeiten</h2>
      <p className="mw-muted" style={{ margin: '0 0 14px', fontSize: 15 }}>
        Daraus berechnet Mi-Werk, an welchen Tagen und zu welchen Zeiten du für Kunden frei bist.
      </p>
      <label className="mw-label">Arbeitstage</label>
      <div className="mw-tage-wahl">
        {WOCHENTAGE.map((name, i) => (
          <button key={name} type="button" className={tage.includes(i + 1) ? 'an' : ''} onClick={() => umschalten(i + 1)} aria-pressed={tage.includes(i + 1)}>
            {name}
          </button>
        ))}
      </div>
      <div className="mw-zwei-spalten" style={{ marginTop: 14 }}>
        <div>
          <label className="mw-label" htmlFor="az-von">Beginn</label>
          <UhrzeitFeld id="az-von" value={von} onChange={v => { setVon(v); setMeldung('') }} />
        </div>
        <div>
          <label className="mw-label" htmlFor="az-bis">Ende</label>
          <UhrzeitFeld id="az-bis" value={bis} onChange={v => { setBis(v); setMeldung('') }} />
        </div>
      </div>
      <button className="mw-btn" style={{ marginTop: 16 }} onClick={sichern} disabled={speichern}>{speichern ? 'Speichere…' : 'Arbeitszeiten speichern'}</button>
      {meldung && <div className={'mw-meldung ' + (meldung.startsWith('Fehler') ? 'fehler' : 'ok')}>{meldung}</div>}
    </div>
  )
}
