'use client'

import { useEffect, useState } from 'react'
import { supabase } from './Lib/supabase'
import { useRouter } from 'next/navigation'

const kategorien = [
  // Bau & Ausbau
  { emoji: '🧱', name: 'Maurer' },
  { emoji: '🪵', name: 'Zimmerer' },
  { emoji: '🏠', name: 'Dachdecker' },
  { emoji: '🪜', name: 'Gerüstbauer' },
  { emoji: '🏗️', name: 'Trockenbauer' },
  { emoji: '🪨', name: 'Estrichleger' },
  { emoji: '🔲', name: 'Fliesenleger' },
  { emoji: '🎨', name: 'Maler' },
  { emoji: '🪣', name: 'Putzer' },
  { emoji: '🪟', name: 'Fensterbauer' },
  { emoji: '🚪', name: 'Türenbau' },
  // Installation & Technik
  { emoji: '⚡', name: 'Elektriker' },
  { emoji: '🔧', name: 'Sanitär' },
  { emoji: '🔥', name: 'Heizungsbau' },
  { emoji: '❄️', name: 'Klimatechnik' },
  { emoji: '☀️', name: 'Solartechnik' },
  { emoji: '💨', name: 'Lüftungsbau' },
  { emoji: '🛁', name: 'Badinstallation' },
  // Holz & Metall
  { emoji: '🪚', name: 'Schreiner' },
  { emoji: '🪑', name: 'Tischler' },
  { emoji: '🔩', name: 'Schlosser' },
  { emoji: '⚙️', name: 'Metallbauer' },
  { emoji: '🔨', name: 'Schweißer' },
  // Garten & Außen
  { emoji: '🌿', name: 'Gartenbau' },
  { emoji: '🌳', name: 'Baumfällung' },
  { emoji: '🧱', name: 'Pflasterer' },
  { emoji: '🪴', name: 'Landschaftspflege' },
  { emoji: '🌱', name: 'Rasenpflege' },
  { emoji: '🏡', name: 'Zaunbau' },
  { emoji: '🌊', name: 'Teichbau' },
  // Reinigung & Service
  { emoji: '🧹', name: 'Gebäudereinigung' },
  { emoji: '🪟', name: 'Fensterreinigung' },
  { emoji: '🏠', name: 'Hausmeisterservice' },
  { emoji: '🧺', name: 'Teppichreinigung' },
  { emoji: '🪣', name: 'Rohrreinigung' },
  // Transport & Logistik
  { emoji: '🚛', name: 'Umzugsservice' },
  { emoji: '🗑️', name: 'Entrümpelung' },
  { emoji: '📦', name: 'Möbelmontage' },
  // Sonstiges
  { emoji: '🔑', name: 'Schlüsseldienst' },
  { emoji: '🧰', name: 'Reparaturservice' },
  { emoji: '🛡️', name: 'Schornsteinfeger' },
  { emoji: '🛗', name: 'Aufzugstechnik' },
  { emoji: '📡', name: 'Antennenbau' },
  { emoji: '🖥️', name: 'IT-Service' },
]

export default function Home() {
  const [dienstleister, setDienstleister] = useState<any[]>([])
  const [gefiltert, setGefiltert] = useState<any[]>([])
  const [suche, setSuche] = useState('')
  const [selectedGewerk, setSelectedGewerk] = useState('')
  const [user, setUser] = useState<any>(null)
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
  }

  function filtern(wert: string) {
    setSuche(wert)
    setSelectedGewerk('')
    if (!wert) { setGefiltert(dienstleister); return }
    const q = wert.toLowerCase()
    setGefiltert(dienstleister.filter(d =>
      d.name?.toLowerCase().includes(q) ||
      d.gewerk?.toLowerCase().includes(q) ||
      d.ort?.toLowerCase().includes(q) ||
      d.beschreibung?.toLowerCase().includes(q)
    ))
  }

  function filterGewerk(gewerk: string) {
    if (selectedGewerk === gewerk) {
      setSelectedGewerk('')
      setSuche('')
      setGefiltert(dienstleister)
      return
    }
    setSelectedGewerk(gewerk)
    setSuche(gewerk)
    setGefiltert(dienstleister.filter(d => d.gewerk?.toLowerCase().includes(gewerk.toLowerCase())))
  }

  const gewerke = [...new Set(dienstleister.map(d => d.gewerk).filter(Boolean))]

  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', color:'#E8DDD4', fontFamily:'system-ui' }}>

      {/* NAV */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', height:56, background:'#111', borderBottom:'1px solid rgba(200,149,108,0.18)', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ fontFamily:'Georgia,serif', fontSize:20, fontWeight:700, cursor:'pointer' }} onClick={() => { setSuche(''); setSelectedGewerk(''); setGefiltert(dienstleister) }}>
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
              <button onClick={() => router.push('/login')} style={{ fontSize:12, fontWeight:500, padding:'7px 18px', borderRadius:6, background:'transparent', color:'#c8956c', border:'1px solid #c8956c', cursor:'pointer', fontFamily:'inherit' }}>
                Registrieren
              </button>
            </>
          )}
        </div>
      </div>

      {/* HERO */}
      <div style={{ textAlign:'center', padding:'72px 24px 56px', background:'linear-gradient(180deg, #111 0%, #0A0A0A 100%)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ fontFamily:'Georgia,serif', fontSize:52, fontWeight:700, letterSpacing:-1, marginBottom:14 }}>
          Mi-<span style={{ color:'#c8956c' }}>Werk</span>
        </div>
        <div style={{ fontSize:16, color:'#9A8878', marginBottom:40, maxWidth:480, margin:'0 auto 40px' }}>
          Finde Dienstleister in deiner Region — schnell, einfach, direkt.
        </div>

        {/* SUCHLEISTE */}
        <div style={{ maxWidth:560, margin:'0 auto', position:'relative' }}>
          <input
            value={suche}
            onChange={e => filtern(e.target.value)}
            placeholder="Name, Gewerk oder Ort suchen…"
            style={{
              width:'100%', padding:'16px 60px 16px 20px',
              background:'#181818', border:'1px solid rgba(200,149,108,0.3)',
              borderRadius:12, fontSize:15, color:'#E8DDD4',
              fontFamily:'inherit', outline:'none',
            }}
          />
          <div style={{ position:'absolute', right:18, top:'50%', transform:'translateY(-50%)', color:'#c8956c', fontSize:18 }}>🔍</div>
        </div>

        {/* STATS */}
        <div style={{ display:'flex', gap:40, justifyContent:'center', marginTop:48 }}>
          {[
            [dienstleister.length + '+', 'Dienstleister'],
            [gewerke.length + '+', 'Gewerke'],
            ['100%', 'Kostenlos'],
          ].map(([zahl, label]) => (
            <div key={label} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:'Georgia,serif', fontSize:28, fontWeight:700, color:'#c8956c' }}>{zahl}</div>
              <div style={{ fontSize:12, color:'#5A5550', marginTop:2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* KATEGORIE GRID */}
      {!suche && (
        <div style={{ maxWidth:1000, margin:'0 auto', padding:'48px 24px 0' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:20 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:1, color:'#5A5550', marginBottom:6 }}>Nach Gewerk suchen</div>
              <div style={{ fontSize:22, fontWeight:700, fontFamily:'Georgia,serif' }}>Alle Kategorien</div>
            </div>
            {selectedGewerk && (
              <button onClick={() => { setSelectedGewerk(''); setSuche(''); setGefiltert(dienstleister) }} style={{ fontSize:12, color:'#c8956c', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>
                Filter zurücksetzen ✕
              </button>
            )}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:10 }}>
            {kategorien.map(kat => (
              <button
                key={kat.name}
                onClick={() => filterGewerk(kat.name)}
                style={{
                  display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                  padding:'16px 8px', borderRadius:12, cursor:'pointer', fontFamily:'inherit',
                  border: selectedGewerk === kat.name
                    ? '1px solid #c8956c'
                    : '1px solid rgba(255,255,255,0.06)',
                  background: selectedGewerk === kat.name
                    ? 'rgba(200,149,108,0.12)'
                    : '#111',
                  color: selectedGewerk === kat.name ? '#c8956c' : '#9A8878',
                  transition:'all 0.15s',
                }}
                onMouseEnter={e => {
                  if (selectedGewerk !== kat.name) {
                    e.currentTarget.style.borderColor = 'rgba(200,149,108,0.4)'
                    e.currentTarget.style.color = '#c8956c'
                  }
                }}
                onMouseLeave={e => {
                  if (selectedGewerk !== kat.name) {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                    e.currentTarget.style.color = '#9A8878'
                  }
                }}
              >
                <span style={{ fontSize:28, marginBottom:8 }}>{kat.emoji}</span>
                <span style={{ fontSize:11, textAlign:'center', lineHeight:1.3 }}>{kat.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* DIENSTLEISTER GRID */}
      <div style={{ maxWidth:1000, margin:'0 auto', padding:'32px 24px 48px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          <div style={{ fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:1, color:'#5A5550' }}>
            {suche ? `${gefiltert.length} Ergebnisse für "${suche}"` : 'Alle Dienstleister'}
          </div>
          {suche && (
            <button onClick={() => { setSuche(''); setSelectedGewerk(''); setGefiltert(dienstleister) }} style={{ fontSize:11, color:'#c8956c', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>
              Filter zurücksetzen ✕
            </button>
          )}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14 }}>
          {gefiltert.map((d: any) => (
            <div key={d.id} style={{
              background:'#111', border:'1px solid rgba(255,255,255,0.06)',
              borderRadius:12, padding:'20px', cursor:'pointer',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(200,149,108,0.35)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
            >
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                <div style={{ fontSize:28 }}>{d.emoji || '🔧'}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:500 }}>{d.name}</div>
                  <div style={{ fontSize:11, color:'#9A8878', marginTop:2 }}>{d.gewerk}{d.ort ? ' · ' + d.ort : ''}</div>
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
                <a href={`mailto:${d.email}`} style={{ display:'block', marginTop:12, fontSize:12, color:'#c8956c', textDecoration:'none', padding:'7px 0', borderTop:'1px solid rgba(255,255,255,0.05)', textAlign:'center' }}>
                  Kontakt aufnehmen →
                </a>
              )}
            </div>
          ))}
        </div>

        {gefiltert.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px 0', color:'#5A5550', fontSize:14 }}>
            Keine Dienstleister gefunden für "{suche}"
          </div>
        )}
      </div>

      {/* WIE ES FUNKTIONIERT */}
      <div style={{ background:'#111', borderTop:'1px solid rgba(255,255,255,0.05)', padding:'60px 24px' }}>
        <div style={{ maxWidth:800, margin:'0 auto', textAlign:'center' }}>
          <div style={{ fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:1, color:'#5A5550', marginBottom:12 }}>So funktioniert es</div>
          <div style={{ fontFamily:'Georgia,serif', fontSize:28, fontWeight:700, marginBottom:48 }}>In 3 Schritten zum Dienstleister</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:32 }}>
            {[
              ['🔍', 'Suchen', 'Nach Name, Gewerk oder Ort suchen und den passenden Dienstleister finden.'],
              ['👁️', 'Vergleichen', 'Profile, Beschreibungen und Verfügbarkeit vergleichen.'],
              ['✉️', 'Kontaktieren', 'Direkt per E-Mail Kontakt aufnehmen — kostenlos und einfach.'],
            ].map(([icon, titel, text]) => (
              <div key={titel} style={{ textAlign:'center' }}>
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