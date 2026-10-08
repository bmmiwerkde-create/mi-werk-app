'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../Lib/supabase'
import Kopfzeile from '@/components/Kopfzeile'


const VORTEILE = [
  '12 Monate kostenlos testen',
  'Kunden finden dich direkt in deiner Region',
  'Jederzeit kündbar, keine versteckten Kosten',
]

// Häufige Supabase-Fehlermeldungen verständlich auf Deutsch
function aufDeutsch(text: string) {
  const t = text.toLowerCase()
  if (t.includes('already registered')) return 'Diese E-Mail ist schon registriert. Bitte melde dich an.'
  if (t.includes('invalid login credentials')) return 'E-Mail oder Passwort stimmt nicht.'
  if (t.includes('password should be at least')) return 'Das Passwort muss mindestens 6 Zeichen haben.'
  if (t.includes('unable to validate email') || t.includes('invalid format')) return 'Bitte gib eine gültige E-Mail-Adresse ein.'
  if (t.includes('email not confirmed')) return 'Deine E-Mail ist noch nicht bestätigt. Bitte prüfe dein Postfach.'
  if (t.includes('rate limit') || t.includes('too many')) return 'Zu viele Versuche. Bitte warte kurz und versuche es dann erneut.'
  return text
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [passwort, setPasswort] = useState('')
  const [passwortSichtbar, setPasswortSichtbar] = useState(false)
  const [modus, setModus] = useState<'login' | 'register'>('register')
  const [meldung, setMeldung] = useState('')
  const [laden, setLaden] = useState(false)

  // /login?modus=login öffnet direkt den Anmelde-Reiter
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('modus') === 'login') setModus('login')
  }, [])

  async function handleSubmit() {
    setLaden(true)
    setMeldung('')
    if (modus === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password: passwort })
      if (error) setMeldung('Fehler: ' + aufDeutsch(error.message))
      else window.location.href = '/dashboard'
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: passwort,
        options: { emailRedirectTo: 'https://www.mi-werk.de/onboarding' },
      })
      if (error) setMeldung('Fehler: ' + aufDeutsch(error.message))
      // Ist die E-Mail-Bestätigung in Supabase ausgeschaltet, ist man sofort angemeldet
      else if (data.session) window.location.href = '/onboarding'
      else setMeldung('Bestätigungs-E-Mail wurde gesendet — bitte prüfe dein Postfach.')
    }
    setLaden(false)
  }

  const [resetModus, setResetModus] = useState(false)
  const istFehler = meldung.startsWith('Fehler')

  async function handleReset() {
    if (!email) { setMeldung('Fehler: Bitte E-Mail eingeben'); return }
    setLaden(true)
    setMeldung('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://www.mi-werk.de/reset-passwort',
    })
    if (error) setMeldung('Fehler: ' + aufDeutsch(error.message))
    else setMeldung('Reset-Link wurde gesendet — bitte prüfe dein Postfach.')
    setLaden(false)
  }

  const augeAuf = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
  const augeZu = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )

  return (
    <div>
      <Kopfzeile aktiv="login" />
      <main className="mw-schmal">
        <div className="mw-karte" style={{ padding:28 }}>
          <div className="mw-tabs" role="tablist">
            {(['register', 'login'] as const).map(m => (
              <button key={m} role="tab" aria-selected={modus === m} className={modus === m ? 'an' : ''} onClick={() => { setModus(m); setMeldung(''); setResetModus(false) }}>
                {m === 'login' ? 'Anmelden' : 'Registrieren'}
              </button>
            ))}
          </div>

          <h1 className="mw-h2" style={{ fontSize:25, marginBottom:6 }}>{modus === 'register' ? 'Kostenlos eintragen' : 'Willkommen zurück'}</h1>
          <p className="mw-muted" style={{ margin:'0 0 18px' }}>
            {modus === 'register' ? 'Erstelle dein Profil und erreiche Kunden in deiner Region, in wenigen Minuten.' : 'Melde dich an, um dein Profil zu verwalten.'}
          </p>

          {modus === 'register' && (
            <div style={{ display:'grid', gap:6, marginBottom:20 }}>
              {VORTEILE.map(v => (
                <div key={v} style={{ display:'flex', alignItems:'center', gap:8, fontSize:14, color:'var(--mw-text2)' }}>
                  <span style={{ color:'var(--mw-frei)', fontWeight:700 }}>✓</span>{v}
                </div>
              ))}
            </div>
          )}

          <label className="mw-label" htmlFor="l-mail">E-Mail</label>
          <input id="l-mail" className="mw-feld" type="email" placeholder="deine@email.de" value={email} autoComplete="email"
            onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} style={{ marginBottom:14 }} />

          {!resetModus && (<>
            <label className="mw-label" htmlFor="l-pw">Passwort</label>
            <div style={{ position:'relative' }}>
              <input id="l-pw" className="mw-feld" type={passwortSichtbar ? 'text' : 'password'} placeholder={modus === 'register' ? 'Mindestens 6 Zeichen' : '••••••••'}
                value={passwort} minLength={6} autoComplete={modus === 'register' ? 'new-password' : 'current-password'}
                onChange={e => setPasswort(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} style={{ paddingRight:44 }} />
              <button type="button" onClick={() => setPasswortSichtbar(v => !v)} aria-label={passwortSichtbar ? 'Passwort verbergen' : 'Passwort anzeigen'}
                style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', padding:4, display:'flex', color:'var(--mw-muted)' }}>
                {passwortSichtbar ? augeZu : augeAuf}
              </button>
            </div>

            <button className="mw-btn voll" onClick={handleSubmit} disabled={laden || !email || !passwort} style={{ marginTop:20 }}>
              {laden ? 'Bitte warten…' : modus === 'login' ? 'Anmelden' : 'Kostenloses Konto erstellen'}
            </button>

            {modus === 'login' && (
              <p style={{ textAlign:'center', margin:'14px 0 0' }}>
                <button className="mw-link" style={{ fontSize:14 }} onClick={() => { setResetModus(true); setMeldung('') }}>Passwort vergessen?</button>
              </p>
            )}
          </>)}

          {resetModus && (
            <div>
              <p className="mw-muted" style={{ fontSize:14, margin:'0 0 10px' }}>Wir senden dir einen Link zum Zurücksetzen an deine E-Mail.</p>
              <button className="mw-btn voll" onClick={handleReset} disabled={laden || !email}>{laden ? 'Bitte warten…' : 'Reset-Link senden'}</button>
              <p style={{ textAlign:'center', margin:'12px 0 0' }}>
                <button className="mw-link" style={{ fontSize:14 }} onClick={() => { setResetModus(false); setMeldung('') }}>← Zurück zum Anmelden</button>
              </p>
            </div>
          )}

          {meldung && (
            <div className={'mw-meldung ' + (istFehler ? 'fehler' : 'ok')}>
              {meldung}
              {modus === 'register' && meldung.includes('schon registriert') && (
                <div style={{ marginTop:8 }}>
                  <button className="mw-link" onClick={() => { setModus('login'); setMeldung(''); setPasswort('') }}>Zum Anmelden wechseln →</button>
                </div>
              )}
            </div>
          )}

          {modus === 'register' && (
            <p className="mw-muted" style={{ fontSize:13, textAlign:'center', margin:'16px 0 0', lineHeight:1.5 }}>
              Mit der Registrierung akzeptierst du unsere <a className="mw-link" href="/agb">AGB</a> und <a className="mw-link" href="/datenschutz">Datenschutzerklärung</a>.
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
