'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../Lib/supabase'
import { useRouter } from 'next/navigation'
import Kopfzeile from '@/components/Kopfzeile'


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
    <div>
      <Kopfzeile aktiv="login" />
      <main className="mw-schmal">
        <div className="mw-karte" style={{ padding:28 }}>
          <h1 className="mw-h2" style={{ fontSize:25, marginBottom:6 }}>Neues Passwort setzen</h1>
          <p className="mw-muted" style={{ margin:'0 0 18px' }}>Mindestens 6 Zeichen</p>

          <label className="mw-label" htmlFor="r-pw">Neues Passwort</label>
          <div style={{ position:'relative', marginBottom:14 }}>
            <input id="r-pw" className="mw-feld" type={passwortSichtbar ? 'text' : 'password'} placeholder="••••••••" value={passwort} autoComplete="new-password"
              onChange={e => setPasswort(e.target.value)} style={{ paddingRight:44 }} />
            <button type="button" onClick={() => setPasswortSichtbar(v => !v)} aria-label={passwortSichtbar ? 'Passwort verbergen' : 'Passwort anzeigen'}
              style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', padding:4, display:'flex', color:'var(--mw-muted)' }}>
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

          <label className="mw-label" htmlFor="r-pw2">Passwort bestätigen</label>
          <input id="r-pw2" className="mw-feld" type={passwortSichtbar ? 'text' : 'password'} placeholder="••••••••" value={bestaetigung} autoComplete="new-password"
            onChange={e => setBestaetigung(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleReset()} style={{ marginBottom:20 }} />

          <button className="mw-btn voll" onClick={handleReset} disabled={laden || !passwort || !bestaetigung}>{laden ? 'Bitte warten…' : 'Passwort speichern'}</button>
          {meldung && <div className={'mw-meldung ' + (istFehler ? 'fehler' : 'ok')}>{meldung}</div>}
        </div>
        <p style={{ textAlign:'center', marginTop:18 }}><a className="mw-link" href="/login?modus=login">← Zurück zum Anmelden</a></p>
      </main>
    </div>
  )
}
