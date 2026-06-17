'use client'

const mobileStyle = `
  @media (max-width: 640px) {
    .kat-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .gewerk-grid { grid-template-columns: repeat(3, 1fr) !important; }
    .dl-grid { grid-template-columns: repeat(1, 1fr) !important; }
    .hero-pad { padding: 40px 16px 32px !important; }
    .hero-title { font-size: 36px !important; letter-spacing: -1px !important; }
    .nav-pad { padding: 0 16px !important; }
    .stats-row { gap: 20px !important; }
    .section-pad { padding: 32px 16px 0 !important; }
    .steps-grid { grid-template-columns: repeat(1, 1fr) !important; }
    .filter-row { flex-direction: column !important; }
  }
`

import { useEffect, useState } from 'react'
import { supabase } from './Lib/supabase'
import { useRouter } from 'next/navigation'

const hauptkategorien = [
  {
    emoji: '✂️', name: 'Beauty & Pflege',
    gewerke: [
      { emoji: '🦶', name: 'Fußpflege' },
      { emoji: '✂️', name: 'Friseur' },
      { emoji: '💄', name: 'Kosmetik' },
      { emoji: '💆', name: 'Massage' },
      { emoji: '💅', name: 'Nagelpflege' },
      { emoji: '💋', name: 'Permanent Make-up' },
      { emoji: '👁️', name: 'Wimpern' },
    ]
  },
  {
    emoji: '🎓', name: 'Bildung & Coaching',
    gewerke: [
      { emoji: '📄', name: 'Bewerbungscoaching' },
      { emoji: '🧠', name: 'Life Coach' },
      { emoji: '🎵', name: 'Musikunterricht' },
      { emoji: '📚', name: 'Nachhilfe' },
      { emoji: '🗣️', name: 'Sprachkurs' },
    ]
  },
  {
    emoji: '🍽️', name: 'Catering & Essen',
    gewerke: [
      { emoji: '🍽️', name: 'Catering' },
      { emoji: '🚚', name: 'Foodtruck' },
      { emoji: '🥤', name: 'Getränkeservice' },
      { emoji: '🔥', name: 'Grillservice' },
      { emoji: '👨‍🍳', name: 'Kochservice' },
      { emoji: '🥗', name: 'Meal Prep' },
      { emoji: '🎉', name: 'Partyservice' },
    ]
  },
  {
    emoji: '💪', name: 'Fitness & Sport',
    gewerke: [
      { emoji: '🥦', name: 'Ernährungsberatung' },
      { emoji: '🥋', name: 'Kampfsport' },
      { emoji: '💪', name: 'Personal Trainer' },
      { emoji: '🦴', name: 'Physiotherapie' },
      { emoji: '🏋️', name: 'Pilates' },
      { emoji: '🏊', name: 'Schwimmtrainer' },
      { emoji: '🧘', name: 'Yoga' },
    ]
  },
  {
    emoji: '🌿', name: 'Garten & Außen',
    gewerke: [
      { emoji: '🌳', name: 'Baumfällung' },
      { emoji: '🌿', name: 'Gartenbau' },
      { emoji: '🌱', name: 'Rasenpflege' },
      { emoji: '🪴', name: 'Landschaftspflege' },
      { emoji: '🧱', name: 'Pflasterer' },
      { emoji: '🌊', name: 'Teichbau' },
      { emoji: '🏡', name: 'Zaunbau' },
    ]
  },
  {
    emoji: '🏠', name: 'Haus & Handwerk',
    gewerke: [
      { emoji: '🔌', name: 'Elektriker' },
      { emoji: '🪟', name: 'Fensterbau' },
      { emoji: '🪣', name: 'Klempner' },
      { emoji: '🎨', name: 'Maler' },
      { emoji: '🔨', name: 'Schreiner' },
      { emoji: '🧹', name: 'Reinigung' },
      { emoji: '🏗️', name: 'Renovierung' },
    ]
  },
  {
    emoji: '💻', name: 'IT & Digital',
    gewerke: [
      { emoji: '🎨', name: 'Grafikdesign' },
      { emoji: '📸', name: 'Fotografie' },
      { emoji: '💻', name: 'Webentwicklung' },
      { emoji: '📱', name: 'App-Entwicklung' },
      { emoji: '📊', name: 'SEO / Marketing' },
      { emoji: '🎬', name: 'Videoproduktion' },
    ]
  },
  {
    emoji: '📋', name: 'Büro & Verwaltung',
    gewerke: [
      { emoji: '📋', name: 'Buchhaltung' },
      { emoji: '⚖️', name: 'Rechtsberatung' },
      { emoji: '💼', name: 'Steuerberatung' },
      { emoji: '📝', name: 'Übersetzung' },
      { emoji: '🗂️', name: 'Virtuelle Assistenz' },
    ]
  },
  {
    emoji: '🎉', name: 'Events & Veranstaltung',
    gewerke: [
      { emoji: '🎸', name: 'DJ / Musik' },
      { emoji: '🎪', name: 'Eventplanung' },
      { emoji: '🎭', name: 'Moderation' },
      { emoji: '🎩', name: 'Zauberer' },
      { emoji: '📸', name: 'Hochzeitsfotograf' },
    ]
  },
  {
    emoji: '🚗', name: 'Fahrzeuge & Mobilität',
    gewerke: [
      { emoji: '🔧', name: 'Kfz-Mechaniker' },
      { emoji: '🚗', name: 'Fahrservice' },
      { emoji: '🚕', name: 'Kurierdienst' },
      { emoji: '🚐', name: 'Reisebegleitung' },
    ]
  },
  {
    emoji: '👶', name: 'Familie & Soziales',
    gewerke: [
      { emoji: '👶', name: 'Babysitter' },
      { emoji: '👴', name: 'Seniorenbetreuung' },
      { emoji: '🏫', name: 'Kinderbetreuung' },
      { emoji: '♿', name: 'Pflegedienst' },
    ]
  },
  {
    emoji: '🐾', name: 'Tiere',
    gewerke: [
      { emoji: '✂️', name: 'Hundefriseur' },
      { emoji: '🐕', name: 'Hundesitter' },
      { emoji: '🐩', name: 'Tierpflege' },
      { emoji: '🎾', name: 'Tiertrainer' },
    ]
  },
  {
    emoji: '🚛', name: 'Transport & Logistik',
    gewerke: [
      { emoji: '🗑️', name: 'Entrümpelung' },
      { emoji: '📦', name: 'Möbelmontage' },
      { emoji: '🏋️', name: 'Schwertransport' },
      { emoji: '🚛', name: 'Umzugsservice' },
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
  const [user, setUser] = useState<any>(null)
  const [karteAktiv, setKarteAktiv] = useState(false)
  const [kalenderEvents, setKalenderEvents] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    laden()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUser(session.user)
    })
  }, [])

  async function laden() {
    const { data } = await supabase.from('dienstleister').select('*').eq('abo_aktiv', true)
    if (data) { setDienstleister(data); setGefiltert(data) }
    // Alle kalender_events laden für Uhrzeitfilter
    const { data: events } = await supabase.from('kalender_events').select('*')
    if (events) setKalenderEvents(events)
  }

  function istBelegt(userId: string, datum: string, uhrzeit: string): boolean {
    if (!datum || !uhrzeit) return false
    let isoDate = datum
    if (datum.includes('.')) {
      const parts = datum.split('.')
      if (parts.length === 3) isoDate = parts[2] + '-' + parts[1].padStart(2,'0') + '-' + parts[0].padStart(2,'0')
    }
    const [checkH, checkM] = uhrzeit.split(':').map(Number)
    const checkMinutes = checkH * 60 + checkM
    return kalenderEvents.some(e => {
      if (e.user_id !== userId) return false
      const startDate = new Date(e.start_zeit)
      const endDate = new Date(e.end_zeit)
      const startIso = startDate.toISOString().slice(0, 10)
      const endIso = endDate.toISOString().slice(0, 10)
      if (isoDate < startIso || isoDate > endIso) return false
      const startMinutes = (startDate.getUTCHours() + 2) * 60 + startDate.getUTCMinutes()
      const endMinutes = (endDate.getUTCHours() + 2) * 60 + endDate.getUTCMinutes()
      return checkMinutes >= startMinutes && checkMinutes < endMinutes
    })
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
      result = result.filter(d => {
        if (!d.user_id) return true // kein Kalender = immer frei
        return !istBelegt(d.user_id, datum_, uhrzeit_)
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

  function filtern(wert: string) { setSuche(wert) }
  function filterStadt(wert: string) { setStadtFilter(wert) }
  function filterPlz(wert: string) { setPlzFilter(wert) }
  function filterDatum(wert: string) { setDatumFilter(wert) }
  function filterUhrzeit(wert: string) {
    setUhrzeitFilter(wert)
    anwenden(suche, stadtFilter, plzFilter, datumFilter, wert)
  }

  const [kiLaden, setKiLaden] = useState(false)

  async function kiSuche() {
    if (!suche.trim()) { suchAusfuehren(); return }
    setKiLaden(true)
    try {
      const alleGewerke = hauptkategorien.flatMap(k => k.gewerke.map(g => g.name)).join(', ')
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 100,
          messages: [{
            role: 'user',
            content: `Du bist ein Assistent für eine Dienstleister-Plattform. Der Nutzer sucht: "${suche}". Welche der folgenden Gewerke passen am besten dazu? Antworte NUR mit einer kommaseparierten Liste der passenden Gewerke (maximal 5), keine Erklärung. Verfügbare Gewerke: ${alleGewerke}`
          }]
        })
      })
      const data = await response.json()
      const gewerkeText = data.content?.[0]?.text || ''
      const gewerkeList = gewerkeText.split(',').map((g: string) => g.trim().toLowerCase())
      let result = dienstleister
      if (stadtFilter) result = result.filter(d => d.ort?.toLowerCase().includes(stadtFilter.toLowerCase()))
      if (plzFilter) result = result.filter(d => d.postleitzahl?.toString().startsWith(plzFilter))
      if (datumFilter.length === 10) {
        const parts = datumFilter.split('.')
        if (parts.length === 3) {
          const iso = parts[2] + '-' + parts[1].padStart(2,'0') + '-' + parts[0].padStart(2,'0')
          result = result.filter(d => !d.verfuegbar_ab || d.verfuegbar_ab <= iso)
        }
      }
      if (datumFilter && uhrzeitFilter) {
        result = result.filter(d => {
          if (!d.user_id) return true
          return !istBelegt(d.user_id, datumFilter, uhrzeitFilter)
        })
      }
      result = result.filter(d => gewerkeList.some((g: string) =>
        d.gewerk?.toLowerCase().includes(g) ||
        d.beschreibung?.toLowerCase().includes(g) ||
        d.name?.toLowerCase().includes(g)
      ))
      if (result.length === 0) anwenden(suche, stadtFilter, plzFilter, datumFilter, uhrzeitFilter)
      else setGefiltert(result)
      setAktiveKategorie(null)
      setSelectedGewerk('')
    } catch {
      anwenden(suche, stadtFilter, plzFilter, datumFilter, uhrzeitFilter)
    }
    setKiLaden(false)
    setTimeout(() => {
      document.getElementById('ergebnisse')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  function suchAusfuehren() {
    setAktiveKategorie(null)
    setSelectedGewerk('')
    anwenden(suche, stadtFilter, plzFilter, datumFilter, uhrzeitFilter)
    setTimeout(() => {
      document.getElementById('ergebnisse')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
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

  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', color:'#E8DDD4', fontFamily:'system-ui' }}>
      <style dangerouslySetInnerHTML={{ __html: mobileStyle }} />

      {/* NAV */}
      <div className="nav-pad" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', height:56, background:'#111', borderBottom:'1px solid rgba(200,149,108,0.18)', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ fontFamily:'Georgia,serif', fontSize:20, fontWeight:700, cursor:'pointer' }} onClick={resetAlles}>
          Mi-<span style={{ color:'#c8956c' }}>Werk</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          {user ? (
            <button onClick={() => router.push('/dashboard')} style={{ fontSize:12, fontWeight:500, padding:'7px 18px', borderRadius:6, background:'#c8956c', color:'#fff', border:'none', cursor:'pointer', fontFamily:'inherit' }}>
              Mein Profil
            </button>
          ) : (
            <>
              <button onClick={() => router.push('/login')} style={{ fontSize:12, color:'#9A8878', background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit' }}>
                Anmelden
              </button>
              <button onClick={() => router.push('/login')} style={{ fontSize:12, fontWeight:500, padding:'7px 18px', borderRadius:6, background:'#c8956c', color:'#fff', border:'1px solid #c8956c', cursor:'pointer', fontFamily:'inherit' }}>
                Registrieren
              </button>
            </>
          )}
        </div>
      </div>

      {/* HERO */}
      <div className="hero-pad" style={{ textAlign:'center', padding:'72px 24px 56px', background:'linear-gradient(180deg, #111 0%, #0A0A0A 100%)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
        <div className="hero-title" style={{ fontFamily:'Georgia,serif', fontSize:52, fontWeight:700, letterSpacing:-1, marginBottom:14 }}>
          Mi-<span style={{ color:'#c8956c' }}>Werk</span>
        </div>
        <div style={{ fontSize:16, color:'#9A8878', marginBottom:40, maxWidth:480, margin:'0 auto 40px' }}>
          Finde Dienstleister in deiner Region — schnell, einfach, direkt.
        </div>

        {/* SUCHFELD */}
        <div style={{ maxWidth:560, margin:'0 auto', position:'relative' }}>
          <input
            value={suche}
            onChange={e => filtern(e.target.value)}
            placeholder="Name, Gewerk oder Ort suchen…"
            style={{ width:'100%', padding:'16px 60px 16px 20px', background:'#181818', border:'1px solid rgba(200,149,108,0.3)', borderRadius:12, fontSize:15, color:'#E8DDD4', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }}
          />
          <div style={{ position:'absolute', right:18, top:'50%', transform:'translateY(-50%)', color:'#c8956c', fontSize:18 }}>🔍</div>
        </div>

        {/* STADT + PLZ FILTER */}
        <div className="filter-row" style={{ maxWidth:560, margin:'12px auto 0', display:'flex', gap:10 }}>
          <div style={{ flex:1 }}>
            <input
              value={stadtFilter}
              onChange={e => filterStadt(e.target.value)}
              placeholder="📍 Stadt filtern…"
              style={{ width:'100%', padding:'12px 16px', background:'#181818', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, fontSize:14, color:'#E8DDD4', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(200,149,108,0.4)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>
          <div style={{ flex:1 }}>
            <input
              value={plzFilter}
              onChange={e => filterPlz(e.target.value)}
              placeholder="🔢 PLZ filtern…"
              maxLength={5}
              style={{ width:'100%', padding:'12px 16px', background:'#181818', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, fontSize:14, color:'#E8DDD4', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(200,149,108,0.4)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>
        </div>

        {/* DATUM + UHRZEIT FILTER */}
        <div className="filter-row" style={{ maxWidth:560, margin:'10px auto 0', display:'flex', gap:10 }}>
          <div style={{ flex:2 }}>
            <input
              value={datumFilter}
              onChange={e => filterDatum(e.target.value)}
              placeholder="📅 Datum z.B. 15.06.2026"
              style={{ width:'100%', padding:'12px 16px', background:'#181818', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, fontSize:14, color:'#E8DDD4', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(200,149,108,0.4)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              onKeyDown={e => e.key === 'Enter' && suchAusfuehren()}
            />
          </div>
          <div style={{ flex:1 }}>
            <input
              type="time"
              value={uhrzeitFilter}
              onChange={e => filterUhrzeit(e.target.value)}
              style={{ width:'100%', padding:'12px 16px', background:'#181818', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, fontSize:14, color: uhrzeitFilter ? '#E8DDD4' : '#5A5550', fontFamily:'inherit', outline:'none', boxSizing:'border-box', colorScheme:'dark' }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(200,149,108,0.4)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>
        </div>
        {datumFilter && uhrzeitFilter && (
          <div style={{ maxWidth:560, margin:'6px auto 0', fontSize:11, color:'#9A8878', textAlign:'left', paddingLeft:4 }}>
            ⏰ Zeigt nur Dienstleister die am {datumFilter} um {uhrzeitFilter} Uhr verfügbar sind
          </div>
        )}

        {/* PREIS FILTER */}
        <div style={{ maxWidth:560, margin:'10px auto 0' }}>
          <input
            value={preisFilter}
            onChange={e => setPreisFilter(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="💶 Max. Preis z.B. 80 (€/Std.)"
            style={{ width:'100%', padding:'12px 16px', background:'#181818', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, fontSize:14, color:'#E8DDD4', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }}
            onFocus={e => e.currentTarget.style.borderColor = 'rgba(200,149,108,0.4)'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
            onKeyDown={e => e.key === 'Enter' && suchAusfuehren()}
          />
        </div>

        {/* SUCHEN BUTTON */}
        <div style={{ maxWidth:560, margin:'12px auto 0' }}>
          <button
            onClick={kiSuche}
            disabled={kiLaden}
            style={{ width:'100%', padding:'14px', background: kiLaden ? '#8a6644' : '#c8956c', color:'#fff', border:'none', borderRadius:10, fontSize:15, fontWeight:600, cursor: kiLaden ? 'wait' : 'pointer', fontFamily:'inherit', letterSpacing:0.5, transition:'background 0.2s' }}
            onMouseEnter={e => { if (!kiLaden) e.currentTarget.style.background = '#b8845c' }}
            onMouseLeave={e => { if (!kiLaden) e.currentTarget.style.background = '#c8956c' }}
          >
            {kiLaden ? '🔍 KI sucht…' : '🔍 Suchen'}
          </button>
        </div>

        <div className="stats-row" style={{ display:'flex', gap:40, justifyContent:'center', marginTop:48 }}>
          {[
            [dienstleister.length + '+', 'Dienstleister'],
            [hauptkategorien.length + '', 'Kategorien'],
            ['100%', 'Kostenlos'],
          ].map(([zahl, label]) => (
            <div key={label as string} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:'Georgia,serif', fontSize:28, fontWeight:700, color:'#c8956c' }}>{zahl}</div>
              <div style={{ fontSize:12, color:'#5A5550', marginTop:2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* DIENSTLEISTER CTA BANNER */}
        <div style={{ marginTop:40, background:'rgba(200,149,108,0.06)', border:'1px solid rgba(200,149,108,0.2)', borderRadius:14, padding:'20px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
          <div>
            <div style={{ fontSize:15, fontWeight:600, color:'#E8DDD4', marginBottom:4 }}>Du bist Dienstleister?</div>
            <div style={{ fontSize:13, color:'#9A8878' }}>Trag dich kostenlos ein und werde von Kunden in deiner Region gefunden.</div>
          </div>
          <button onClick={() => router.push('/login')} style={{ flexShrink:0, fontSize:13, fontWeight:600, padding:'12px 24px', borderRadius:9, background:'#c8956c', color:'#fff', border:'none', cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap' }}>
            Jetzt kostenlos eintragen →
          </button>
        </div>
      </div>

      {/* KATEGORIEN */}
      {!suche && !stadtFilter && !plzFilter && !datumFilter && (
        <div className="section-pad" style={{ maxWidth:1000, margin:'0 auto', padding:'48px 24px 0' }}>
          {!aktiveKategorie && (
            <>
              <div style={{ fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:1, color:'#5A5550', marginBottom:6 }}>Kategorie wählen</div>
              <div style={{ fontSize:22, fontWeight:700, fontFamily:'Georgia,serif', marginBottom:24 }}>Was suchst du?</div>
              <div className="kat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12 }}>
                {hauptkategorien.map(kat => (
                  <button
                    key={kat.name}
                    onClick={() => setAktiveKategorie(kat.name)}
                    style={{ display:'flex', alignItems:'center', gap:14, padding:'18px 20px', borderRadius:12, cursor:'pointer', fontFamily:'inherit', textAlign:'left', border:'1px solid rgba(255,255,255,0.06)', background:'#111', color:'#9A8878', transition:'all 0.15s', width:'100%' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(200,149,108,0.4)'; e.currentTarget.style.color = '#c8956c'; e.currentTarget.style.background = 'rgba(200,149,108,0.06)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#9A8878'; e.currentTarget.style.background = '#111' }}
                  >
                    <span style={{ fontSize:28, flexShrink:0 }}>{kat.emoji}</span>
                    <div>
                      <div style={{ fontSize:13, fontWeight:500, color:'#E8DDD4' }}>{kat.name}</div>
                      <div style={{ fontSize:11, color:'#5A5550', marginTop:2 }}>{kat.gewerke.length} Gewerke</div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
          {aktiveKategorie && aktiveKatData && (
            <>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
                <button onClick={() => { setAktiveKategorie(null); setSelectedGewerk('') }} style={{ fontSize:12, color:'#c8956c', background:'none', border:'1px solid rgba(200,149,108,0.3)', borderRadius:8, padding:'6px 14px', cursor:'pointer', fontFamily:'inherit' }}>
                  ← Zurück
                </button>
                <span style={{ fontSize:22, fontWeight:700, fontFamily:'Georgia,serif' }}>{aktiveKatData.emoji} {aktiveKatData.name}</span>
              </div>
              <div className="gewerk-grid" style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:10 }}>
                {aktiveKatData.gewerke.map(kat => (
                  <button
                    key={kat.name}
                    onClick={() => filterGewerk(kat.name)}
                    style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'16px 8px', borderRadius:12, cursor:'pointer', fontFamily:'inherit', border: selectedGewerk === kat.name ? '1px solid #c8956c' : '1px solid rgba(255,255,255,0.06)', background: selectedGewerk === kat.name ? 'rgba(200,149,108,0.12)' : '#111', color: selectedGewerk === kat.name ? '#c8956c' : '#9A8878', transition:'all 0.15s' }}
                    onMouseEnter={e => { if (selectedGewerk !== kat.name) { e.currentTarget.style.borderColor = 'rgba(200,149,108,0.4)'; e.currentTarget.style.color = '#c8956c' } }}
                    onMouseLeave={e => { if (selectedGewerk !== kat.name) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#9A8878' } }}
                  >
                    <span style={{ fontSize:28, marginBottom:8 }}>{kat.emoji}</span>
                    <span style={{ fontSize:11, textAlign:'center', lineHeight:1.3 }}>{kat.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* DIENSTLEISTER GRID */}
      <div id="ergebnisse" style={{ maxWidth:1000, margin:'0 auto', padding:'32px 24px 48px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          <div style={{ fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:1, color:'#5A5550' }}>
            {hatFilter ? `${gefiltert.length} Ergebnisse` : 'Alle Dienstleister'}
            {stadtFilter && ` in ${stadtFilter}`}
            {plzFilter && ` · PLZ ${plzFilter}`}
            {datumFilter && uhrzeitFilter && ` · ${datumFilter} ${uhrzeitFilter} Uhr`}
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            {hatFilter && (
              <button onClick={resetAlles} style={{ fontSize:11, color:'#c8956c', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>
                Filter zurücksetzen ✕
              </button>
            )}
          </div>
        </div>

        {/* ANSICHT UMSCHALTEN */}
        <div style={{ display:'flex', gap:8, marginBottom:20 }}>
          <button onClick={() => setKarteAktiv(false)} style={{ flex:1, padding:'10px', borderRadius:8, border:'1px solid ' + (!karteAktiv ? 'rgba(200,149,108,0.6)' : 'rgba(255,255,255,0.08)'), background: !karteAktiv ? 'rgba(200,149,108,0.12)' : 'transparent', color: !karteAktiv ? '#c8956c' : '#5A5550', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight: !karteAktiv ? 600 : 400 }}>
            ☰ Listenansicht
          </button>
          <button onClick={() => setKarteAktiv(true)} style={{ flex:1, padding:'10px', borderRadius:8, border:'1px solid ' + (karteAktiv ? 'rgba(200,149,108,0.6)' : 'rgba(255,255,255,0.08)'), background: karteAktiv ? 'rgba(200,149,108,0.12)' : 'transparent', color: karteAktiv ? '#c8956c' : '#5A5550', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight: karteAktiv ? 600 : 400 }}>
            🗺 Kartenansicht
          </button>
        </div>

        <div className="dl-grid" style={{ display: karteAktiv ? 'none' : 'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14 }}>
          {gefiltert.map((d: any) => (
            <div key={d.id} onClick={() => window.location.href = `/profil/${d.id}`} style={{ background:'#111', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'20px', cursor:'pointer' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(200,149,108,0.35)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
            >
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                <div style={{ width:44, height:44, borderRadius:'50%', overflow:'hidden', background:'#181818', border:'1px solid rgba(200,149,108,0.2)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {d.profilbild
                    ? <img src={d.profilbild} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    : <span style={{ fontSize:22 }}>{d.emoji || '🔧'}</span>
                  }
                </div>
                <div>
                  <div style={{ fontSize:14, fontWeight:500 }}>{d.name}</div>
                  <div style={{ fontSize:11, color:'#9A8878', marginTop:2 }}>{d.gewerk}{d.ort ? ' · ' + d.ort : ''}{d.postleitzahl ? ' ' + d.postleitzahl : ''}</div>
                </div>
              </div>
              {d.beschreibung && (
                <div style={{ fontSize:12, color:'#5A5550', lineHeight:1.6, marginBottom:12 }}>
                  {d.beschreibung.slice(0, 80)}{d.beschreibung.length > 80 ? '…' : ''}
                </div>
              )}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ fontSize:14, fontWeight:600, color:'#c8956c' }}>{d.preis ? d.preis + ' €/h' : ''}</div>
                {d.verfuegbar_ab && (
                  <div style={{ fontSize:10, color:'#5A5550' }}>ab {new Date(d.verfuegbar_ab).toLocaleDateString('de-DE')}</div>
                )}
              </div>
              {d.email && (
                <a href={'mailto:' + d.email} onClick={e => e.stopPropagation()} style={{ display:'block', marginTop:12, fontSize:12, color:'#c8956c', textDecoration:'none', padding:'7px 0', borderTop:'1px solid rgba(255,255,255,0.05)', textAlign:'center' }}>
                  Kontakt aufnehmen →
                </a>
              )}
            </div>
          ))}
        </div>

        {gefiltert.length === 0 && !karteAktiv && (
          <div style={{ textAlign:'center', padding:'60px 0', color:'#5A5550', fontSize:14 }}>
            Keine Dienstleister gefunden
            {stadtFilter && ` in "${stadtFilter}"`}
            {plzFilter && ` mit PLZ "${plzFilter}"`}
            {suche && ` für "${suche}"`}
            {datumFilter && uhrzeitFilter && ` · am ${datumFilter} um ${uhrzeitFilter} Uhr verfügbar`}
          </div>
        )}

        {/* KARTEN-ANSICHT */}
        {karteAktiv && (
          <div style={{ borderRadius:12, overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)', marginBottom:20 }}>
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=7.0%2C51.35%2C7.5%2C51.6&layer=mapnik`}
              style={{ width:'100%', height:480, border:'none' }}
              title="Dienstleister Karte"
            />
            <div style={{ padding:'16px', background:'#111' }}>
              <div style={{ fontSize:12, color:'#5A5550', marginBottom:12 }}>Dienstleister in der Karte:</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {gefiltert.map(d => (
                  <div key={d.id} onClick={() => window.location.href = `/profil/${d.id}`}
                    style={{ fontSize:12, padding:'4px 10px', borderRadius:20, background:'rgba(200,149,108,0.1)', border:'1px solid rgba(200,149,108,0.2)', color:'#c8956c', cursor:'pointer' }}>
                    {d.name} · {d.ort}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* WIE ES FUNKTIONIERT */}
      <div style={{ background:'#111', borderTop:'1px solid rgba(255,255,255,0.05)', padding:'60px 24px' }}>
        <div style={{ maxWidth:800, margin:'0 auto', textAlign:'center' }}>
          <div style={{ fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:1, color:'#5A5550', marginBottom:12 }}>So funktioniert es</div>
          <div style={{ fontFamily:'Georgia,serif', fontSize:28, fontWeight:700, marginBottom:48 }}>In 3 Schritten zum Dienstleister</div>
          <div className="steps-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:32 }}>
            {[
              ['🔍', 'Suchen', 'Nach Name, Gewerk oder Ort suchen und den passenden Dienstleister finden.'],
              ['👁️', 'Vergleichen', 'Profile, Beschreibungen und Verfügbarkeit vergleichen.'],
              ['✉️', 'Kontaktieren', 'Direkt per E-Mail Kontakt aufnehmen — kostenlos und einfach.'],
            ].map(([icon, titel, text]) => (
              <div key={titel as string} style={{ textAlign:'center' }}>
                <div style={{ fontSize:32, marginBottom:14 }}>{icon}</div>
                <div style={{ fontSize:15, fontWeight:500, marginBottom:8, color:'#c8956c' }}>{titel}</div>
                <div style={{ fontSize:13, color:'#5A5550', lineHeight:1.7 }}>{text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', padding:'32px', textAlign:'center' }}>
        <div style={{ fontFamily:'Georgia,serif', fontSize:16, fontWeight:700, marginBottom:8 }}>
          Mi-<span style={{ color:'#c8956c' }}>Werk</span>
        </div>
        <div style={{ fontSize:11, color:'#5A5550' }}>Dienstleister in deiner Region · © 2026</div>
        <div style={{ marginTop:16, display:'flex', gap:20, justifyContent:'center' }}>
          <button onClick={() => router.push('/login')} style={{ fontSize:12, color:'#5A5550', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>Anmelden</button>
          <button onClick={() => router.push('/login')} style={{ fontSize:12, color:'#5A5550', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>Registrieren</button>
        </div>
      </div>

    </div>
  )
}