'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../Lib/supabase'

export default function ProfilSeite({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [profil, setProfil] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function laden() {
      const { data } = await supabase
        .from('dienstleister')
        .select('*')
        .eq('id', params.id)
        .eq('abo_aktiv', true)
        .single()
      setProfil(data)
      setLoading(false)
    }
    laden()
  }, [params.id])

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <span style={{ color:'#c8956c' }}>Laden…</span>
    </div>
  )

  if (!profil) return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
      <div style={{ fontSize:48 }}>🔍</div>
      <div style={{ color:'#E8DDD4', fontSize:18, fontWeight:500 }}>Profil nicht gefunden</div>
      <button onClick={() => router.push('/')} style={{ fontSize:13, color:'#c8956c', background:'none', border:'1px solid rgba(200,149,108,0.3)', borderRadius:8, padding:'8px 18px', cursor:'pointer' }}>
        ← Zurück zur Startseite
      </button>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', color:'#E8DDD4', fontFamily:'system-ui' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', height:52, background:'#111', borderBottom:'1px solid rgba(200,149,108,0.18)', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ fontFamily:'Georgia,serif', fontSize:19, fontWeight:700, cursor:'pointer' }} onClick={() => router.push('/')}>
          Mi-<span style={{ color:'#c8956c' }}>Werk</span>
        </div>
        <button onClick={() => router.back()} style={{ fontSize:12, color:'#9A8878', background:'none', border:'none', cursor:'pointer' }}>
          ← Zurück
        </button>
      </div>
      <div style={{ maxWidth:700, margin:'0 auto', padding:'40px 20px 80px' }}>
        <div style={{ background:'#111', border:'1px solid rgba(200,149,108,0.2)', borderRadius:16, padding:'32px', marginBottom:20 }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:20, marginBottom:24 }}>
            <div style={{ fontSize:64, lineHeight:1 }}>{profil.emoji || '🔧'}</div>
            <div style={{ flex:1 }}>
              <h1 style={{ fontSize:26, fontWeight:700, fontFamily:'Georgia,serif', marginBottom:6 }}>{profil.name}</h1>
              <div style={{ fontSize:15, color:'#c8956c', fontWeight:500, marginBottom:8 }}>{profil.gewerk}</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {profil.ort && <span style={{ fontSize:12, color:'#9A8878', background:'rgba(255,255,255,0.04)', borderRadius:20, padding:'4px 12px' }}>📍 {profil.ort}{profil.umkreis ? ` (+${profil.umkreis})` : ''}</span>}
                {profil.verfuegbar_ab && <span style={{ fontSize:12, color:'#9A8878', background:'rgba(255,255,255,0.04)', borderRadius:20, padding:'4px 12px' }}>📅 ab {new Date(profil.verfuegbar_ab).toLocaleDateString('de-DE')}</span>}
                {profil.preis && <span style={{ fontSize:12, color:'#c8956c', background:'rgba(200,149,108,0.08)', borderRadius:20, padding:'4px 12px', border:'1px solid rgba(200,149,108,0.2)' }}>💶 {profil.preis}</span>}
              </div>
            </div>
          </div>
          {profil.beschreibung && (
            <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:20 }}>
              <div style={{ fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:1, color:'#5A5550', marginBottom:10 }}>Über mich</div>
              <p style={{ fontSize:14, color:'#9A8878', lineHeight:1.8, margin:0 }}>{profil.beschreibung}</p>
            </div>
          )}
        </div>
        {profil.email && (
          <div style={{ background:'#111', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, padding:'24px', marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:1, color:'#5A5550', marginBottom:16 }}>Kontakt aufnehmen</div>
            <a href={`mailto:${profil.email}?subject=Anfrage über mi-werk.de&body=Hallo ${profil.name},%0D%0A%0D%0Aich bin über mi-werk.de auf dein Profil gestoßen.`}
              style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, padding:'14px 24px', background:'#c8956c', color:'#fff', textDecoration:'none', borderRadius:10, fontSize:14, fontWeight:500 }}>
              ✉️ E-Mail senden
            </a>
            <p style={{ fontSize:11, color:'#5A5550', textAlign:'center', marginTop:10, marginBottom:0 }}>Deine Nachricht geht direkt an {profil.name?.split(' ')[0]}</p>
          </div>
        )}
        <div style={{ background:'#111', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, padding:'24px' }}>
          <div style={{ fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:1, color:'#5A5550', marginBottom:16 }}>Details</div>
          {[
            ['Gewerk', profil.gewerk],
            ['Standort', profil.ort],
            ['Umkreis', profil.umkreis],
            ['Preis', profil.preis],
            ['Verfügbar ab', profil.verfuegbar_ab ? new Date(profil.verfuegbar_ab).toLocaleDateString('de-DE') : null],
          ].filter(([, v]) => v).map(([k, v]) => (
            <div key={k as string} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:13 }}>
              <span style={{ color:'#5A5550' }}>{k}</span>
              <span style={{ color:'#E8DDD4' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', padding:'32px', textAlign:'center' }}>
        <div style={{ fontFamily:'Georgia,serif', fontSize:16, fontWeight:700, marginBottom:8 }}>Mi-<span style={{ color:'#c8956c' }}>Werk</span></div>
        <div style={{ fontSize:11, color:'#5A5550' }}>Dienstleister in deiner Region · © 2026</div>
      </div>
    </div>
  )
}
