'use client'

import { useEffect, useState, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { KONTAKT_PAKETE } from '../../Lib/kontaktPakete'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function ProfilSeite({ params }) {
  const { id } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [profil, setProfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState([])
  const [kalenderMonat, setKalenderMonat] = useState(new Date())

  const [email, setEmail] = useState('')
  const [freigeschaltet, setFreigeschaltet] = useState(false)
  const [guthaben, setGuthaben] = useState(0)
  const [kontaktDaten, setKontaktDaten] = useState(null)
  const [pruefLaden, setPruefLaden] = useState(false)
  const [einloesenLaden, setEinloesenLaden] = useState(false)
  const [checkoutLaden, setCheckoutLaden] = useState(null)
  const [kontaktFehler, setKontaktFehler] = useState('')

  useEffect(() => {
    async function laden() {
      const { data } = await supabase
        .from('dienstleister')
        .select('id, user_id, name, gewerk, ort, umkreis, verfuegbar_ab, preis, beschreibung, qualifikationen, profilbild, emoji, website')
        .eq('id', Number(id)).single()
      setProfil(data)
      if (data?.user_id) {
        const { data: evs } = await supabase
          .from('kalender_events')
          .select('*')
          .eq('user_id', data.user_id)
        setEvents(evs || [])
      }
      setLoading(false)
    }
    laden()
  }, [id])

  async function kontaktDatenLaden(kaeuferEmail) {
    const res = await fetch('/api/kontakt-daten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dienstleisterId: Number(id), käuferEmail: kaeuferEmail }),
    })
    const data = await res.json()
    if (res.ok) setKontaktDaten(data)
  }

  async function statusPruefen(kaeuferEmail) {
    setPruefLaden(true)
    setKontaktFehler('')
    try {
      const res = await fetch('/api/kontakt-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dienstleisterId: Number(id), käuferEmail: kaeuferEmail }),
      })
      const data = await res.json()
      if (!res.ok) { setKontaktFehler(data.error || 'Prüfung fehlgeschlagen'); setPruefLaden(false); return }
      setFreigeschaltet(data.freigeschaltet)
      setGuthaben(data.guthaben)
      if (data.freigeschaltet) await kontaktDatenLaden(kaeuferEmail)
    } catch {
      setKontaktFehler('Prüfung fehlgeschlagen')
    }
    setPruefLaden(false)
  }

  useEffect(() => {
    const erfolg = searchParams.get('freischaltung') === 'success'
    const emailParam = searchParams.get('email')
    if (erfolg && emailParam) {
      setEmail(emailParam)
      let versuche = 0
      const intervall = setInterval(async () => {
        versuche++
        await statusPruefen(emailParam)
        if (versuche >= 5) clearInterval(intervall)
      }, 1500)
      statusPruefen(emailParam)
      return () => clearInterval(intervall)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function einloesen() {
    setEinloesenLaden(true)
    setKontaktFehler('')
    try {
      const res = await fetch('/api/kontakt-einloesen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dienstleisterId: Number(id), käuferEmail: email }),
      })
      const data = await res.json()
      if (!res.ok) { setKontaktFehler(data.error || 'Einlösen fehlgeschlagen'); setEinloesenLaden(false); return }
      setFreigeschaltet(true)
      await kontaktDatenLaden(email)
    } catch {
      setKontaktFehler('Einlösen fehlgeschlagen')
    }
    setEinloesenLaden(false)
  }

  async function kaufen(paketKey) {
    setCheckoutLaden(paketKey)
    setKontaktFehler('')
    try {
      const res = await fetch('/api/checkout-kontakt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dienstleisterId: Number(id), käuferEmail: email, paket: paketKey }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else { setKontaktFehler(data.error || 'Checkout fehlgeschlagen'); setCheckoutLaden(null) }
    } catch {
      setKontaktFehler('Checkout fehlgeschlagen')
      setCheckoutLaden(null)
    }
  }

  function istBelegt(datum) {
    return events.some(e => {
      const start = new Date(e.start_zeit)
      const end = new Date(e.end_zeit)
      const d = new Date(datum)
      d.setHours(12, 0, 0, 0)
      return d >= start && d <= end
    })
  }

  function kalenderTage() {
    const jahr = kalenderMonat.getFullYear()
    const monat = kalenderMonat.getMonth()
    const ersterTag = new Date(jahr, monat, 1)
    const letzterTag = new Date(jahr, monat + 1, 0)
    const tage = []
    const wochentag = ersterTag.getDay() === 0 ? 6 : ersterTag.getDay() - 1
    for (let i = 0; i < wochentag; i++) tage.push(null)
    for (let i = 1; i <= letzterTag.getDate(); i++) tage.push(new Date(jahr, monat, i))
    return tage
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <span style={{ color:'#c8956c' }}>Laden...</span>
    </div>
  )

  if (!profil) return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
      <div style={{ fontSize:48 }}>🔍</div>
      <div style={{ color:'#E8DDD4', fontSize:18, fontWeight:500 }}>Profil nicht gefunden</div>
      <button onClick={() => router.push('/')} style={{ fontSize:13, color:'#c8956c', background:'none', border:'1px solid rgba(200,149,108,0.3)', borderRadius:8, padding:'8px 18px', cursor:'pointer' }}>
        Zurueck zur Startseite
      </button>
    </div>
  )

  const heute = new Date()
  heute.setHours(0, 0, 0, 0)
  const tage = kalenderTage()
  const wochentage = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', color:'#E8DDD4', fontFamily:'system-ui' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', height:52, background:'#111', borderBottom:'1px solid rgba(200,149,108,0.18)', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ fontFamily:'Georgia,serif', fontSize:19, fontWeight:700, cursor:'pointer' }} onClick={() => router.push('/')}>
          Mi-<span style={{ color:'#c8956c' }}>Werk</span>
        </div>
        <button onClick={() => router.back()} style={{ fontSize:12, color:'#9A8878', background:'none', border:'none', cursor:'pointer' }}>Zurueck</button>
      </div>

      <div style={{ maxWidth:700, margin:'0 auto', padding:'40px 20px 80px' }}>

        <div style={{ background:'#111', border:'1px solid rgba(200,149,108,0.2)', borderRadius:16, padding:'32px', marginBottom:20 }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:20, marginBottom:24 }}>
            <div style={{ width:80, height:80, borderRadius:'50%', overflow:'hidden', background:'#181818', border:'2px solid rgba(200,149,108,0.3)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {profil.profilbild ? <img src={profil.profilbild} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <span style={{ fontSize:36 }}>{profil.emoji || '🔧'}</span>}
            </div>
            <div style={{ flex:1 }}>
              <h1 style={{ fontSize:26, fontWeight:700, fontFamily:'Georgia,serif', marginBottom:6 }}>{profil.name}</h1>
              <div style={{ fontSize:15, color:'#c8956c', fontWeight:500, marginBottom:8 }}>{profil.gewerk}</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {profil.ort && <span style={{ fontSize:12, color:'#9A8878', background:'rgba(255,255,255,0.04)', borderRadius:20, padding:'4px 12px' }}>📍 {profil.ort}{profil.umkreis ? ' (+' + profil.umkreis + ')' : ''}</span>}
                {profil.verfuegbar_ab && <span style={{ fontSize:12, color:'#9A8878', background:'rgba(255,255,255,0.04)', borderRadius:20, padding:'4px 12px' }}>📅 ab {new Date(profil.verfuegbar_ab).toLocaleDateString('de-DE')}</span>}
                {profil.preis && <span style={{ fontSize:12, color:'#c8956c', background:'rgba(200,149,108,0.08)', borderRadius:20, padding:'4px 12px', border:'1px solid rgba(200,149,108,0.2)' }}>💶 {profil.preis}</span>}
              </div>
            </div>
          </div>
          {profil.beschreibung && (
            <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:20 }}>
              <div style={{ fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:1, color:'#5A5550', marginBottom:10 }}>Ueber mich</div>
              <p style={{ fontSize:14, color:'#9A8878', lineHeight:1.8, margin:0 }}>{profil.beschreibung}</p>
            </div>
          )}
          {profil.qualifikationen && (
            <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:20, marginTop:20 }}>
              <div style={{ fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:1, color:'#5A5550', marginBottom:10 }}>Qualifikationen</div>
              <p style={{ fontSize:14, color:'#9A8878', lineHeight:1.8, margin:0 }}>{profil.qualifikationen}</p>
            </div>
          )}
        </div>

        {/* VERFÜGBARKEIT KALENDER */}
        <div style={{ background:'#111', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, padding:'24px', marginBottom:20 }}>
          <div style={{ fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:1, color:'#5A5550', marginBottom:16 }}>Verfuegbarkeit</div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <button onClick={() => setKalenderMonat(new Date(kalenderMonat.getFullYear(), kalenderMonat.getMonth() - 1, 1))}
              style={{ background:'none', border:'1px solid rgba(255,255,255,0.08)', borderRadius:6, color:'#9A8878', padding:'4px 10px', cursor:'pointer', fontSize:14 }}>←</button>
            <div style={{ fontSize:14, fontWeight:500 }}>
              {kalenderMonat.toLocaleDateString('de-DE', { month:'long', year:'numeric' })}
            </div>
            <button onClick={() => setKalenderMonat(new Date(kalenderMonat.getFullYear(), kalenderMonat.getMonth() + 1, 1))}
              style={{ background:'none', border:'1px solid rgba(255,255,255,0.08)', borderRadius:6, color:'#9A8878', padding:'4px 10px', cursor:'pointer', fontSize:14 }}>→</button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:4, marginBottom:8 }}>
            {wochentage.map(w => <div key={w} style={{ textAlign:'center', fontSize:11, color:'#5A5550', fontWeight:500 }}>{w}</div>)}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:4 }}>
            {tage.map((tag, i) => {
              if (!tag) return <div key={i} />
              const vergangen = tag < heute
              const belegt = istBelegt(tag)
              const istHeute = tag.toDateString() === heute.toDateString()
              return (
                <div key={i} style={{
                  textAlign:'center', padding:'6px 2px', borderRadius:6, fontSize:12,
                  background: belegt ? 'rgba(192,57,43,0.15)' : vergangen ? 'transparent' : 'rgba(39,174,96,0.1)',
                  color: belegt ? '#C0392B' : vergangen ? '#3A3530' : '#27AE60',
                  border: istHeute ? '1px solid #c8956c' : '1px solid transparent',
                  fontWeight: istHeute ? 600 : 400,
                }}>
                  {tag.getDate()}
                </div>
              )
            })}
          </div>
          <div style={{ display:'flex', gap:16, marginTop:14 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'#5A5550' }}>
              <div style={{ width:10, height:10, borderRadius:2, background:'rgba(39,174,96,0.3)' }} /> Frei
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'#5A5550' }}>
              <div style={{ width:10, height:10, borderRadius:2, background:'rgba(192,57,43,0.3)' }} /> Belegt
            </div>
          </div>
          {events.length === 0 && (
            <div style={{ fontSize:12, color:'#5A5550', marginTop:12, textAlign:'center' }}>Kein Kalender verbunden</div>
          )}
        </div>

        <div style={{ background:'#111', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, padding:'24px', marginBottom:20 }}>
          <div style={{ fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:1, color:'#5A5550', marginBottom:16 }}>Kontakt aufnehmen</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {kontaktDaten ? (
              <>
                {kontaktDaten.email && (
                  <a href={'mailto:' + kontaktDaten.email + '?subject=Anfrage ueber mi-werk.de'}
                    style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, padding:'14px 24px', background:'#c8956c', color:'#fff', textDecoration:'none', borderRadius:10, fontSize:14, fontWeight:500 }}>
                    ✉️ {kontaktDaten.email}
                  </a>
                )}
                {kontaktDaten.telefon && (
                  <a href={'tel:' + kontaktDaten.telefon}
                    style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, padding:'14px 24px', background:'rgba(200,149,108,0.1)', color:'#c8956c', textDecoration:'none', borderRadius:10, fontSize:14, fontWeight:500, border:'1px solid rgba(200,149,108,0.3)' }}>
                    📞 {kontaktDaten.telefon}
                  </a>
                )}
              </>
            ) : (
              <>
                <div style={{ fontSize:13, color:'#9A8878', marginBottom:4 }}>
                  E-Mail und Telefon sind geschützt. Schalte den Kontakt frei, um {profil.name} direkt zu erreichen.
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="deine@email.de"
                  style={{ width:'100%', background:'#181818', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'12px 14px', fontSize:14, color:'#E8DDD4', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }}
                />
                {!freigeschaltet && guthaben === 0 && (
                  <button onClick={() => statusPruefen(email)} disabled={!email || pruefLaden}
                    style={{ padding:'12px 24px', borderRadius:10, background:'transparent', border:'1px solid rgba(200,149,108,0.3)', color:'#c8956c', fontSize:13, fontWeight:500, cursor: email ? 'pointer' : 'not-allowed', opacity: pruefLaden ? 0.7 : 1 }}>
                    {pruefLaden ? 'Prüfe...' : 'Schon freigeschaltet? Prüfen'}
                  </button>
                )}
                {guthaben > 0 && !freigeschaltet && (
                  <button onClick={einloesen} disabled={einloesenLaden}
                    style={{ padding:'14px 24px', borderRadius:10, background:'#c8956c', color:'#fff', border:'none', fontSize:14, fontWeight:600, cursor:'pointer', opacity: einloesenLaden ? 0.7 : 1 }}>
                    {einloesenLaden ? 'Löse ein...' : `Mit Guthaben freischalten (noch ${guthaben} übrig)`}
                  </button>
                )}
                {!freigeschaltet && guthaben === 0 && (
                  <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:6 }}>
                    {(Object.entries(KONTAKT_PAKETE)).map(([key, info]) => (
                      <button key={key} onClick={() => kaufen(key)} disabled={!email || !!checkoutLaden}
                        style={{ padding:'14px 24px', borderRadius:10, background: key === '1er' ? '#c8956c' : 'rgba(200,149,108,0.1)', color: key === '1er' ? '#fff' : '#c8956c', border: key === '1er' ? 'none' : '1px solid rgba(200,149,108,0.3)', fontSize:14, fontWeight:600, cursor: email ? 'pointer' : 'not-allowed', opacity: checkoutLaden ? 0.7 : 1 }}>
                        {checkoutLaden === key ? 'Öffnet...' : `${info.label} – ${info.preis}€`}
                      </button>
                    ))}
                  </div>
                )}
                {kontaktFehler && (
                  <div style={{ fontSize:13, color:'#C0392B', marginTop:4 }}>{kontaktFehler}</div>
                )}
              </>
            )}
            {profil.website && (
              <a href={profil.website.startsWith('http') ? profil.website : 'https://' + profil.website} target="_blank" rel="noopener noreferrer"
                style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, padding:'14px 24px', background:'rgba(255,255,255,0.04)', color:'#9A8878', textDecoration:'none', borderRadius:10, fontSize:14, border:'1px solid rgba(255,255,255,0.08)' }}>
                🌐 {profil.website}
              </a>
            )}
          </div>
        </div>

        <div style={{ background:'#111', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, padding:'24px' }}>
          <div style={{ fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:1, color:'#5A5550', marginBottom:16 }}>Details</div>
          {[
            ['Gewerk', profil.gewerk],
            ['Standort', profil.ort],
            ['Umkreis', profil.umkreis],
            ['Preis', profil.preis],
            ['Verfuegbar ab', profil.verfuegbar_ab ? new Date(profil.verfuegbar_ab).toLocaleDateString('de-DE') : null],
          ].filter(function(item) { return item[1] }).map(function(item) { return (
            <div key={item[0]} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:13 }}>
              <span style={{ color:'#5A5550' }}>{item[0]}</span>
              <span style={{ color:'#E8DDD4' }}>{item[1]}</span>
            </div>
          )})}
        </div>
      </div>

      <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', padding:'32px', textAlign:'center' }}>
        <div style={{ fontFamily:'Georgia,serif', fontSize:16, fontWeight:700, marginBottom:8 }}>Mi-<span style={{ color:'#c8956c' }}>Werk</span></div>
        <div style={{ fontSize:11, color:'#5A5550' }}>Dienstleister in deiner Region</div>
      </div>
    </div>
  )
}