'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../Lib/supabase'
import { useRouter } from 'next/navigation'

const C = {
  copper:'#c8956c', copperBord:'rgba(200,149,108,0.22)', copperGlow:'rgba(200,149,108,0.08)',
  bg:'#0A0A0A', bg2:'#111111', bg3:'#181818', border:'rgba(255,255,255,0.06)',
  text:'#E8DDD4', textMid:'#9A8878', textDim:'#5A5550', green:'#27AE60', red:'#C0392B',
}

export default function ResetPasswort() {
  const [passwort, setPasswort] = useState('')
  const [bestaetigung, setBestaetigung] = useState('')
  const [passwortSichtbar, setPasswortSichtbar] = useState(false)
  const [meldung, setMeldung] = useState('')
  const [laden, setLaden] = useState(false)
  const router = useRouter()

  async function handleReset() {
    if (passwort.length < 6) { setMeldung('Fehler: Passwort muss mindestens 6 Zeichen haben'); return }
    if (passwort !== bestaetigung) { setMeldung('Fehler: Passwörter stimmen nicht überein'); return }
    setLaden(true)
    const { error } = await supabase.auth.updateUser({ password: passwort })
    if (error) setMeldung('Fehler: ' + error.message)
    else {
      setMeldung('Passwort erfolgreich geändert! Du wirst weitergeleitet...')
      setTimeout(() => router.push('/dashboard'), 2000)
    }
    setLaden(false)
  }

  const istFehler = meldung.startsWith('Fehler')

  return (
    <main style={{ minHeight:'100vh', background:C.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:'system-ui', padding:'24px' }}>
      <a href="/" style={{ textDecoration:'none', marginBottom:40 }}>
        <div style={{ fontFamily:'Georgia, serif', fontSize:26, fontWeight:700, color:C.text }}>
          Mi-<span style={{ color:C.copper }}>Werk</span>
        </div>
      </a>
      <div style={{ width:'100%', maxWidth:400, background:C.bg2, border:'1px solid ' + C.copperBord, borderRadius:14, overflow:'hidden' }}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid ' + C.border }}>
          <div style={{ fontSize:15, fontWeight:600, color:C.text }}>Neues Passwort setzen</div>
          <div style={{ fontSize:12, color:C.textDim, marginTop:4 }}>Mindestens 6 Zeichen</div>
        </div>
        <div style={{ padding:'24px' }}>
          <div style={{ marginBottom:12 }}>
            <label style={{ display:'block', fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.8px', color:C.textDim, marginBottom:6 }}>Neues Passwort</label>
            <div style={{ position:'relative' }}>
              <input type={passwortSichtbar ? 'text' : 'password'} placeholder="••••••••" value={passwort} onChange={e => setPasswort(e.target.value)}
                style={{ width:'100%', background:C.bg3, border:'1px solid ' + C.border, borderRadius:8, padding:'10px 40px 10px 13px', fontSize:14, color:C.text, fontFamily:'inherit', outline:'none', boxSizing:'border-box' as const }} />
              <button type="button" onClick={() => setPasswortSichtbar(v => !v)} aria-label={passwortSichtbar ? 'Passwort verbergen' : 'Passwort anzeigen'}
                style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', padding:4, display:'flex', color:C.textDim }}>
                {passwortSichtbar ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ display:'block', fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.8px', color:C.textDim, marginBottom:6 }}>Passwort bestätigen</label>
            <input type={passwortSichtbar ? 'text' : 'password'} placeholder="••••••••" value={bestaetigung} onChange={e => setBestaetigung(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleReset()}
              style={{ width:'100%', background:C.bg3, border:'1px solid ' + C.border, borderRadius:8, padding:'10px 13px', fontSize:14, color:C.text, fontFamily:'inherit', outline:'none', boxSizing:'border-box' as const }} />
          </div>
          <button onClick={handleReset} disabled={laden || !passwort || !bestaetigung}
            style={{ width:'100%', padding:'12px', background: laden || !passwort || !bestaetigung ? C.textDim : C.copper, color:'#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:600, cursor: laden || !passwort || !bestaetigung ? 'not-allowed' : 'pointer', fontFamily:'inherit' }}>
            {laden ? 'Bitte warten…' : 'Passwort speichern →'}
          </button>
          {meldung && (
            <div style={{ marginTop:14, padding:'10px 13px', borderRadius:8, background: istFehler ? 'rgba(192,57,43,0.08)' : 'rgba(39,174,96,0.08)', border:'1px solid ' + (istFehler ? 'rgba(192,57,43,0.3)' : 'rgba(39,174,96,0.3)'), fontSize:13, color: istFehler ? '#e74c3c' : C.green }}>
              {meldung}
            </div>
          )}
        </div>
      </div>
      <div style={{ marginTop:24, fontSize:12, color:C.textDim }}>
        <a href="/login" style={{ color:C.textDim, textDecoration:'none' }}>← Zurück zum Login</a>
      </div>
    </main>
  )
}
