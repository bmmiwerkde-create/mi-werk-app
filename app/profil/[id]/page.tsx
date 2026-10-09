'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Icon } from '../../components/Icons'
import Kopfzeile from '@/components/Kopfzeile'
import { PROFIL_FELDER } from '@/app/Lib/profilFelder'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function ProfilSeite({ params }) {
  const { id } = use(params)
  const router = useRouter()
  const [profil, setProfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState([])
  const [kalenderMonat, setKalenderMonat] = useState(new Date())
  const [bewertungen, setBewertungen] = useState([])
  const [neuerName, setNeuerName] = useState('')
  const [neueSterne, setNeueSterne] = useState(5)
  const [sterneVorschau, setSterneVorschau] = useState(null)
  const [neuerKommentar, setNeuerKommentar] = useState('')
  const [bewertungSpeichern, setBewertungSpeichern] = useState(false)
  const [bewertungFehler, setBewertungFehler] = useState('')
  const [grossesFoto, setGrossesFoto] = useState(null)
  const [nurVorschau, setNurVorschau] = useState(false)
  const [kalenderVerbunden, setKalenderVerbunden] = useState(false)

  async function bewertungenLaden() {
    const { data } = await supabase
      .from('bewertungen')
      .select('*')
      .eq('dienstleister_id', Number(id))
      .order('erstellt_am', { ascending: false })
    setBewertungen(data || [])
  }

  useEffect(() => {
    async function laden() {
      const { data: gefunden } = await supabase.from('dienstleister').select(PROFIL_FELDER).eq('id', Number(id)).single()
      // Ausgeblendete Profile sieht nur der Inhaber selbst (als Vorschau)
      const { data: { session } } = await supabase.auth.getSession()
      const istInhaber = !!gefunden && !!session && session.user.id === gefunden.user_id
      const data = gefunden && (gefunden.abo_aktiv || istInhaber) ? gefunden : null
      setNurVorschau(!!data && !data.abo_aktiv)
      setProfil(data)
      if (data) fetch('/api/kalender-status?id=' + data.id).then(r => r.json()).then(k => setKalenderVerbunden(!!k.verbunden)).catch(() => {})
      // Kalender im Hintergrund auffrischen; wurde er neu abgeholt, Termine neu laden
      if (data?.user_id) {
        fetch('/api/kalender-auffrischen', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: [data.id] }) })
          .then(r => r.json())
          .then(async a => {
            if (!a.aktualisiert?.includes(data.id)) return
            const { data: neu } = await supabase.from('kalender_events').select('*').eq('user_id', data.user_id)
            setEvents(neu || [])
          })
          .catch(() => {})
      }
      if (data?.user_id) {
        const { data: evs } = await supabase
          .from('kalender_events')
          .select('*')
          .eq('user_id', data.user_id)
        setEvents(evs || [])
      }
      await bewertungenLaden()
      setLoading(false)
    }
    laden()
  }, [id])

  async function bewertungAbsenden() {
    if (!neuerName.trim()) { setBewertungFehler('Bitte Namen angeben.'); return }
    setBewertungFehler('')
    setBewertungSpeichern(true)
    const { error } = await supabase.from('bewertungen').insert({
      dienstleister_id: Number(id),
      name: neuerName.trim(),
      sterne: neueSterne,
      kommentar: neuerKommentar.trim() || null,
    })
    setBewertungSpeichern(false)
    if (error) { setBewertungFehler('Fehler: ' + error.message); return }
    setNeuerName('')
    setNeueSterne(5)
    setNeuerKommentar('')
    await bewertungenLaden()
  }

  function istBelegt(datum) {
    return events.some(e => {
      const start = new Date(e.start_zeit)
      const end = new Date(e.end_zeit)
      const d = new Date(datum)
      d.setHours(12, 0, 0, 0)
      return d >= start && d <= end
    })
  }

  function kalenderTage() {
    const jahr = kalenderMonat.getFullYear()
    const monat = kalenderMonat.getMonth()
    const ersterTag = new Date(jahr, monat, 1)
    const letzterTag = new Date(jahr, monat + 1, 0)
    const tage = []
    const wochentag = ersterTag.getDay() === 0 ? 6 : ersterTag.getDay() - 1
    for (let i = 0; i < wochentag; i++) tage.push(null)
    for (let i = 1; i <= letzterTag.getDate(); i++) tage.push(new Date(jahr, monat, i))
    return tage
  }

  if (loading) return (
    <div><Kopfzeile aktiv="suche" /><div className="mw-laden">Laden…</div></div>
  )

  if (!profil) return (
    <div>
      <Kopfzeile aktiv="suche" />
      <div className="mw-laden" style={{ flexDirection:'column', gap:16 }}>
        <span style={{ color:'var(--mw-muted)' }}><Icon name="search" size={48} /></span>
        <h1 className="mw-h2">Profil nicht gefunden</h1>
        <a className="mw-btn zwei" href="/suche">Zur Suche</a>
      </div>
    </div>
  )

  const heute = new Date()
  heute.setHours(0, 0, 0, 0)
  const tage = kalenderTage()
  const wochentage = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
  const anzahl = bewertungen.length
  const schnitt = anzahl ? bewertungen.reduce((sum, b) => sum + b.sterne, 0) / anzahl : 0
  const zahl = (n) => n.toFixed(1).replace('.', ',')
  // Sterne inkl. halber Sterne: graue Sterne, darüber goldene, auf die passende Breite gekürzt
  const Sterne = ({ wert, groesse = undefined }: { wert: any; groesse?: number }) => (
    <span className="mw-sterne-anz" style={groesse ? { fontSize: groesse } : undefined} aria-label={zahl(Number(wert)) + ' von 5 Sternen'}>
      ★★★★★<span style={{ width: (Math.max(0, Math.min(5, Number(wert))) / 5 * 100) + '%' }}>★★★★★</span>
    </span>
  )
  const fotos = Array.isArray(profil.fotos) ? profil.fotos.filter(Boolean).slice(0, 6) : []
  const amAnfang = kalenderMonat.getFullYear() === heute.getFullYear() && kalenderMonat.getMonth() === heute.getMonth()

  return (
    <div>
      <Kopfzeile aktiv="suche" />

      {nurVorschau && (
        <div className="mw-wrap" style={{ paddingTop:16 }}>
          <div className="mw-meldung fehler" style={{ marginTop:0 }}>
            <b>Ausgeblendet:</b> Dein Profil ist zurzeit nicht öffentlich. Nur du siehst diese Vorschau.
          </div>
        </div>
      )}

      <section className="mw-profil-kopf">
        <div className="mw-titelbild">
          <div className="mw-wrap">
            {profil.logo && <div className="mw-logo-feld"><img src={profil.logo} alt={'Logo ' + profil.name} /></div>}
          </div>
        </div>
        <div className="mw-wrap">
          <div className="mw-profil-info">
            <div className="mw-avatar">
              {profil.profilbild ? <img src={profil.profilbild} alt={profil.name} /> : <Icon name="user" size={44} />}
            </div>
            <div>
              <h1 className="mw-h1" style={{ fontSize:30 }}>{profil.name}</h1>
              <div style={{ color:'var(--mw-cta)', fontWeight:600, margin:'2px 0 10px' }}>{profil.gewerk}</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {anzahl > 0
                  ? <a className="mw-chip" href="#bewertungen"><Sterne wert={schnitt} />{zahl(schnitt)} ({anzahl})</a>
                  : <span className="mw-chip">Noch keine Bewertungen</span>}
                {profil.ort && <span className="mw-chip"><Icon name="pin" size={14} />{profil.ort}{profil.postleitzahl ? ' ' + profil.postleitzahl : ''}{profil.umkreis ? ' (+' + profil.umkreis + ')' : ''}</span>}
                {profil.preis && <span className="mw-chip"><Icon name="euro" size={14} />{profil.preis}</span>}
                {profil.verfuegbar_ab && <span className="mw-chip"><Icon name="calendar" size={14} />ab {new Date(profil.verfuegbar_ab).toLocaleDateString('de-DE')}</span>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mw-wrap mw-profil-grid">
        <div>
          {fotos.length > 0 && (
            <div className="mw-karte mw-block">
              <h2 className="mw-h3">Fotos</h2>
              <div className="mw-galerie">
                {fotos.map((f, i) => (
                  <button key={f} onClick={() => setGrossesFoto(f)} aria-label={'Foto ' + (i + 1) + ' groß anzeigen'}>
                    <img src={f} alt={'Foto ' + (i + 1) + ' von ' + profil.name} loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {(profil.beschreibung || profil.qualifikationen) && (
            <div className="mw-karte mw-block">
              {profil.beschreibung && (<>
                <h2 className="mw-h3">Über mich</h2>
                <p style={{ margin:0, color:'var(--mw-text2)', lineHeight:1.7, whiteSpace:'pre-line' }}>{profil.beschreibung}</p>
              </>)}
              {profil.qualifikationen && (<>
                <h2 className="mw-h3" style={{ fontSize:17, margin: profil.beschreibung ? '20px 0 8px' : '0 0 8px' }}>Qualifikationen</h2>
                <p style={{ margin:0, color:'var(--mw-text2)', lineHeight:1.7, whiteSpace:'pre-line' }}>{profil.qualifikationen}</p>
              </>)}
            </div>
          )}

          <div className="mw-karte mw-block" id="bewertungen" style={{ scrollMarginTop:80 }}>
            <h2 className="mw-h3">Bewertungen</h2>
            {anzahl > 0 ? (
              <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:24, alignItems:'center', marginBottom:10 }}>
                <div style={{ textAlign:'center' }}>
                  <div className="mw-serif" style={{ fontSize:44, fontWeight:700, color:'var(--mw-ink)', lineHeight:1 }}>{zahl(schnitt)}</div>
                  <div style={{ margin:'4px 0' }}><Sterne wert={schnitt} groesse={18} /></div>
                  <div className="mw-muted" style={{ fontSize:13 }}>{anzahl} {anzahl === 1 ? 'Bewertung' : 'Bewertungen'}</div>
                </div>
                <div>
                  {[5, 4, 3, 2, 1].map(st => {
                    const c = bewertungen.filter(b => Math.floor(Number(b.sterne)) === st).length
                    return <div key={st} className="mw-balken"><span>{st} ★</span><div><i style={{ width: (c / anzahl * 100) + '%' }} /></div><span>{c}</span></div>
                  })}
                </div>
              </div>
            ) : (
              <p className="mw-muted" style={{ margin:'0 0 8px' }}>Noch keine Bewertungen.</p>
            )}

            {bewertungen.map((b) => (
              <div key={b.id} className="mw-bewertung">
                <div style={{ display:'flex', justifyContent:'space-between', gap:10 }}>
                  <b style={{ color:'var(--mw-ink)' }}>{b.name}</b>
                  <Sterne wert={b.sterne} />
                </div>
                {b.kommentar && <p style={{ margin:'4px 0 0', color:'var(--mw-text2)' }}>{b.kommentar}</p>}
              </div>
            ))}

            <div style={{ borderTop:'1px solid var(--mw-line)', marginTop:8, paddingTop:18 }}>
              <b style={{ color:'var(--mw-ink)' }}>Eigene Bewertung abgeben</b>
              <div style={{ display:'flex', alignItems:'center', gap:12, margin:'8px 0' }}>
                <div className="mw-stern-wahl" role="radiogroup" aria-label="Sterne wählen (halbe Sterne möglich)" onMouseLeave={() => setSterneVorschau(null)}>
                  {[1, 2, 3, 4, 5].map(n => {
                    const wert = sterneVorschau ?? neueSterne
                    const fuellung = wert >= n ? 100 : wert >= n - 0.5 ? 50 : 0
                    return (
                      <span key={n} className="mw-stern-feld">
                        <span className="mw-stern-gold" style={{ width: fuellung + '%' }}>★</span>★
                        {[n - 0.5, n].map((w, i) => (
                          <button key={w} type="button" role="radio" aria-checked={neueSterne === w} aria-label={zahl(w) + ' Sterne'}
                            className={i === 0 ? 'links' : 'rechts'} onMouseEnter={() => setSterneVorschau(w)} onFocus={() => setSterneVorschau(w)} onBlur={() => setSterneVorschau(null)} onClick={() => setNeueSterne(w)} />
                        ))}
                      </span>
                    )
                  })}
                </div>
                <b style={{ color:'var(--mw-ink)' }}>{zahl(sterneVorschau ?? neueSterne)}</b>
              </div>
              <input className="mw-feld" value={neuerName} onChange={e => setNeuerName(e.target.value)} placeholder="Dein Name" style={{ marginBottom:10 }} />
              <textarea className="mw-feld" value={neuerKommentar} onChange={e => setNeuerKommentar(e.target.value)} placeholder="Wie war deine Erfahrung? (optional)" rows={3} style={{ marginBottom:10 }} />
              <button className="mw-btn" onClick={bewertungAbsenden} disabled={bewertungSpeichern}>
                {bewertungSpeichern ? 'Speichern…' : 'Bewertung absenden'}
              </button>
              {bewertungFehler && <div className="mw-meldung fehler">{bewertungFehler}</div>}
            </div>
          </div>
        </div>

        <aside className="mw-sticky">
          <div className="mw-karte mw-block">
            <h2 className="mw-h3">Verfügbarkeit</h2>
            <div className="mw-kal-kopf">
              <button onClick={() => setKalenderMonat(new Date(kalenderMonat.getFullYear(), kalenderMonat.getMonth() - 1, 1))} aria-label="Vorheriger Monat" disabled={amAnfang} style={{ opacity: amAnfang ? 0.4 : 1 }}>←</button>
              <b style={{ color:'var(--mw-ink)' }}>{kalenderMonat.toLocaleDateString('de-DE', { month:'long', year:'numeric' })}</b>
              <button onClick={() => setKalenderMonat(new Date(kalenderMonat.getFullYear(), kalenderMonat.getMonth() + 1, 1))} aria-label="Nächster Monat">→</button>
            </div>
            <div className="mw-kal">
              {wochentage.map(w => <b key={w}>{w}</b>)}
              {tage.map((tag, i) => {
                if (!tag) return <i key={i} />
                const vergangen = tag < heute
                const belegt = !vergangen && istBelegt(tag)
                const istHeute = tag.toDateString() === heute.toDateString()
                return (
                  <i key={i} className={(vergangen ? 'v' : belegt ? 'b' : 'f') + (istHeute ? ' heute' : '')} title={vergangen ? '' : belegt ? 'belegt' : 'frei'}>
                    {tag.getDate()}
                  </i>
                )
              })}
            </div>
            <div className="mw-legende">
              <span><i style={{ background:'var(--mw-frei-bg)' }} />frei</span>
              <span><i style={{ background:'var(--mw-belegt-bg)' }} />belegt</span>
            </div>
            {events.length === 0 && (
              <p className="mw-muted" style={{ fontSize:13, margin:'12px 0 0' }}>
                {kalenderVerbunden ? 'Kalender verbunden, aktuell keine Termine eingetragen.' : 'Kein Kalender verbunden'}
              </p>
            )}
          </div>

          {!(profil.email || profil.telefon || profil.website) && nurVorschau && (
            <div className="mw-meldung fehler" style={{ marginTop:0, marginBottom:20 }}>
              Kunden können dich noch nicht erreichen: Trag im Dashboard unter „Mein Profil“ eine E-Mail, Telefonnummer oder Website ein.
            </div>
          )}

          {(profil.email || profil.telefon || profil.website) && (
          <div className="mw-karte mw-block">
            <h2 className="mw-h3">Kontakt aufnehmen</h2>
            <div style={{ display:'grid', gap:10 }}>
              {profil.email && (
                <a className="mw-btn voll" href={'mailto:' + profil.email + '?subject=Anfrage über mi-werk.de'}><Icon name="mail" size={18} />E-Mail senden</a>
              )}
              {profil.telefon && (
                <a className="mw-btn zwei voll" href={'tel:' + profil.telefon}><Icon name="phone" size={18} />{profil.telefon}</a>
              )}
              {profil.website && (
                <a className="mw-btn zwei voll" href={profil.website.startsWith('http') ? profil.website : 'https://' + profil.website} target="_blank" rel="noopener noreferrer"><Icon name="globe" size={18} />Website ansehen</a>
              )}
            </div>
          </div>
          )}

          <div className="mw-karte mw-block">
            <h2 className="mw-h3">Details</h2>
            {[
              ['Gewerk', profil.gewerk],
              ['Standort', profil.ort],
              ['Umkreis', profil.umkreis],
              ['Preis', profil.preis],
              ['Verfügbar ab', profil.verfuegbar_ab ? new Date(profil.verfuegbar_ab).toLocaleDateString('de-DE') : null],
            ].filter(item => item[1]).map(item => (
              <div key={item[0]} className="mw-detail"><span className="mw-muted">{item[0]}</span><span style={{ textAlign:'right' }}>{item[1]}</span></div>
            ))}
          </div>
        </aside>
      </div>

      {grossesFoto && (
        <button className="mw-lightbox" onClick={() => setGrossesFoto(null)} aria-label="Foto schließen">
          <img src={grossesFoto} alt="" />
        </button>
      )}
    </div>
  )
}
