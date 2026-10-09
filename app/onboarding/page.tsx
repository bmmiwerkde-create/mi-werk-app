'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../Lib/supabase'
import { Icon } from '../components/Icons'
import Kopfzeile from '@/components/Kopfzeile'
import KalenderAnleitung from '@/components/KalenderAnleitung'


export default function Onboarding() {
  const router = useRouter()
  const [pruefeStatus, setPruefeStatus] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [schritt, setSchritt] = useState<1 | 2>(1)

  const [name, setName] = useState('')
  const [gewerk, setGewerk] = useState('')
  const [ort, setOrt] = useState('')
  const [postleitzahl, setPostleitzahl] = useState('')
  const [telefon, setTelefon] = useState('')
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
    const payload = { user_id: user.id, name, gewerk, ort, postleitzahl: postleitzahl || null, telefon: telefon.trim() || null, email: user.email }
    const { data: bestehend } = await supabase.from('dienstleister').select('id').eq('user_id', user.id).single()
    const { data: gespeichert, error } = bestehend
      ? await supabase.from('dienstleister').update({ name, gewerk, ort, postleitzahl: postleitzahl || null, telefon: telefon.trim() || null, email: user.email }).eq('id', bestehend.id).select('id').single()
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
          body: JSON.stringify({ record: { id: gespeichert.id, name, gewerk, ort, postleitzahl, telefon: telefon.trim(), email: user.email, beschreibung: '' } }),
        }).catch(() => {})

        supabase.auth.getSession().then(({ data: { session } }) =>
          fetch('/api/willkommen-dienstleister', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (session?.access_token || '') },
            body: JSON.stringify({ name }),
          })
        ).catch(() => {})
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
    const { data: { session: sitzung } } = await supabase.auth.getSession()
    const res = await fetch('/api/kalender-ics', { headers: { Authorization: 'Bearer ' + (sitzung?.access_token || '') } })
    const data = await res.json()
    if (data.events) setIcsVerbunden(true)
    else setIcsFehler(data.error || 'Kalender konnte nicht abgerufen werden')
    setIcsSpeichern(false)
  }

  if (pruefeStatus) {
    return <div><Kopfzeile /><div className="mw-laden">Laden…</div></div>
  }

  const kalenderVerbunden = icsVerbunden

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

            <div style={{ display:'grid', gridTemplateColumns:'1fr 120px', gap:10, marginBottom:14 }}>
              <div>
                <label className="mw-label" htmlFor="o-ort">Ort</label>
                <input id="o-ort" className="mw-feld" value={ort} onChange={e => setOrt(e.target.value)} placeholder="z. B. Bochum" />
              </div>
              <div>
                <label className="mw-label" htmlFor="o-plz">PLZ</label>
                <input id="o-plz" className="mw-feld" value={postleitzahl} onChange={e => setPostleitzahl(e.target.value.replace(/\D/g, '').slice(0, 5))} placeholder="44787" inputMode="numeric" />
              </div>
            </div>

            <label className="mw-label" htmlFor="o-tel">Telefonnummer (optional)</label>
            <input id="o-tel" className="mw-feld" type="tel" autoComplete="tel" value={telefon} onChange={e => setTelefon(e.target.value)} placeholder="z. B. 0151 12345678" />
            <p className="mw-muted" style={{ fontSize:13, margin:'6px 0 20px' }}>Wird auf deinem Profil angezeigt, damit Kunden dich anrufen können.</p>

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

            <label className="mw-label" htmlFor="o-kal">Dein Kalender-Link</label>
            {!icsVerbunden ? (
              <>
                <div style={{ display:'flex', gap:8 }}>
                  <input id="o-kal" className="mw-feld" value={icsUrlInput} onChange={e => setIcsUrlInput(e.target.value)} placeholder="webcal://… oder https://…ics" />
                  <button className="mw-btn" onClick={icsVerbindenOnboarding} disabled={icsSpeichern || !icsUrlInput}>{icsSpeichern ? '…' : 'Verbinden'}</button>
                </div>
                {icsFehler && <div className="mw-meldung fehler">{icsFehler}</div>}
              </>
            ) : (
              <div className="mw-meldung ok" style={{ marginTop:0 }}>✓ Kalender verbunden. Er wird ab jetzt automatisch aktualisiert.</div>
            )}
            <KalenderAnleitung />
            <div style={{ height:20 }} />

            <button className={'mw-btn voll' + (kalenderVerbunden ? '' : ' zwei')} onClick={() => router.push('/dashboard')}>
              {kalenderVerbunden ? 'Fertig, zum Dashboard' : 'Später verbinden, zum Dashboard'}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
