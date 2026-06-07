'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [passwort, setPasswort] = useState('')
  const [modus, setModus] = useState('login')
  const [meldung, setMeldung] = useState('')

  async function handleSubmit() {
    if (modus === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password: passwort })
      if (error) setMeldung('Fehler: ' + error.message)
      else setMeldung('Erfolgreich eingeloggt!')
    } else {
      const { error } = await supabase.auth.signUp({ email, password: passwort })
      if (error) setMeldung('Fehler: ' + error.message)
      else setMeldung('Bestätigungs-E-Mail gesendet!')
    }
  }

  return (
    <main style={{padding: '40px', maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif'}}>
      <h1>Mi-Werk</h1>
      <h2>{modus === 'login' ? 'Einloggen' : 'Registrieren'}</h2>
      <input placeholder="E-Mail" value={email} onChange={e => setEmail(e.target.value)}
        style={{width: '100%', padding: '10px', marginBottom: '10px', display: 'block'}} />
      <input placeholder="Passwort" type="password" value={passwort} onChange={e => setPasswort(e.target.value)}
        style={{width: '100%', padding: '10px', marginBottom: '10px', display: 'block'}} />
      <button onClick={handleSubmit}
        style={{width: '100%', padding: '12px', background: '#c8956c', color: 'white', border: 'none', cursor: 'pointer'}}>
        {modus === 'login' ? 'Einloggen' : 'Registrieren'}
      </button>
      <p onClick={() => setModus(modus === 'login' ? 'register' : 'login')}
        style={{cursor: 'pointer', color: '#c8956c', marginTop: '10px'}}>
        {modus === 'login' ? 'Noch kein Konto? Registrieren' : 'Schon ein Konto? Einloggen'}
      </p>
      {meldung && <p style={{color: 'green'}}>{meldung}</p>}
    </main>
  )
}