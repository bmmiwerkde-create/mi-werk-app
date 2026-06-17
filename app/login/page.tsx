'use client'
import { useState } from 'react'
import { supabase } from '../Lib/supabase'

const C = {
  copper:     '#c8956c',
  copperBord: 'rgba(200,149,108,0.22)',
  copperGlow: 'rgba(200,149,108,0.08)',
  bg:         '#0A0A0A',
  bg2:        '#111111',
  bg3:        '#181818',
  border:     'rgba(255,255,255,0.06)',
  text:       '#E8DDD4',
  textMid:    '#9A8878',
  textDim:    '#5A5550',
  green:      '#27AE60',
  red:        '#C0392B',
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [passwort, setPasswort] = useState('')
  const [modus, setModus] = useState<'login' | 'register'>('login')
  const [meldung, setMeldung] = useState('')
  const [laden, setLaden] = useState(false)

  async function handleSubmit() {
    setLaden(true)
    setMeldung('')
    if (modus === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password: passwort })
      if (error) setMeldung('Fehler: ' + error.message)
      else window.location.href = '/dashboard'
    } else {
      const { error } = await supabase.auth.signUp({ email, password: passwort })
      if (error) setMeldung('Fehler: ' + error.message)
      else setMeldung('Bestätigungs-E-Mail wurde gesendet — bitte prüfe dein Postfach.')
    }
    setLaden(false)
  }

  const istFehler = meldung.startsWith('Fehler')

  return (
    <main style={{
      minHeight: '100vh',
      background: C.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '24px',
    }}>

      {/* Logo */}
      <a href="/" style={{ textDecoration: 'none', marginBottom: 40 }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 700, color: C.text, letterSpacing: '-0.5px' }}>
          Mi-<span style={{ color: C.copper }}>Werk</span>
        </div>
      </a>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: C.bg2,
        border: '1px solid ' + C.copperBord,
        borderRadius: 14,
        overflow: 'hidden',
      }}>

        {/* Tab-Header */}
        <div style={{ display: 'flex', borderBottom: '1px solid ' + C.border }}>
          {(['login', 'register'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setModus(m); setMeldung('') }}
              style={{
                flex: 1,
                padding: '14px 0',
                background: modus === m ? C.copperGlow : 'transparent',
                border: 'none',
                borderBottom: modus === m ? '2px solid ' + C.copper : '2px solid transparent',
                color: modus === m ? C.copper : C.textDim,
                fontSize: 13,
                fontWeight: modus === m ? 600 : 400,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              {m === 'login' ? 'Einloggen' : 'Registrieren'}
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{ padding: '28px 24px' }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: C.textDim, marginBottom: 6 }}>
              E-Mail
            </label>
            <input
              type="email"
              placeholder="deine@email.de"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{
                width: '100%',
                background: C.bg3,
                border: '1px solid ' + C.border,
                borderRadius: 8,
                padding: '10px 13px',
                fontSize: 14,
                color: C.text,
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: C.textDim, marginBottom: 6 }}>
              Passwort
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwort}
              onChange={e => setPasswort(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{
                width: '100%',
                background: C.bg3,
                border: '1px solid ' + C.border,
                borderRadius: 8,
                padding: '10px 13px',
                fontSize: 14,
                color: C.text,
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={laden || !email || !passwort}
            style={{
              width: '100%',
              padding: '12px',
              background: laden || !email || !passwort ? C.textDim : C.copper,
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: laden || !email || !passwort ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              transition: 'opacity 0.15s',
            }}
          >
            {laden ? 'Bitte warten…' : modus === 'login' ? 'Einloggen →' : 'Konto erstellen →'}
          </button>

          {meldung && (
            <div style={{
              marginTop: 14,
              padding: '10px 13px',
              borderRadius: 8,
              background: istFehler ? 'rgba(192,57,43,0.08)' : 'rgba(39,174,96,0.08)',
              border: '1px solid ' + (istFehler ? 'rgba(192,57,43,0.3)' : 'rgba(39,174,96,0.3)'),
              fontSize: 13,
              color: istFehler ? '#e74c3c' : C.green,
              lineHeight: 1.5,
            }}>
              {meldung}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 32, fontSize: 12, color: C.textDim, textAlign: 'center' }}>
        <a href="/" style={{ color: C.textDim, textDecoration: 'none' }}>← Zurück zur Startseite</a>
      </div>
    </main>
  )
}