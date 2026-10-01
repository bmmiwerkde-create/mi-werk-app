'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react'
import { supabase } from '../Lib/supabase'

const C = {
  copper:'#c8956c', copperBord:'rgba(200,149,108,0.22)', copperGlow:'rgba(200,149,108,0.08)',
  bg:'#0A0A0A', bg2:'#111111', bg3:'#181818', border:'rgba(255,255,255,0.06)',
  text:'#E8DDD4', textMid:'#9A8878', textDim:'#5A5550', green:'#27AE60', red:'#C0392B',
}

export default function Onboarding() {
  const router = useRouter()
  const { data: googleSession } = useSession()
  const [pruefeStatus, setPruefeStatus] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [schritt, setSchritt] = useState<1 | 2>(1)

  const [name, setName] = useState('')
  const [gewerk, setGewerk] = useState('')
  const [ort, setOrt] = useState('')
  const [postleitzahl, setPostleitzahl] = useState('')
  const [speichern, setSpeichern] = useState(false)
  const [fehler, setFehler] = useState('')
  const [icsUrlInput, setIcsUrlInput] = useState('')
  const [icsSpeichern, setIcsSpeichern] = useState(false)
  const [icsVerbunden, setIcsVerbunden] = useState(false)
  const [icsFehler, setIcsFehler] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUser(data.user)

      const { data: profil } = await supabase
        .from('dienstleister')
        .select('name, gewerk, ort')
        .eq('user_id', data.user.id)
        .single()

      if (profil?.name && profil?.gewerk && profil?.ort) {
        router.push('/dashboard')
        return
      }
      setPruefeStatus(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  async function weiterZuKalender() {
    if (!name || !gewerk || !ort) { setFehler('Bitte Name, Bereich und Ort ausfüllen.'); return }
    setFehler('')
    setSpeichern(true)
    const payload = { user_id: user.id, name, gewerk, ort, postleitzahl: postleitzahl || null, email: user.email }
    const { data: bestehend } = await supabase.from('dienstleister').select('id').eq('user_id', user.id).single()
    const { data: gespeichert, error } = bestehend
      ? await supabase.from('dienstleister').update(payload).eq('id', bestehend.id).select('id').single()
      : await supabase.from('dienstleister').insert({ ...payload, abo_aktiv: true }).select('id').single()
    setSpeichern(false)
    if (error) { setFehler('Fehler: ' + error.message); return }

    if (gespeichert?.id) {
      fetch('/api/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dienstleisterId: gespeichert.id, ort, postleitzahl }),
      }).catch(() => {})

      if (!bestehend) {
        fetch('/api/neuer-dienstleister', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ record: { id: gespeichert.id, name, gewerk, ort, beschreibung: '' } }),
        }).catch(() => {})

        fetch('/api/willkommen-dienstleister', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, name }),
        }).catch(() => {})
      }
    }

    setSchritt(2)
  }

  async function icsVerbindenOnboarding() {
    if (!icsUrlInput || !user) return
    setIcsSpeichern(true)
    setIcsFehler('')
    const { error } = await supabase.from('dienstleister').update({ ics_url: icsUrlInput }).eq('user_id', user.id)
    if (error) { setIcsFehler('Fehler: ' + error.message); setIcsSpeichern(false); return }
    const res = await fetch('/api/kalender-ics?userId=' + user.id)
    const data = await res.json()
    if (data.events) setIcsVerbunden(true)
    else setIcsFehler(data.error || 'Kalender konnte nicht abgerufen werden')
    setIcsSpeichern(false)
  }

  if (pruefeStatus) {
    return (
      <div style={{ minHeight:'100vh', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <span style={{ color:C.copper }}>Laden...</span>
      </div>
    )
  }

  return (
    <main style={{ minHeight:'100vh', background:C.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:'system-ui, -apple-system, sans-serif', padding:'48px 24px' }}>

      <div style={{ fontFamily:'Georgia, serif', fontSize:26, fontWeight:700, color:C.text, letterSpacing:'-0.5px', marginBottom:8 }}>
        Mi-<span style={{ color:C.copper }}>Werk</span>
      </div>
      <div style={{ fontSize:12, color:C.textDim, marginBottom:32 }}>Schritt {schritt} von 2</div>

      <div style={{ width:'100%', maxWidth:420, background:C.bg2, border:'1px solid ' + C.copperBord, borderRadius:16, overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}>

        {schritt === 1 && (
          <div style={{ padding:'28px 24px' }}>
            <div style={{ fontSize:16, fontWeight:600, color:C.text, marginBottom:6 }}>Dein Profil</div>
            <div style={{ fontSize:13, color:C.textMid, marginBottom:20, lineHeight:1.5 }}>
              Diese Angaben sehen Kunden auf deinem öffentlichen Profil.
            </div>

            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.8px', color:C.textDim, marginBottom:6 }}>Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Dein Name oder Firmenname"
                style={{ width:'100%', background:C.bg3, border:'1px solid ' + C.border, borderRadius:8, padding:'11px 13px', fontSize:14, color:C.text, fontFamily:'inherit', outline:'none', boxSizing:'border-box' }} />
            </div>

            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.8px', color:C.textDim, marginBottom:6 }}>In welchem Bereich bist du tätig?</label>
              <input value={gewerk} onChange={e => setGewerk(e.target.value)} placeholder="z.B. Elektriker, Friseurin, Personal Trainer"
                style={{ width:'100%', background:C.bg3, border:'1px solid ' + C.border, borderRadius:8, padding:'11px 13px', fontSize:14, color:C.text, fontFamily:'inherit', outline:'none', boxSizing:'border-box' }} />
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 120px', gap:10, marginBottom:20 }}>
              <div>
                <label style={{ display:'block', fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.8px', color:C.textDim, marginBottom:6 }}>Ort</label>
                <input value={ort} onChange={e => setOrt(e.target.value)} placeholder="z.B. Köln"
                  style={{ width:'100%', background:C.bg3, border:'1px solid ' + C.border, borderRadius:8, padding:'11px 13px', fontSize:14, color:C.text, fontFamily:'inherit', outline:'none', boxSizing:'border-box' }} />
              </div>
              <div>
                <label style={{ display:'block', fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.8px', color:C.textDim, marginBottom:6 }}>PLZ</label>
                <input value={postleitzahl} onChange={e => setPostleitzahl(e.target.value)} placeholder="50667"
                  style={{ width:'100%', background:C.bg3, border:'1px solid ' + C.border, borderRadius:8, padding:'11px 13px', fontSize:14, color:C.text, fontFamily:'inherit', outline:'none', boxSizing:'border-box' }} />
              </div>
            </div>

            <button onClick={weiterZuKalender} disabled={speichern}
              style={{ width:'100%', padding:'13px', background: speichern ? C.textDim : C.copper, color:'#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:600, cursor: speichern ? 'not-allowed' : 'pointer', fontFamily:'inherit' }}>
              {speichern ? 'Speichern…' : 'Weiter →'}
            </button>

            {fehler && (
              <div style={{ marginTop:14, padding:'10px 13px', borderRadius:8, background:'rgba(192,57,43,0.08)', border:'1px solid rgba(192,57,43,0.3)', fontSize:13, color:'#e74c3c' }}>
                {fehler}
              </div>
            )}
          </div>
        )}

        {schritt === 2 && (
          <div style={{ padding:'28px 24px' }}>
            <div style={{ fontSize:16, fontWeight:600, color:C.text, marginBottom:6 }}>Kalender verbinden</div>
            <div style={{ fontSize:13, color:C.textMid, marginBottom:16, lineHeight:1.6 }}>
              Ohne Kalender wissen Kunden nicht, wann du Zeit hast — verbinde ihn, damit dein Profil zeigt, wann du verfügbar bist.
            </div>
            <div style={{ fontSize:12, color:C.copper, background:C.copperGlow, border:'1px solid ' + C.copperBord, borderRadius:8, padding:'10px 13px', marginBottom:20, lineHeight:1.5 }}>
              🔒 Wir übertragen ausschließlich, ob du <strong>frei oder beschäftigt</strong> bist — nie Titel, Ort oder Details deiner Termine.
            </div>

            {!googleSession ? (
              <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:16 }}>
                <button onClick={() => signIn('google', { callbackUrl: 'https://www.mi-werk.de/dashboard' })}
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, padding:'12px 20px', background:'#fff', color:'#333', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                  📅 Mit Google Kalender verbinden
                </button>
                <button onClick={() => signIn('microsoft-entra-id', { callbackUrl: 'https://www.mi-werk.de/dashboard' })}
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, padding:'12px 20px', background:'#0078D4', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                  📧 Mit Outlook verbinden
                </button>
              </div>
            ) : (
              <div style={{ fontSize:13, color:C.green, marginBottom:16 }}>✓ Kalender verbunden ({googleSession.user?.email})</div>
            )}

            <div style={{ display:'flex', alignItems:'center', gap:10, margin:'6px 0 14px' }}>
              <div style={{ flex:1, height:1, background:C.border }} />
              <span style={{ fontSize:11, color:C.textDim }}>oder</span>
              <div style={{ flex:1, height:1, background:C.border }} />
            </div>

            {!icsVerbunden ? (
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:12, color:C.textMid, marginBottom:8, lineHeight:1.5 }}>
                  Nutzt du den <strong>Apple-Kalender auf dem iPhone</strong>? Dann per Link verbinden:
                </div>
                <div style={{ fontSize:11, color:C.copper, background:C.copperGlow, border:'1px solid ' + C.copperBord, borderRadius:8, padding:'9px 12px', marginBottom:10, lineHeight:1.5 }}>
                  📱 Kalender-App → Kalender → dein Kalender → „Kalender freigeben" → „Öffentlicher Kalender" aktivieren → Link kopieren.
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <input value={icsUrlInput} onChange={e => setIcsUrlInput(e.target.value)} placeholder="webcal://... oder https://..."
                    style={{ flex:1, background:C.bg3, border:'1px solid ' + C.border, borderRadius:8, padding:'10px 12px', fontSize:13, color:C.text, fontFamily:'inherit', outline:'none' }} />
                  <button onClick={icsVerbindenOnboarding} disabled={icsSpeichern || !icsUrlInput}
                    style={{ fontSize:12, padding:'0 14px', borderRadius:8, background:C.copper, color:'#fff', border:'none', cursor:'pointer', fontFamily:'inherit', opacity: icsSpeichern ? 0.7 : 1 }}>
                    {icsSpeichern ? '...' : 'OK'}
                  </button>
                </div>
                {icsFehler && <div style={{ fontSize:12, color:'#e74c3c', marginTop:8 }}>{icsFehler}</div>}
              </div>
            ) : (
              <div style={{ fontSize:13, color:C.green, marginBottom:16 }}>✓ Apple-Kalender verbunden</div>
            )}

            <button onClick={() => router.push('/dashboard')}
              style={{ width:'100%', padding:'12px', background: (googleSession || icsVerbunden) ? C.copper : 'transparent', border: (googleSession || icsVerbunden) ? 'none' : '1px solid ' + C.border, color: (googleSession || icsVerbunden) ? '#fff' : C.textDim, borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
              {(googleSession || icsVerbunden) ? 'Fertig — zum Dashboard →' : 'Später verbinden, zum Dashboard →'}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
