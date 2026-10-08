'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'
import { supabase } from '../Lib/supabase'
import { Icon } from '../components/Icons'
import Kopfzeile from '@/components/Kopfzeile'

type Dienstleister = {
  id: string; name: string; gewerk: string; ort: string
  beschreibung: string; preis: string; emoji: string
  profilbild?: string; telefon?: string; website?: string
  qualifikationen?: string; user_id?: string; postleitzahl?: string
  abo_aktiv?: boolean; stripe_customer_id?: string | null; ics_url?: string | null
  logo?: string | null; fotos?: string[] | null
}

const MAX_FOTOS = 6
const MAX_BYTES = 5 * 1024 * 1024
type Reiter = 'profil' | 'bilder' | 'kalender' | 'abo' | 'konto'


export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profil, setProfil] = useState<Dienstleister | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState<Partial<Dienstleister>>({})
  const [message, setMessage] = useState('')
  const [bildLaden, setBildLaden] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [reiter, setReiter] = useState<Reiter>('profil')
  const [bildMeldung, setBildMeldung] = useState('')
  const [logoLaden, setLogoLaden] = useState(false)
  const [fotosLaden, setFotosLaden] = useState(false)
  const { data: googleSession } = useSession()
  const [kalenderEvents, setKalenderEvents] = useState<any[]>([])
  const [kalenderLaden, setKalenderLaden] = useState(false)
  const [icsUrlInput, setIcsUrlInput] = useState('')
  const [icsSpeichern, setIcsSpeichern] = useState(false)
  const [icsEvents, setIcsEvents] = useState<any[] | null>(null)
  const [icsFehler, setIcsFehler] = useState('')
  const [portalLaden, setPortalLaden] = useState(false)
  const [portalFehler, setPortalFehler] = useState('')

  async function kalenderAbrufen() {
    setKalenderLaden(true)
    const res = await fetch('/api/kalender?userId=' + user?.id)
    const data = await res.json()
    if (data.events) setKalenderEvents(data.events)
    setKalenderLaden(false)
  }

  async function aboVerwalten() {
    setPortalLaden(true)
    setPortalFehler('')
    try {
      const res = await fetch('/api/stripe-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else setPortalFehler(data.error || 'Portal konnte nicht geöffnet werden')
    } catch (err) {
      setPortalFehler('Portal konnte nicht geöffnet werden')
    }
    setPortalLaden(false)
  }

  useEffect(() => { checkUser() }, [])

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }
    setUser(session.user)
    await loadProfil(session.user.id)
    setLoading(false)
  }

  async function loadProfil(userId: string) {
    const { data } = await supabase.from('dienstleister').select('*').eq('user_id', userId).single()
    if (data) { setProfil(data); setForm(data); setIcsUrlInput(data.ics_url || '') }
  }

  async function icsVerbinden() {
    if (!icsUrlInput || !user) return
    setIcsSpeichern(true)
    setIcsFehler('')
    const { error } = await supabase.from('dienstleister').update({ ics_url: icsUrlInput }).eq('user_id', user.id)
    if (error) { setIcsFehler('Fehler: ' + error.message); setIcsSpeichern(false); return }
    const res = await fetch('/api/kalender-ics?userId=' + user.id)
    const data = await res.json()
    if (data.events) setIcsEvents(data.events)
    else { setIcsEvents(null); setIcsFehler(data.error || 'Kalender konnte nicht abgerufen werden') }
    setIcsSpeichern(false)
  }

  async function bildHochladen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setBildLaden(true)
    setMessage('')
    const ext = file.name.split('.').pop()
    const pfad = user.id + '.' + ext
    const { error: uploadError } = await supabase.storage.from('profilbilder').upload(pfad, file, { upsert: true })
    if (uploadError) { setMessage('Fehler beim Upload: ' + uploadError.message); setBildLaden(false); return }
    const { data: urlData } = supabase.storage.from('profilbilder').getPublicUrl(pfad)
    const bildUrl = urlData.publicUrl + '?t=' + Date.now()
    const { error: updateError } = await supabase.from('dienstleister').update({ profilbild: bildUrl }).eq('user_id', user.id)
    if (updateError) { setMessage('Fehler: ' + updateError.message) }
    else { setMessage('Profilbild gespeichert'); await loadProfil(user.id) }
    setBildLaden(false)
  }

  function bildPruefen(file: File) {
    if (!file.type.startsWith('image/')) return 'Bitte nur Bilder (JPG, PNG, WebP) hochladen.'
    if (file.size > MAX_BYTES) return 'Das Bild ist zu groß (höchstens 5 MB).'
    return ''
  }

  // Pfad einer Datei im Speicher "profilbilder" aus ihrer öffentlichen Adresse lesen
  function pfadAusUrl(url?: string | null) {
    if (!url) return null
    const teil = url.split('/profilbilder/')[1]
    return teil ? decodeURIComponent(teil.split('?')[0]) : null
  }

  async function datenHochladen(file: File, name: string) {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const pfad = user.id + '-' + name + '-' + Date.now() + '.' + ext
    const { error } = await supabase.storage.from('profilbilder').upload(pfad, file, { contentType: file.type })
    if (error) throw error
    return supabase.storage.from('profilbilder').getPublicUrl(pfad).data.publicUrl
  }

  async function logoHochladen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !user || !profil) return
    const fehler = bildPruefen(file)
    if (fehler) { setBildMeldung('Fehler: ' + fehler); return }
    setLogoLaden(true); setBildMeldung('')
    try {
      const url = await datenHochladen(file, 'logo')
      const { error } = await supabase.from('dienstleister').update({ logo: url }).eq('user_id', user.id)
      if (error) throw error
      const alt = pfadAusUrl(profil.logo)
      if (alt) await supabase.storage.from('profilbilder').remove([alt])
      setBildMeldung('Logo gespeichert'); await loadProfil(user.id)
    } catch (err: any) { setBildMeldung('Fehler beim Upload: ' + (err?.message || err)) }
    setLogoLaden(false)
  }

  async function logoEntfernen() {
    if (!user || !profil?.logo) return
    const { error } = await supabase.from('dienstleister').update({ logo: null }).eq('user_id', user.id)
    if (error) { setBildMeldung('Fehler: ' + error.message); return }
    const alt = pfadAusUrl(profil.logo)
    if (alt) await supabase.storage.from('profilbilder').remove([alt])
    setBildMeldung('Logo entfernt'); await loadProfil(user.id)
  }

  async function fotosHochladen(e: React.ChangeEvent<HTMLInputElement>) {
    const dateien = Array.from(e.target.files || [])
    e.target.value = ''
    if (!dateien.length || !user || !profil) return
    const vorhanden = profil.fotos || []
    const frei = MAX_FOTOS - vorhanden.length
    if (frei <= 0) { setBildMeldung('Fehler: Du hast schon ' + MAX_FOTOS + ' Fotos. Entferne erst eins.'); return }
    const auswahl = dateien.slice(0, frei)
    for (const f of auswahl) { const fehler = bildPruefen(f); if (fehler) { setBildMeldung('Fehler: ' + f.name + ': ' + fehler); return } }
    setFotosLaden(true); setBildMeldung('')
    try {
      const neu: string[] = []
      for (const f of auswahl) neu.push(await datenHochladen(f, 'foto'))
      const { error } = await supabase.from('dienstleister').update({ fotos: [...vorhanden, ...neu] }).eq('user_id', user.id)
      if (error) throw error
      setBildMeldung(dateien.length > frei ? `${neu.length} Foto(s) gespeichert. Mehr als ${MAX_FOTOS} Fotos sind nicht möglich.` : `${neu.length} Foto(s) gespeichert`)
      await loadProfil(user.id)
    } catch (err: any) { setBildMeldung('Fehler beim Upload: ' + (err?.message || err)) }
    setFotosLaden(false)
  }

  async function fotoEntfernen(url: string) {
    if (!user || !profil) return
    const rest = (profil.fotos || []).filter(f => f !== url)
    const { error } = await supabase.from('dienstleister').update({ fotos: rest }).eq('user_id', user.id)
    if (error) { setBildMeldung('Fehler: ' + error.message); return }
    const pfad = pfadAusUrl(url)
    if (pfad) await supabase.storage.from('profilbilder').remove([pfad])
    setBildMeldung('Foto entfernt'); await loadProfil(user.id)
  }

  async function saveProfil() {
    if (!user) return
    setSaving(true)
    setMessage('')
    const payload = { ...form, user_id: user.id }
    const { data: gespeichert, error } = profil?.id
      ? await supabase.from('dienstleister').update(payload).eq('id', profil.id).select('id').single()
      : await supabase.from('dienstleister').insert({ ...payload, abo_aktiv: true }).select('id').single()
    if (error) { setMessage('Fehler: ' + error.message) }
    else {
      setMessage('Gespeichert'); setEditMode(false); await loadProfil(user.id)
      if (gespeichert?.id && form.ort) {
        fetch('/api/geocode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dienstleisterId: gespeichert.id, ort: form.ort, postleitzahl: form.postleitzahl }),
        }).catch(() => {})
      }
    }
    setSaving(false)
  }

  async function logout() { await supabase.auth.signOut(); router.push('/') }

  const firstName = profil?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'dort'

  if (loading) return (
    <div><Kopfzeile aktiv="dashboard" /><div className="mw-laden">Laden…</div></div>
  )

  const fotos = profil?.fotos || []
  const istFehler = (m: string) => m.startsWith('Fehler')
  const menu: [Reiter, string, string][] = [
    ['profil', 'Mein Profil', 'user'],
    ['bilder', 'Logo und Fotos', 'eye'],
    ['kalender', 'Kalender', 'calendar'],
    ['abo', 'Abo', 'euro'],
    ['konto', 'Konto', 'lock'],
  ]

  return (
    <div>
      <Kopfzeile aktiv="dashboard" />
      <div className="mw-wrap mw-dash">
        <nav className="mw-karte mw-dash-menu" aria-label="Dashboard-Bereiche">
          {menu.map(([key, text, icon]) => (
            <button key={key} className={reiter === key ? 'an' : ''} onClick={() => setReiter(key)}><Icon name={icon} size={18} />{text}</button>
          ))}
        </nav>

        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, flexWrap:'wrap', marginBottom:20 }}>
            <div>
              <h1 className="mw-h1" style={{ fontSize:30 }}>Willkommen, {firstName}</h1>
              <p className="mw-muted" style={{ margin:'4px 0 0' }}>{profil ? 'Hier verwaltest du dein Profil.' : 'Leg dein Profil an.'}</p>
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {profil?.id && <a className="mw-btn zwei klein" href={'/profil/' + profil.id}>Mein Profil ansehen</a>}
              <button className="mw-btn zwei klein" onClick={logout}>Abmelden</button>
            </div>
          </div>

          {reiter === 'profil' && (
            <div className="mw-karte mw-block">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, marginBottom:16 }}>
                <div>
                  <h2 className="mw-h3">Öffentliches Profil</h2>
                  <div className="mw-muted" style={{ fontSize:14 }}>So sehen dich Kunden auf mi-werk.de</div>
                </div>
                {!editMode && <button className="mw-btn zwei klein" onClick={() => setEditMode(true)}>Bearbeiten</button>}
              </div>
              <div className="mw-zwei-spalten" style={{ marginBottom:14 }}>
                <Field label="Name" value={form.name || ''} edit={editMode} onChange={v => setForm(f=>({...f,name:v}))} />
                <Field label="Gewerk / Kategorie" value={form.gewerk || ''} edit={editMode} onChange={v => setForm(f=>({...f,gewerk:v}))} />
                <Field label="Ort" value={form.ort || ''} edit={editMode} onChange={v => setForm(f=>({...f,ort:v}))} />
                <Field label="PLZ" value={form.postleitzahl || ''} edit={editMode} onChange={v => setForm(f=>({...f,postleitzahl:v}))} placeholder="z. B. 44787" />
                <Field label="Preis" value={form.preis || ''} edit={editMode} onChange={v => setForm(f=>({...f,preis:v}))} placeholder="z. B. ab 50 €/Std." />
                <Field label="Telefon (optional)" value={form.telefon || ''} edit={editMode} onChange={v => setForm(f=>({...f, telefon:v}))} placeholder="z. B. 0151 12345678" />
                <Field label="Website (optional)" value={form.website || ''} edit={editMode} onChange={v => setForm(f=>({...f, website:v}))} placeholder="z. B. www.meine-seite.de" />
              </div>
              <Feldtext label="Beschreibung" value={form.beschreibung || ''} edit={editMode} onChange={v => setForm(f=>({...f,beschreibung:v}))} placeholder="Was bietest du an?" leer="Noch keine Beschreibung" />
              <Feldtext label="Qualifikationen (optional)" value={form.qualifikationen || ''} edit={editMode} onChange={v => setForm(f=>({...f, qualifikationen:v}))} placeholder="z. B. Meisterbrief, 10 Jahre Erfahrung …" leer="–" />
              {editMode && (
                <div style={{ display:'flex', gap:10, marginTop:20 }}>
                  <button className="mw-btn" onClick={saveProfil} disabled={saving}>{saving ? 'Speichern…' : 'Speichern'}</button>
                  <button className="mw-btn zwei" onClick={() => { setEditMode(false); setForm(profil || {}) }}>Abbrechen</button>
                </div>
              )}
              {message && <div className={'mw-meldung ' + (istFehler(message) ? 'fehler' : 'ok')}>{message}</div>}
            </div>
          )}

          {reiter === 'bilder' && (
            <>
              {!profil && <div className="mw-meldung fehler" style={{ marginTop:0, marginBottom:16 }}>Bitte lege zuerst unter „Mein Profil“ dein Profil an.</div>}
              <div className="mw-karte mw-block">
                <h2 className="mw-h3">Profilbild</h2>
                <div className="mw-upload-reihe">
                  <div className="mw-upload-bild">{profil?.profilbild ? <img src={profil.profilbild} alt="Profilbild" /> : <Icon name="user" size={36} />}</div>
                  <div>
                    <p className="mw-muted" style={{ margin:'0 0 10px', fontSize:14 }}>Ein Foto von dir. JPG oder PNG.</p>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={bildHochladen} hidden />
                    <button className="mw-btn zwei klein" onClick={() => fileInputRef.current?.click()} disabled={bildLaden || !profil}>{bildLaden ? 'Wird hochgeladen…' : 'Bild auswählen'}</button>
                  </div>
                </div>
                {message && reiter === 'bilder' && <div className={'mw-meldung ' + (istFehler(message) ? 'fehler' : 'ok')}>{message}</div>}
              </div>

              <div className="mw-karte mw-block">
                <h2 className="mw-h3">Logo</h2>
                <div className="mw-upload-reihe">
                  <div className="mw-upload-bild eckig">{profil?.logo ? <img src={profil.logo} alt="Logo" /> : <span style={{ fontSize:13 }}>Logo</span>}</div>
                  <div>
                    <p className="mw-muted" style={{ margin:'0 0 10px', fontSize:14 }}>Dein Firmenlogo, am besten PNG mit transparentem Hintergrund. Höchstens 5 MB.</p>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      <label className={'mw-btn zwei klein'} style={{ opacity: (logoLaden || !profil) ? 0.6 : 1, pointerEvents: (logoLaden || !profil) ? 'none' : 'auto' }}>
                        {logoLaden ? 'Wird hochgeladen…' : profil?.logo ? 'Logo ersetzen' : 'Logo auswählen'}
                        <input type="file" accept="image/*" onChange={logoHochladen} hidden />
                      </label>
                      {profil?.logo && <button className="mw-link" onClick={logoEntfernen}>Entfernen</button>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mw-karte mw-block">
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                  <h2 className="mw-h3">Fotos</h2>
                  <span className="mw-muted" style={{ fontSize:14 }}>{fotos.length} von {MAX_FOTOS}</span>
                </div>
                <p className="mw-muted" style={{ margin:'0 0 14px', fontSize:14 }}>Bis zu {MAX_FOTOS} Fotos von deiner Arbeit, deinen Räumen oder deinem Team. Je höchstens 5 MB.</p>
                <div className="mw-fotos">
                  {fotos.map((f, i) => (
                    <div key={f} className="mw-foto-slot voll">
                      <img src={f} alt={'Foto ' + (i + 1)} />
                      <button className="mw-foto-weg" onClick={() => fotoEntfernen(f)} aria-label={'Foto ' + (i + 1) + ' entfernen'}>×</button>
                    </div>
                  ))}
                  {fotos.length < MAX_FOTOS && (
                    <label className="mw-foto-slot" style={{ opacity: (fotosLaden || !profil) ? 0.6 : 1, pointerEvents: (fotosLaden || !profil) ? 'none' : 'auto' }}>
                      <Icon name="eye" size={22} />
                      <span>{fotosLaden ? 'Wird hochgeladen…' : 'Fotos hinzufügen'}</span>
                      <input type="file" accept="image/*" multiple onChange={fotosHochladen} hidden />
                    </label>
                  )}
                </div>
                {bildMeldung && <div className={'mw-meldung ' + (istFehler(bildMeldung) ? 'fehler' : 'ok')}>{bildMeldung}</div>}
              </div>
            </>
          )}

          {reiter === 'kalender' && (
            <div className="mw-karte mw-block">
              <h2 className="mw-h3">Kalender verbinden</h2>
              <div className="mw-hinweis" style={{ marginBottom:16 }}>
                <Icon name="lock" size={18} /><span>Kunden sehen nur, ob du <b>frei oder belegt</b> bist, nie Titel, Ort oder Details deiner Termine.</span>
              </div>

              <h3 className="mw-label" style={{ fontSize:15, marginTop:4 }}>Google Kalender</h3>
              {!googleSession ? (
                <button className="mw-kal-knopf" onClick={() => signIn('google', { callbackUrl: 'https://www.mi-werk.de/dashboard' })}><Icon name="calendar" size={20} />Mit Google verbinden</button>
              ) : (
                <div style={{ marginBottom:14 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, marginBottom:10, flexWrap:'wrap' }}>
                    <div style={{ color:'var(--mw-frei)', fontSize:14 }}>✓ Google Kalender verbunden ({googleSession.user?.email})</div>
                    <button className="mw-link" onClick={() => signOut()}>Trennen</button>
                  </div>
                  <button className="mw-btn klein" onClick={kalenderAbrufen} disabled={kalenderLaden}>{kalenderLaden ? 'Lädt…' : 'Termine abrufen'}</button>
                  {kalenderEvents.length > 0 && <div className="mw-meldung ok">✓ {kalenderEvents.length} Termine synchronisiert. Kunden sehen nur frei/belegt.</div>}
                </div>
              )}

              <h3 className="mw-label" style={{ fontSize:15, marginTop:16 }}>Outlook Kalender</h3>
              {!googleSession || googleSession.provider !== 'microsoft-entra-id' ? (
                <button className="mw-kal-knopf" onClick={() => signIn('microsoft-entra-id', { callbackUrl: 'https://www.mi-werk.de/dashboard' })}><Icon name="mail" size={20} />Mit Outlook verbinden</button>
              ) : (
                <div style={{ color:'var(--mw-frei)', fontSize:14, marginBottom:14 }}>✓ Outlook verbunden ({googleSession.user?.email})</div>
              )}

              <h3 className="mw-label" style={{ fontSize:15, marginTop:16 }}>iPhone / Apple-Kalender</h3>
              <p className="mw-muted" style={{ fontSize:14, margin:'0 0 8px', lineHeight:1.6 }}>
                Auf dem iPhone: <b>Kalender-App öffnen → unten auf das Kalender-Symbol → beim iCloud-Kalender auf ⓘ → „Öffentlicher Kalender“ einschalten → „Link teilen …“ → „Kopieren“</b> und hier einfügen. Neue Termine übernimmst du mit einem erneuten Tipp auf „Verbinden“.
              </p>
              <div style={{ display:'flex', gap:8 }}>
                <input className="mw-feld" value={icsUrlInput} onChange={e => setIcsUrlInput(e.target.value)} placeholder="webcal://… oder https://…" />
                <button className="mw-btn" onClick={icsVerbinden} disabled={icsSpeichern || !icsUrlInput}>{icsSpeichern ? 'Verbinde…' : 'Verbinden'}</button>
              </div>
              {icsEvents && (
                <div className="mw-meldung ok">
                  {icsEvents.length > 0
                    ? `✓ Verbunden: ${icsEvents.length} ${icsEvents.length === 1 ? 'Termin' : 'Termine'} der nächsten 3 Monate übernommen. Kunden sehen nur frei/belegt.`
                    : '✓ Kalender verbunden. In den nächsten 3 Monaten sind keine Termine eingetragen, daher ist alles als frei markiert.'}
                </div>
              )}
              {!icsEvents && profil?.ics_url && !icsFehler && (
                <p className="mw-muted" style={{ fontSize:13, margin:'10px 0 0' }}>Ein iPhone-Kalender ist hinterlegt. Tippe auf „Verbinden“, um neue Termine zu übernehmen.</p>
              )}
              {icsFehler && <div className="mw-meldung fehler">{icsFehler}</div>}
            </div>
          )}

          {reiter === 'abo' && (
            <div className="mw-karte mw-block">
              <h2 className="mw-h3">Abo verwalten</h2>
              {profil?.stripe_customer_id ? (
                <>
                  <p className="mw-muted" style={{ margin:'0 0 14px' }}>Zahlungsmethode ändern oder Abo kündigen verwaltest du direkt bei Stripe.</p>
                  <button className="mw-btn" onClick={aboVerwalten} disabled={portalLaden}>{portalLaden ? 'Öffnet…' : 'Abo verwalten'}</button>
                </>
              ) : profil ? (
                <>
                  <p className="mw-muted" style={{ margin:'0 0 14px' }}>Du bist aktuell in der kostenlosen Phase. Sobald du ein Abo abgeschlossen hast, kannst du hier Zahlungsmethode und Kündigung verwalten.</p>
                  <button className="mw-btn zwei" onClick={() => router.push('/abo')}>Abo abschließen</button>
                </>
              ) : (
                <>
                  <p className="mw-muted" style={{ margin:'0 0 14px' }}>Bitte lege zuerst dein Profil an, bevor du ein Abo abschließt.</p>
                  <button className="mw-btn zwei" onClick={() => { setReiter('profil'); setEditMode(true) }}>Profil anlegen</button>
                </>
              )}
              {portalFehler && <div className="mw-meldung fehler">{portalFehler}</div>}
            </div>
          )}

          {reiter === 'konto' && (
            <div className="mw-karte mw-block">
              <h2 className="mw-h3">Konto</h2>
              {[['E-Mail', user?.email], ['Mitglied seit', user?.created_at ? new Date(user.created_at).toLocaleDateString('de-DE') : '-'], ['Konto-ID', user?.id]].map(([k, v]) => (
                <div key={k} className="mw-detail">
                  <span className="mw-muted">{k}</span>
                  <span style={{ fontSize: k === 'Konto-ID' ? 12 : 14, color: k === 'Konto-ID' ? 'var(--mw-muted)' : 'inherit', overflowWrap:'anywhere', textAlign:'right' }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, edit, onChange, placeholder }: { label: string; value: string; edit: boolean; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <div className="mw-label">{label}</div>
      {edit ? (
        <input className="mw-feld" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || label} />
      ) : (
        <div style={{ fontSize:15, color: value ? 'var(--mw-text)' : 'var(--mw-muted)', padding:'8px 0', borderBottom:'1px solid var(--mw-line)' }}>{value || '–'}</div>
      )}
    </div>
  )
}

function Feldtext({ label, value, edit, onChange, placeholder, leer }: { label: string; value: string; edit: boolean; onChange: (v: string) => void; placeholder?: string; leer: string }) {
  return (
    <div style={{ marginBottom:14 }}>
      <div className="mw-label">{label}</div>
      {edit ? (
        <textarea className="mw-feld" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={4} />
      ) : (
        <div style={{ fontSize:15, color: value ? 'var(--mw-text)' : 'var(--mw-muted)', lineHeight:1.7, whiteSpace:'pre-line' }}>{value || leer}</div>
      )}
    </div>
  )
}
