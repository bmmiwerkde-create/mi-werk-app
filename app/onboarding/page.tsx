'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react'
import { supabase } from '../Lib/supabase'
import { Icon } from '../components/Icons'
import Kopfzeile from '@/components/Kopfzeile'


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
      ? await supabase.from('dienstleister').update({ name, gewerk, ort, postleitzahl: postleitzahl || null, email: user.email }).eq('id', bestehend.id).select('id').single()
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
    return <div><Kopfzeile /><div className="mw-laden">Laden…</div></div>
  }

  const kalenderVerbunden = !!googleSession || icsVerbunden

  return (
    <div>
      <Kopfzeile />
      <main className="mw-schmal">
        <div className="mw-schritte-leiste" aria-hidden="true"><i className="an" /><i className={schritt === 2 ? 'an' : ''} /></div>

        {schritt === 1 && (
          <div className="mw-karte" style={{ padding:28 }}>
            <div className="mw-kicker">Schritt 1 von 2</div>
            <h1 className="mw-h2" style={{ fontSize:25, marginBottom:6 }}>Dein Profil</h1>
            <p className="mw-muted" style={{ margin:'0 0 18px' }}>Diese Angaben sehen Kunden auf deinem öffentlichen Profil.</p>

            <label className="mw-label" htmlFor="o-name">Name</label>
            <input id="o-name" className="mw-feld" value={name} onChange={e => setName(e.target.value)} placeholder="Dein Name oder Firmenname" style={{ marginBottom:14 }} />

            <label className="mw-label" htmlFor="o-gewerk">In welchem Bereich bist du tätig?</label>
            <input id="o-gewerk" className="mw-feld" value={gewerk} onChange={e => setGewerk(e.target.value)} placeholder="z. B. Elektriker, Friseurin, Personal Trainer" style={{ marginBottom:14 }} />

            <div style={{ display:'grid', gridTemplateColumns:'1fr 120px', gap:10, marginBottom:20 }}>
              <div>
                <label className="mw-label" htmlFor="o-ort">Ort</label>
                <input id="o-ort" className="mw-feld" value={ort} onChange={e => setOrt(e.target.value)} placeholder="z. B. Bochum" />
              </div>
              <div>
                <label className="mw-label" htmlFor="o-plz">PLZ</label>
                <input id="o-plz" className="mw-feld" value={postleitzahl} onChange={e => setPostleitzahl(e.target.value.replace(/\D/g, '').slice(0, 5))} placeholder="44787" inputMode="numeric" />
              </div>
            </div>

            <button className="mw-btn voll" onClick={weiterZuKalender} disabled={speichern}>{speichern ? 'Speichern…' : 'Weiter'}</button>
            {fehler && <div className="mw-meldung fehler">{fehler}</div>}
          </div>
        )}

        {schritt === 2 && (
          <div className="mw-karte" style={{ padding:28 }}>
            <div className="mw-kicker">Schritt 2 von 2</div>
            <h1 className="mw-h2" style={{ fontSize:25, marginBottom:6 }}>Kalender verbinden</h1>
            <p className="mw-muted" style={{ margin:'0 0 16px' }}>Ohne Kalender wissen Kunden nicht, wann du Zeit hast. Verbinde ihn, damit dein Profil zeigt, wann du verfügbar bist.</p>
            <div className="mw-hinweis" style={{ marginBottom:18 }}>
              <Icon name="lock" size={18} /><span>Wir übertragen ausschließlich, ob du <b>frei oder beschäftigt</b> bist, nie Titel, Ort oder Details deiner Termine.</span>
            </div>

            {!googleSession ? (
              <>
                <button className="mw-kal-knopf" onClick={() => signIn('google', { callbackUrl: 'https://www.mi-werk.de/dashboard' })}><Icon name="calendar" size={20} />Mit Google Kalender verbinden</button>
                <button className="mw-kal-knopf" onClick={() => signIn('microsoft-entra-id', { callbackUrl: 'https://www.mi-werk.de/dashboard' })}><Icon name="mail" size={20} />Mit Outlook verbinden</button>
              </>
            ) : (
              <div className="mw-meldung ok" style={{ marginTop:0, marginBottom:14 }}>✓ Kalender verbunden ({googleSession.user?.email})</div>
            )}

            <div style={{ display:'flex', alignItems:'center', gap:10, margin:'10px 0 14px' }}>
              <div style={{ flex:1, height:1, background:'var(--mw-line)' }} />
              <span className="mw-muted" style={{ fontSize:13 }}>oder</span>
              <div style={{ flex:1, height:1, background:'var(--mw-line)' }} />
            </div>

            {!icsVerbunden ? (
              <div style={{ marginBottom:18 }}>
                <p style={{ fontSize:14, margin:'0 0 8px', color:'var(--mw-text2)' }}>Nutzt du den <b>Apple-Kalender auf dem iPhone</b>? Dann per Link verbinden:</p>
                <p className="mw-muted" style={{ fontSize:13, margin:'0 0 10px', lineHeight:1.5 }}>Kalender-App öffnen → unten auf das Kalender-Symbol → beim iCloud-Kalender auf ⓘ → „Öffentlicher Kalender“ einschalten → „Link teilen …“ → „Kopieren“.</p>
                <div style={{ display:'flex', gap:8 }}>
                  <input className="mw-feld" value={icsUrlInput} onChange={e => setIcsUrlInput(e.target.value)} placeholder="webcal://… oder https://…" />
                  <button className="mw-btn" onClick={icsVerbindenOnboarding} disabled={icsSpeichern || !icsUrlInput}>{icsSpeichern ? '…' : 'OK'}</button>
                </div>
                {icsFehler && <div className="mw-meldung fehler">{icsFehler}</div>}
              </div>
            ) : (
              <div className="mw-meldung ok" style={{ marginTop:0, marginBottom:18 }}>✓ Apple-Kalender verbunden</div>
            )}

            <button className={'mw-btn voll' + (kalenderVerbunden ? '' : ' zwei')} onClick={() => router.push('/dashboard')}>
              {kalenderVerbunden ? 'Fertig, zum Dashboard' : 'Später verbinden, zum Dashboard'}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
