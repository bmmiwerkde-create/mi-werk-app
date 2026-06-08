'use client'

import { useEffect, useState } from 'react'
import { supabase } from './Lib/supabase'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [dienstleister, setDienstleister] = useState<any[]>([])
  const [fehler, setFehler] = useState('')
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    laden()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUser(session.user)
    })
  }, [])

  async function laden() {
    const { data, error } = await supabase.from('dienstleister').select('*')
    if (error) { setFehler('Fehler: ' + error.message); return }
    if (data) setDienstleister(data)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', color:'#E8DDD4', fontFamily:'system-ui' }}>

      {/* NAV */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', height:56, background:'#111', borderBottom:'1px solid rgba(200,149,108,0.18)', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ fontFamily:'Georgia,serif', fontSize:20, fontWeight:700, letterSpacing:-0.5 }}>
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
      <div style={{ textAlign:'center', padding:'64px 24px 48px' }}>
        <div style={{ fontFamily:'Georgia,serif', fontSize:48, fontWeight:700, letterSpacing:-1, marginBottom:12 }}>
          Mi-<span style={{ color:'#c8956c' }}>Werk</span>
        </div>
        <div style={{ fontSize:14, color:'#5A5550', letterSpacing:1, textTransform:'uppercase', marginBottom:40 }}>
          Dienstleister in deiner Region
        </div>
      </div>

      {/* GRID */}
      <div style={{ maxWidth:1000, margin:'0 auto', padding:'0 24px 60px' }}>
        {fehler && <p style={{ color:'#C0392B', marginBottom:16, fontSize:13 }}>{fehler}</p>}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16 }}>
          {dienstleister.map((d: any) => (
            <div key={d.id} style={{
              background:'#111',
              border:'1px solid rgba(255,255,255,0.06)',
              borderRadius:12,
              padding:'20px',
              cursor:'pointer',
              transition:'border-color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(200,149,108,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
            >
              <div style={{ fontSize:32, marginBottom:12 }}>{d.emoji || '🔧'}</div>
              <div style={{ fontSize:15, fontWeight:500, marginBottom:4 }}>{d.name}</div>
              <div style={{ fontSize:12, color:'#9A8878', marginBottom:8 }}>
                {d.gewerk}{d.ort ? ' · ' + d.ort : ''}{d.umkreis ? ' (+' + d.umkreis + ')' : ''}
              </div>
              <div style={{ fontSize:12, color:'#5A5550', lineHeight:1.6, marginBottom:12 }}>
                {d.beschreibung?.slice(0, 80)}{d.beschreibung?.length > 80 ? '…' : ''}
              </div>
              {d.verfuegbar_ab && (
                <div style={{ fontSize:11, color:'#5A5550', marginBottom:8 }}>
                  Verfügbar ab {new Date(d.verfuegbar_ab).toLocaleDateString('de-DE')}
                </div>
              )}
              <div style={{ fontSize:14, fontWeight:600, color:'#c8956c' }}>
                {d.preis ? d.preis + ' €/h' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
