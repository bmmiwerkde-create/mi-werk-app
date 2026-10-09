'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { supabase } from '../Lib/supabase'
import { useRouter } from 'next/navigation'
import { Icon, IconBadge, iconNameFuerKategorie } from '../components/Icons'
import Kopfzeile from '@/components/Kopfzeile'
import { PROFIL_FELDER } from '@/app/Lib/profilFelder'

const DienstleisterKarte = dynamic(() => import('../components/DienstleisterKarte'), { ssr: false })

const hauptkategorien = [
  {
    name: 'Beauty & Pflege',
    gewerke: [
      { name: 'Fußpflege' },
      { name: 'Friseur' },
      { name: 'Kosmetik' },
      { name: 'Massage' },
      { name: 'Nagelpflege' },
      { name: 'Permanent Make-up' },
      { name: 'Wimpern' },
    ]
  },
  {
    name: 'Bildung & Coaching',
    gewerke: [
      { name: 'Bewerbungscoaching' },
      { name: 'Life Coach' },
      { name: 'Musikunterricht' },
      { name: 'Nachhilfe' },
      { name: 'Sprachkurs' },
    ]
  },
  {
    name: 'Catering & Essen',
    gewerke: [
      { name: 'Catering' },
      { name: 'Foodtruck' },
      { name: 'Getränkeservice' },
      { name: 'Grillservice' },
      { name: 'Kochservice' },
      { name: 'Meal Prep' },
      { name: 'Partyservice' },
    ]
  },
  {
    name: 'Fitness & Sport',
    gewerke: [
      { name: 'Ernährungsberatung' },
      { name: 'Kampfsport' },
      { name: 'Personal Trainer' },
      { name: 'Physiotherapie' },
      { name: 'Pilates' },
      { name: 'Schwimmtrainer' },
      { name: 'Yoga' },
    ]
  },
  {
    name: 'Garten & Außen',
    gewerke: [
      { name: 'Baumfällung' },
      { name: 'Gartenbau' },
      { name: 'Rasenpflege' },
      { name: 'Landschaftspflege' },
      { name: 'Pflasterer' },
      { name: 'Teichbau' },
      { name: 'Zaunbau' },
    ]
  },
  {
    name: 'Haus & Handwerk',
    gewerke: [
      { name: 'Elektriker' },
      { name: 'Fensterbau' },
      { name: 'Klempner' },
      { name: 'Maler' },
      { name: 'Schreiner' },
      { name: 'Reinigung' },
      { name: 'Renovierung' },
    ]
  },
  {
    name: 'IT & Digital',
    gewerke: [
      { name: 'Grafikdesign' },
      { name: 'Fotografie' },
      { name: 'Webentwicklung' },
      { name: 'App-Entwicklung' },
      { name: 'SEO / Marketing' },
      { name: 'Videoproduktion' },
    ]
  },
  {
    name: 'Büro & Verwaltung',
    gewerke: [
      { name: 'Anwälte' },
      { name: 'Buchhaltung' },
      { name: 'Steuerberatung' },
      { name: 'Übersetzung' },
      { name: 'Virtuelle Assistenz' },
    ]
  },
  {
    name: 'Events & Veranstaltung',
    gewerke: [
      { name: 'DJ / Musik' },
      { name: 'Eventplanung' },
      { name: 'Moderation' },
      { name: 'Zauberer' },
      { name: 'Hochzeitsfotograf' },
    ]
  },
  {
    name: 'Fahrzeuge & Mobilität',
    gewerke: [
      { name: 'Kfz-Mechaniker' },
      { name: 'Fahrservice' },
      { name: 'Kurierdienst' },
      { name: 'Reisebegleitung' },
    ]
  },
  {
    name: 'Familie & Soziales',
    gewerke: [
      { name: 'Babysitter' },
      { name: 'Seniorenbetreuung' },
      { name: 'Kinderbetreuung' },
      { name: 'Pflegedienst' },
    ]
  },
  {
    name: 'Tiere',
    gewerke: [
      { name: 'Hundefriseur' },
      { name: 'Hundesitter' },
      { name: 'Tierpflege' },
      { name: 'Tiertrainer' },
    ]
  },
  {
    name: 'Transport & Logistik',
    gewerke: [
      { name: 'Entrümpelung' },
      { name: 'Möbelmontage' },
      { name: 'Schwertransport' },
      { name: 'Umzugsservice' },
    ]
  },
  {
    name: 'Personal',
    gewerke: [
      { name: 'Personaler' },
      { name: 'Personalvermittlung' },
      { name: 'Lohnabrechnung' },
      { name: 'Vergütungsberatung' },
      { name: 'Fehlzeitenmanagement' },
      { name: 'Mitarbeiterbenefits' },
    ]
  },
  {
    name: 'Gesundheit',
    gewerke: [
      { name: 'Ärzte' },
      { name: 'Zahnärzte' },
      { name: 'Psychologen' },
      { name: 'Heilpraktiker' },
    ]
  },
]

export default function Home() {
  const [dienstleister, setDienstleister] = useState<any[]>([])
  const [gefiltert, setGefiltert] = useState<any[]>([])
  const [suche, setSuche] = useState('')
  const [stadtFilter, setStadtFilter] = useState('')
  const [plzFilter, setPlzFilter] = useState('')
  const [datumFilter, setDatumFilter] = useState('')
  const [uhrzeitFilter, setUhrzeitFilter] = useState('')
  const [preisFilter, setPreisFilter] = useState('')
  const [aktiveKategorie, setAktiveKategorie] = useState<string | null>(null)
  const [selectedGewerk, setSelectedGewerk] = useState('')
  const [karteAktiv, setKarteAktiv] = useState(false)
  const [kalenderEvents, setKalenderEvents] = useState<any[]>([])
  const [geladen, setGeladen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    laden()
  }, [])

  async function laden() {
    const { data } = await supabase.from('dienstleister').select(PROFIL_FELDER).eq('abo_aktiv', true)
    if (data) { setDienstleister(data); setGefiltert(data) }
    // Alle kalender_events laden für Uhrzeitfilter und Wochenvorschau
    const { data: events } = await supabase.from('kalender_events').select('*')
    if (events) setKalenderEvents(events)
    setGeladen(true)
    // Kalender im Hintergrund auffrischen und bei Änderungen neu laden
    if (data && data.length) {
      fetch('/api/kalender-auffrischen', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: data.map((d: any) => d.id) }) })
        .then(r => r.json())
        .then(async a => {
          if (!a.aktualisiert?.length) return
          const { data: neu } = await supabase.from('kalender_events').select('*')
          if (neu) setKalenderEvents(neu)
        })
        .catch(() => {})
    }
  }

  // Wie auf dem Profil: Ein Tag gilt als belegt, wenn um 12 Uhr ein Termin läuft
  function tagBelegt(userId: string, tag: Date) {
    const mittag = new Date(tag)
    mittag.setHours(12, 0, 0, 0)
    return kalenderEvents.some(e => e.user_id === userId && mittag >= new Date(e.start_zeit) && mittag <= new Date(e.end_zeit))
  }

  function naechsteTage(anzahl: number) {
    const tage: Date[] = []
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    for (let i = 0; i < anzahl; i++) { tage.push(new Date(d)); d.setDate(d.getDate() + 1) }
    return tage
  }

  function anwenden(suche_: string, stadt_: string, plz_: string, datum_: string, uhrzeit_: string = uhrzeitFilter) {
    let result = dienstleister
    if (suche_) {
      const q = suche_.toLowerCase()
      result = result.filter(d =>
        d.name?.toLowerCase().includes(q) ||
        d.gewerk?.toLowerCase().includes(q) ||
        d.ort?.toLowerCase().includes(q) ||
        d.beschreibung?.toLowerCase().includes(q)
      )
    }
    if (stadt_) {
      const q = stadt_.toLowerCase()
      result = result.filter(d => d.ort?.toLowerCase().includes(q))
    }
    if (plz_) {
      result = result.filter(d => d.postleitzahl?.toString().startsWith(plz_))
    }
    if (datum_) {
      result = result.filter(d => !d.verfuegbar_ab || d.verfuegbar_ab <= datum_)
    }
    // Uhrzeitfilter: Dienstleister ausblenden die zu Datum+Uhrzeit belegt sind
    if (datum_ && uhrzeit_) {
      const checkStr = datum_ + 'T' + uhrzeit_
      result = result.filter(d => {
        if (!d.user_id) return true
        const meineEvents = kalenderEvents.filter(e => e.user_id === d.user_id)
        if (meineEvents.length === 0) return true
        const belegt = meineEvents.some(e => {
          const startStr = e.start_zeit.slice(0, 16).replace(' ', 'T')
          const endStr = e.end_zeit.slice(0, 16).replace(' ', 'T')
          return checkStr >= startStr && checkStr < endStr
        })
        return !belegt
      })
    }
    if (preisFilter) {
      const maxPreis = parseInt(preisFilter)
      result = result.filter(d => {
        if (!d.preis) return true
        const zahl = parseInt(d.preis.replace(/[^0-9]/g, ''))
        return isNaN(zahl) || zahl <= maxPreis
      })
    }
    setGefiltert(result)
  }

  function suchAusfuehren() {
    setAktiveKategorie(null)
    setSelectedGewerk('')
    anwenden(suche, stadtFilter, plzFilter, datumFilter, uhrzeitFilter)
    setTimeout(() => {
      document.getElementById('ergebnisse')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  function filterUhrzeit(wert: string) {
    setUhrzeitFilter(wert)
    anwenden(suche, stadtFilter, plzFilter, datumFilter, wert)
  }

  function filterGewerk(gewerk: string) {
    setSelectedGewerk(gewerk)
    setSuche(gewerk)
    setStadtFilter('')
    setPlzFilter('')
    setDatumFilter('')
    setUhrzeitFilter('')
    setGefiltert(dienstleister.filter(d => d.gewerk?.toLowerCase().includes(gewerk.toLowerCase())))
  }

  function resetAlles() {
    setSuche('')
    setStadtFilter('')
    setPlzFilter('')
    setDatumFilter('')
    setUhrzeitFilter('')
    setPreisFilter('')
    setAktiveKategorie(null)
    setSelectedGewerk('')
    setGefiltert(dienstleister)
  }

  const aktiveKatData = hauptkategorien.find(k => k.name === aktiveKategorie)
  const hatFilter = suche || stadtFilter || plzFilter || datumFilter || uhrzeitFilter || preisFilter
  const datumText = datumFilter ? new Date(datumFilter + 'T12:00').toLocaleDateString('de-DE') : ''
  const woche = naechsteTage(7)
  const enter = (e: React.KeyboardEvent) => { if (e.key === 'Enter') suchAusfuehren() }

  return (
    <div style={{ minHeight:'100vh' }}>
      <Kopfzeile aktiv="suche" />

      {/* SUCHE */}
      <section className="mw-such-kopf">
        <div className="mw-wrap">
          <h1 className="mw-h1">Dienstleister finden</h1>
          <p className="mw-muted" style={{ margin:'6px 0 0' }}>Finde Dienstleister in deiner Region, schnell, einfach, direkt. Für Kunden kostenlos.</p>
          <div className="mw-filter">
            <div className="breit">
              <label className="mw-label" htmlFor="f-suche">Was suchst du?</label>
              <input id="f-suche" className="mw-feld" value={suche} onChange={e => setSuche(e.target.value)} onKeyDown={enter} placeholder="Name, Gewerk oder Ort" list="mw-gewerke" />
              <datalist id="mw-gewerke">
                {hauptkategorien.flatMap(k => k.gewerke.map(g => <option key={k.name + g.name} value={g.name} />))}
              </datalist>
            </div>
            <div>
              <label className="mw-label" htmlFor="f-stadt">Stadt</label>
              <input id="f-stadt" className="mw-feld" value={stadtFilter} onChange={e => setStadtFilter(e.target.value)} onKeyDown={enter} placeholder="z. B. Bochum" />
            </div>
            <div>
              <label className="mw-label" htmlFor="f-plz">PLZ</label>
              <input id="f-plz" className="mw-feld" value={plzFilter} onChange={e => setPlzFilter(e.target.value.replace(/\D/g, '').slice(0, 5))} onKeyDown={enter} placeholder="z. B. 44787" inputMode="numeric" maxLength={5} />
            </div>
            <div>
              <label className="mw-label" htmlFor="f-datum">Datum</label>
              <input id="f-datum" className={'mw-feld' + (datumFilter ? '' : ' leer')} type="date" value={datumFilter} onChange={e => setDatumFilter(e.target.value)} onKeyDown={enter} />
            </div>
            <div>
              <label className="mw-label" htmlFor="f-zeit">Uhrzeit</label>
              <input id="f-zeit" className={'mw-feld' + (uhrzeitFilter ? '' : ' leer')} type="time" value={uhrzeitFilter} onChange={e => filterUhrzeit(e.target.value)} />
            </div>
            <div>
              <label className="mw-label" htmlFor="f-preis">Max. Preis (€/Std.)</label>
              <input id="f-preis" className="mw-feld" value={preisFilter} onChange={e => setPreisFilter(e.target.value.replace(/[^0-9]/g, ''))} onKeyDown={enter} placeholder="z. B. 80" inputMode="numeric" />
            </div>
            <div style={{ display:'flex', alignItems:'flex-end' }}>
              <button className="mw-btn voll" onClick={suchAusfuehren}><Icon name="search" size={18} />Suchen</button>
            </div>
          </div>
          {datumFilter && uhrzeitFilter && (
            <p className="mw-muted" style={{ fontSize:14, margin:'10px 0 0' }}>
              <Icon name="clock" size={14} style={{ verticalAlign:'-2px', marginRight:6 }} />Zeigt nur Dienstleister, die am {datumText} um {uhrzeitFilter} Uhr verfügbar sind.
            </p>
          )}
        </div>
      </section>

      {/* KATEGORIEN */}
      {!suche && !stadtFilter && !plzFilter && !datumFilter && (
        <section className="mw-wrap" style={{ paddingTop:32 }}>
          {!aktiveKategorie && (
            <>
              <h2 className="mw-h2" style={{ fontSize:22, marginBottom:14 }}>Was suchst du?</h2>
              <div className="mw-kat-grid">
                {hauptkategorien.map(kat => (
                  <button key={kat.name} className="mw-kat" onClick={() => setAktiveKategorie(kat.name)}>
                    <IconBadge name={iconNameFuerKategorie(kat.name)} size={40} />
                    <span><b>{kat.name}</b><small>{kat.gewerke.length} Gewerke</small></span>
                  </button>
                ))}
              </div>
            </>
          )}
          {aktiveKategorie && aktiveKatData && (
            <>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14, flexWrap:'wrap' }}>
                <button className="mw-btn zwei klein" onClick={() => { setAktiveKategorie(null); setSelectedGewerk('') }}>← Alle Kategorien</button>
                <h2 className="mw-h2" style={{ fontSize:22, display:'flex', alignItems:'center', gap:10 }}>
                  <IconBadge name={iconNameFuerKategorie(aktiveKatData.name)} size={40} />{aktiveKatData.name}
                </h2>
              </div>
              <div className="mw-gw-grid">
                {aktiveKatData.gewerke.map(g => (
                  <button key={g.name} className={'mw-gw' + (selectedGewerk === g.name ? ' an' : '')} onClick={() => filterGewerk(g.name)}>{g.name}</button>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* ERGEBNISSE */}
      <section id="ergebnisse" className="mw-wrap" style={{ paddingTop:32, paddingBottom:48, scrollMarginTop:80 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          <h2 className="mw-h2" style={{ fontSize:22 }}>
            {hatFilter ? `${gefiltert.length} ${gefiltert.length === 1 ? 'Ergebnis' : 'Ergebnisse'}` : 'Alle Dienstleister'}
            {stadtFilter && ` in ${stadtFilter}`}
            {plzFilter && ` · PLZ ${plzFilter}`}
          </h2>
          {hatFilter && <button className="mw-link" onClick={resetAlles}>Filter zurücksetzen ✕</button>}
        </div>

        <div className="mw-ansicht">
          <button className={!karteAktiv ? 'an' : ''} onClick={() => setKarteAktiv(false)}><Icon name="list" size={16} />Liste</button>
          <button className={karteAktiv ? 'an' : ''} onClick={() => setKarteAktiv(true)}><Icon name="map" size={16} />Karte</button>
        </div>

        {!karteAktiv && gefiltert.length > 0 && (
          <div className="mw-treffer">
            {gefiltert.map((d: any) => {
              const hatKalender = d.user_id && kalenderEvents.some(e => e.user_id === d.user_id)
              const amTagBelegt = datumFilter && d.user_id ? tagBelegt(d.user_id, new Date(datumFilter + 'T00:00')) : null
              return (
                <a key={d.id} href={`/profil/${d.id}`} className="mw-karte mw-treffer-karte">
                  <div style={{ display:'flex', gap:14, alignItems:'center' }}>
                    <div className="mw-avatar">
                      {d.profilbild ? <img src={d.profilbild} alt="" /> : <Icon name="user" size={24} />}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <b style={{ color:'var(--mw-ink)', fontSize:17 }}>{d.name}</b>
                      <div className="mw-muted" style={{ fontSize:14 }}>{d.gewerk}{d.ort ? ' · ' + d.ort : ''}{d.postleitzahl ? ' ' + d.postleitzahl : ''}</div>
                    </div>
                    {datumFilter && hatKalender && (
                      <span className={'mw-badge ' + (amTagBelegt ? 'mw-belegt' : 'mw-frei')}>{amTagBelegt ? 'Belegt' : 'Frei'}</span>
                    )}
                  </div>
                  {d.beschreibung && (
                    <p className="mw-muted" style={{ margin:0, fontSize:14 }}>{d.beschreibung.slice(0, 90)}{d.beschreibung.length > 90 ? '…' : ''}</p>
                  )}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:12 }}>
                    <div style={{ flex:1 }}>
                      {hatKalender ? (
                        <>
                          <div className="mw-muted" style={{ fontSize:12, marginBottom:4 }}>Nächste 7 Tage</div>
                          <div className="mw-mini-woche" aria-label="Verfügbarkeit der nächsten 7 Tage">
                            {woche.map(tag => {
                              const b = tagBelegt(d.user_id, tag)
                              return <i key={tag.toISOString()} className={b ? 'b' : 'f'} title={tag.toLocaleDateString('de-DE', { weekday:'short', day:'numeric', month:'numeric' }) + (b ? ' belegt' : ' frei')} />
                            })}
                          </div>
                        </>
                      ) : (
                        <div className="mw-muted" style={{ fontSize:12 }}>{d.verfuegbar_ab ? 'Verfügbar ab ' + new Date(d.verfuegbar_ab).toLocaleDateString('de-DE') : ''}</div>
                      )}
                    </div>
                    {d.preis && <b style={{ color:'var(--mw-cta)', whiteSpace:'nowrap' }}>{d.preis}</b>}
                  </div>
                </a>
              )
            })}
          </div>
        )}

        {geladen && dienstleister.length === 0 && !karteAktiv && (
          <div className="mw-karte" style={{ padding:32, textAlign:'center' }}>
            <a className="mw-btn" href="/login">Jetzt kostenlos eintragen</a>
          </div>
        )}

        {dienstleister.length > 0 && gefiltert.length === 0 && !karteAktiv && (
          <div className="mw-karte mw-muted" style={{ padding:32, textAlign:'center' }}>
            Keine Dienstleister gefunden
            {stadtFilter && ` in "${stadtFilter}"`}
            {plzFilter && ` mit PLZ "${plzFilter}"`}
            {suche && ` für "${suche}"`}
            {datumFilter && uhrzeitFilter && ` · am ${datumText} um ${uhrzeitFilter} Uhr verfügbar`}
          </div>
        )}

        {karteAktiv && (
          <div className="mw-karte" style={{ overflow:'hidden' }}>
            <DienstleisterKarte eintraege={gefiltert.map((d: any) => ({ id: d.id, name: d.name, ort: d.ort, lat: d.lat, lng: d.lng }))} />
          </div>
        )}
      </section>

      {/* SO FUNKTIONIERT ES */}
      <section id="so-gehts" className="mw-abschnitt hell" style={{ scrollMarginTop:64 }}>
        <div className="mw-wrap">
          <div className="mw-kicker">So funktioniert es</div>
          <h2 className="mw-h2">In 3 Schritten zum Dienstleister</h2>
          <div className="mw-schritte">
            {[
              ['search', 'Suchen', 'Nach Name, Gewerk, Ort oder Wunschtermin suchen und den passenden Dienstleister finden.'],
              ['calendar', 'Vergleichen', 'Profile, Fotos, Bewertungen und freie Tage auf einen Blick vergleichen.'],
              ['mail', 'Kontaktieren', 'Direkt per E-Mail oder Telefon Kontakt aufnehmen, kostenlos und ohne Umweg.'],
            ].map(([icon, titel, text], i) => (
              <div key={titel} className="mw-karte" style={{ padding:24 }}>
                <div className="mw-serif" style={{ fontSize:15, fontWeight:700, color:'var(--mw-cta)', marginBottom:12 }}>Schritt {i + 1}</div>
                <IconBadge name={icon} size={48} />
                <h3 className="mw-h3" style={{ margin:'14px 0 6px' }}>{titel}</h3>
                <p className="mw-muted" style={{ margin:0 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WARUM MI-WERK */}
      <section className="mw-abschnitt">
        <div className="mw-wrap">
          <div className="mw-kicker">Warum Mi-Werk</div>
          <h2 className="mw-h2">Weniger Telefonieren, schneller ein Termin</h2>
          <div className="mw-vorteile">
            {[
              ['calendar', 'Freie Tage sofort sehen', 'Der Kalender zeigt, wer an deinem Wunschtag Zeit hat.'],
              ['star', 'Bewertungen von Kunden', 'Sterne und Kommentare bei jedem Dienstleister helfen bei der Entscheidung.'],
              ['lock', 'Datenschutz eingebaut', 'Aus dem Kalender wird nur frei oder belegt übertragen, keine Titel, Orte oder Details.'],
            ].map(([icon, titel, text]) => (
              <div key={titel}>
                <IconBadge name={icon} size={48} />
                <h3 className="mw-h3" style={{ fontSize:18, margin:'12px 0 6px' }}>{titel}</h3>
                <p className="mw-muted" style={{ margin:0 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIENSTLEISTER CTA */}
      <section className="mw-wrap" style={{ paddingBottom:64 }}>
        <div className="mw-karte" style={{ padding:'22px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:16, flexWrap:'wrap', background:'var(--mw-cta-soft)', borderColor:'#EAD3C0' }}>
          <div>
            <b style={{ color:'var(--mw-ink)', fontSize:17 }}>Du bist Dienstleister?</b>
            <div className="mw-muted" style={{ fontSize:15 }}>Trag dich kostenlos ein und werde von Kunden in deiner Region gefunden.</div>
          </div>
          <button className="mw-btn" onClick={() => router.push('/fuer-dienstleister')}>Jetzt kostenlos eintragen →</button>
        </div>
      </section>
    </div>
  )
}
