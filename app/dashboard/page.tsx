'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'
import { supabase } from '../Lib/supabase'

type Dienstleister = {
  id: string; name: string; gewerk: string; ort: string
  beschreibung: string; preis: string; emoji: string
  profilbild?: string; telefon?: string; website?: string
  qualifikationen?: string; user_id?: string
}

const C = {
  copper:'#c8956c', copperBord:'rgba(200,149,108,0.22)',
  bg:'#0A0A0A', bg2:'#111111', bg3:'#181818',
  border:'rgba(255,255,255,0.06)', text:'#E8DDD4',
  textMid:'#9A8878', textDim:'#5A5550',
  green:'#27AE60', red:'#C0392B',
}

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
  const { data: googleSession } = useSession()
  const [kalenderEvents, setKalenderEvents] = useState<any[]>([])
  const [kalenderLaden, setKalenderLaden] = useState(false)

  async function kalenderAbrufen() {
    setKalenderLaden(true)
    const res = await fetch('/api/kalender?userId=' + user?.id)
    const data = await res.json()
    if (data.events) setKalenderEvents(data.events)
    setKalenderLaden(false)
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
    if (data) { setProfil(data); setForm(data) }
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

  async function saveProfil() {
    if (!user) return
    setSaving(true)
    setMessage('')
    const payload = { ...form, user_id: user.id }
    const { error } = profil?.id
      ? await supabase.from('dienstleister').update(payload).eq('id', profil.id)
      : await supabase.from('dienstleister').insert(payload)
    if (error) { setMessage('Fehler: ' + error.message) }
    else { setMessage('Gespeichert'); setEditMode(false); await loadProfil(user.id) }
    setSaving(false)
  }

  async function logout() { await supabase.auth.signOut(); router.push('/') }

  const firstName = profil?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'dort'

  if (loading) return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <span style={{ color:C.copper }}>Laden</span>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:C.bg, color:C.text, fontFamily:'system-ui' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', height:52, background:C.bg2, borderBottom:'1px solid ' + C.copperBord, position:'sticky', top:0, zIndex:100 }}>
        <div style={{ fontFamily:'Georgia,serif', fontSize:19, fontWeight:700, cursor:'pointer' }} onClick={() => router.push('/')}>Mi-<span style={{ color:C.copper }}>Werk</span></div>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <span style={{ fontSize:12, color:C.textMid }}>{user?.email}</span>
          <button onClick={logout} style={{ fontSize:11, color:C.textDim, cursor:'pointer', padding:'5px 12px', borderRadius:6, border:'1px solid ' + C.border, background:'none', fontFamily:'inherit' }}>Abmelden</button>
        </div>
      </div>

      <div style={{ maxWidth:660, margin:'0 auto', padding:'28px 20px', display:'flex', flexDirection:'column', gap:14 }}>

        <div style={{ marginBottom:4 }}>
          <div style={{ fontSize:22, fontWeight:500, marginBottom:4 }}>Willkommen, <span style={{ color:C.copper }}>{firstName}</span></div>
          <div style={{ fontSize:12, color:C.textDim }}>{profil ? 'Hier kannst du dein Profil verwalten.' : 'Leg dein Profil an.'}</div>
        </div>

        <div style={{ background:C.bg2, border:'1px solid ' + C.border, borderRadius:12, padding:20 }}>
          <div style={{ fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:1, color:C.textDim, marginBottom:16 }}>Profilbild</div>
          <div style={{ display:'flex', alignItems:'center', gap:20 }}>
            <div style={{ width:80, height:80, borderRadius:'50%', overflow:'hidden', background:C.bg3, border:'2px solid ' + C.copperBord, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {profil?.profilbild ? <img src={profil.profilbild} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <span style={{ fontSize:32 }}>{profil?.emoji || '🔧'}</span>}
            </div>
            <div>
              <div style={{ fontSize:13, color:C.textMid, marginBottom:10 }}>{profil?.profilbild ? 'Profilbild hochgeladen' : 'Noch kein Profilbild'}</div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={bildHochladen} style={{ display:'none' }} />
              <button onClick={() => fileInputRef.current?.click()} disabled={bildLaden} style={{ fontSize:12, padding:'7px 16px', borderRadius:7, border:'1px solid ' + C.copperBord, background:'transparent', color:C.copper, cursor:'pointer', fontFamily:'inherit' }}>
                {bildLaden ? 'Wird hochgeladen...' : 'Bild hochladen'}
              </button>
            </div>
          </div>
        </div>

        <div style={{ background:C.bg2, border:'1px solid ' + C.border, borderRadius:12 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid ' + C.border }}>
            <div>
              <div style={{ fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:1, color:C.textDim, marginBottom:2 }}>Öffentliches Profil</div>
              <div style={{ fontSize:12, color:C.textDim }}>So sehen dich Kunden auf mi-werk.de</div>
            </div>
            {!editMode && <button onClick={() => setEditMode(true)} style={{ fontSize:12, padding:'7px 16px', borderRadius:7, border:'1px solid ' + C.border, background:'transparent', color:C.textMid, cursor:'pointer', fontFamily:'inherit' }}>Bearbeiten</button>}
          </div>
          <div style={{ padding:'20px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
              <Field label="Name" value={form.name || ''} edit={editMode} onChange={v => setForm(f=>({...f,name:v}))} />
              <Field label="Gewerk / Kategorie" value={form.gewerk || ''} edit={editMode} onChange={v => setForm(f=>({...f,gewerk:v}))} />
              <Field label="Ort" value={form.ort || ''} edit={editMode} onChange={v => setForm(f=>({...f,ort:v}))} />
              <Field label="Preis" value={form.preis || ''} edit={editMode} onChange={v => setForm(f=>({...f,preis:v}))} placeholder="z.B. ab 50 Euro/Std." />
              <Field label="Emoji" value={form.emoji || ''} edit={editMode} onChange={v => setForm(f=>({...f,emoji:v}))} placeholder="z.B. 🔧" />
            </div>
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:10, fontWeight:500, textTransform:'uppercase' as const, letterSpacing:'0.8px', color:C.textDim, marginBottom:6 }}>Beschreibung</div>
              {editMode ? (
                <textarea value={form.beschreibung || ''} onChange={e => setForm(f=>({...f,beschreibung:e.target.value}))} placeholder="Was bietest du an?"
                  style={{ width:'100%', background:C.bg3, border:'1px solid ' + C.border, borderRadius:8, padding:'9px 12px', fontSize:13, color:C.text, fontFamily:'inherit', outline:'none', resize:'vertical', minHeight:90 }} />
              ) : (
                <div style={{ fontSize:13, color: form.beschreibung ? C.text : C.textDim, lineHeight:1.7 }}>{form.beschreibung || 'Noch keine Beschreibung'}</div>
              )}
            </div>
            <div style={{ borderTop:'1px solid ' + C.border, paddingTop:14, marginBottom:14 }}>
              <div style={{ fontSize:10, fontWeight:500, textTransform:'uppercase' as const, letterSpacing:1, color:C.textDim, marginBottom:12 }}>Optional</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                <Field label="Telefon" value={(form as any).telefon || ''} edit={editMode} onChange={v => setForm(f=>({...f, telefon:v} as any))} placeholder="z.B. 0151 12345678" />
                <Field label="Website" value={(form as any).website || ''} edit={editMode} onChange={v => setForm(f=>({...f, website:v} as any))} placeholder="z.B. www.meine-seite.de" />
              </div>
              <div>
                <div style={{ fontSize:10, fontWeight:500, textTransform:'uppercase' as const, letterSpacing:'0.8px', color:C.textDim, marginBottom:6 }}>Qualifikationen</div>
                {editMode ? (
                  <textarea value={(form as any).qualifikationen || ''} onChange={e => setForm(f=>({...f, qualifikationen:e.target.value} as any))} placeholder="z.B. Meisterbrief, 10 Jahre Erfahrung..."
                    style={{ width:'100%', background:C.bg3, border:'1px solid ' + C.border, borderRadius:8, padding:'9px 12px', fontSize:13, color:C.text, fontFamily:'inherit', outline:'none', resize:'vertical', minHeight:70 }} />
                ) : (
                  <div style={{ fontSize:13, color: (form as any).qualifikationen ? C.text : C.textDim, lineHeight:1.7 }}>{(form as any).qualifikationen || '-'}</div>
                )}
              </div>
            </div>
            {!editMode && profil && (
              <div style={{ marginTop:20, paddingTop:18, borderTop:'1px solid ' + C.border }}>
                <div style={{ fontSize:10, fontWeight:500, textTransform:'uppercase', letterSpacing:1, color:C.textDim, marginBottom:10 }}>Vorschau</div>
                <div style={{ display:'flex', alignItems:'center', gap:14, background:C.bg3, border:'1px solid ' + C.copperBord, borderRadius:10, padding:'14px 16px' }}>
                  <div style={{ width:48, height:48, borderRadius:'50%', overflow:'hidden', background:C.bg2, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {profil.profilbild ? <img src={profil.profilbild} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <span style={{ fontSize:24 }}>{profil.emoji || '🔧'}</span>}
                  </div>
                  <div>
                    <div style={{ fontSize:15, fontWeight:500, marginBottom:3 }}>{profil.name}</div>
                    <div style={{ fontSize:12, color:C.textMid, marginBottom:2 }}>{profil.gewerk} · {profil.ort}</div>
                    <div style={{ fontSize:12, color:C.copper }}>{profil.preis}</div>
                  </div>
                </div>
              </div>
            )}
            {editMode && (
              <div style={{ display:'flex', gap:10, marginTop:20 }}>
                <button onClick={saveProfil} disabled={saving} style={{ padding:'10px 22px', borderRadius:8, background:C.copper, color:'#fff', fontSize:13, fontWeight:500, border:'none', cursor:'pointer', fontFamily:'inherit', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Speichern...' : 'Speichern'}
                </button>
                <button onClick={() => { setEditMode(false); setForm(profil || {}) }} style={{ padding:'10px 16px', borderRadius:8, background:'transparent', color:C.textMid, fontSize:13, border:'1px solid ' + C.border, cursor:'pointer', fontFamily:'inherit' }}>
                  Abbrechen
                </button>
              </div>
            )}
            {message && (
              <div style={{ marginTop:12, fontSize:13, padding:'8px 12px', borderRadius:7, background:'rgba(255,255,255,0.04)', color: message.startsWith('Fehler') ? C.red : C.green }}>
                {message}
              </div>
            )}
          </div>
        </div>

        <div style={{ background:C.bg2, border:'1px solid ' + C.border, borderRadius:12, padding:20 }}>
          <div style={{ fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:1, color:C.textDim, marginBottom:16 }}>Google Kalender</div>
          {!googleSession ? (
            <div>
              <div style={{ fontSize:13, color:C.textMid, marginBottom:12 }}>Verbinde deinen Google Kalender — Kunden sehen automatisch wann du verfügbar bist.</div>
              <button onClick={() => signIn('google', { callbackUrl: 'https://mi-werk.de/dashboard' })} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 20px', background:'#fff', color:'#333', border:'none', borderRadius:8, fontSize:13, fontWeight:500, cursor:'pointer', fontFamily:'inherit' }}>
                <span style={{ fontSize:16 }}>📅</span> Mit Google verbinden
              </button>
            </div>
          ) : (
            <div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                <div style={{ fontSize:13, color:C.green }}>✓ Google Kalender verbunden ({googleSession.user?.email})</div>
                <button onClick={() => signOut()} style={{ fontSize:11, color:C.textDim, background:'none', border:'1px solid ' + C.border, borderRadius:6, padding:'4px 10px', cursor:'pointer', fontFamily:'inherit' }}>Trennen</button>
              </div>
              <button onClick={kalenderAbrufen} disabled={kalenderLaden} style={{ fontSize:12, padding:'8px 16px', borderRadius:8, background:C.copper, color:'#fff', border:'none', cursor:'pointer', fontFamily:'inherit', marginBottom:12 }}>
                {kalenderLaden ? 'Lädt...' : 'Termine abrufen'}
              </button>
              {kalenderEvents.length > 0 && (
                <div style={{ fontSize:12, color:C.green, marginTop:8 }}>
                  ✓ {kalenderEvents.length} Termine synchronisiert — Kunden sehen nur frei/belegt.
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ background:C.bg2, border:'1px solid ' + C.border, borderRadius:12, padding:20 }}>
          <div style={{ fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:1, color:C.textDim, marginBottom:16 }}>Outlook Kalender</div>
          {!googleSession || googleSession.provider !== 'microsoft-entra-id' ? (
            <div>
              <div style={{ fontSize:13, color:C.textMid, marginBottom:12 }}>Verbinde deinen Outlook Kalender.</div>
              <button onClick={() => signIn('microsoft-entra-id', { callbackUrl: 'https://mi-werk.de/dashboard' })} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 20px', background:'#0078D4', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:500, cursor:'pointer', fontFamily:'inherit' }}>
                <span style={{ fontSize:16 }}>📧</span> Mit Outlook verbinden
              </button>
            </div>
          ) : (
            <div>
              <div style={{ fontSize:13, color:C.green, marginBottom:12 }}>✓ Outlook verbunden ({googleSession.user?.email})</div>
            </div>
          )}
        </div>

        <div style={{ background:C.bg2, border:'1px solid ' + C.border, borderRadius:12, padding:20 }}>
          <div style={{ fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:1, color:C.textDim, marginBottom:12 }}>Profil-Status</div>
          <div style={{ fontSize:13, color:C.green }}>✓ Dein Profil ist kostenlos und dauerhaft aktiv.</div>
        </div>

        <div style={{ background:C.bg2, border:'1px solid ' + C.border, borderRadius:12, padding:20 }}>
          <div style={{ fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:1, color:C.textDim, marginBottom:14 }}>Konto</div>
          {[['E-Mail', user?.email], ['Mitglied seit', user?.created_at ? new Date(user.created_at).toLocaleDateString('de-DE') : '-'], ['Konto-ID', user?.id]].map(([k, v]) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid ' + C.border, fontSize:13 }}>
              <span style={{ color:C.textDim, fontSize:12 }}>{k}</span>
              <span style={{ color: k === 'Konto-ID' ? C.textDim : C.text, fontSize: k === 'Konto-ID' ? 11 : 13 }}>{v}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

function Field({ label, value, edit, onChange, placeholder }: { label: string; value: string; edit: boolean; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <div style={{ fontSize:10, fontWeight:500, textTransform:'uppercase' as const, letterSpacing:'0.8px', color:'#5A5550', marginBottom:5 }}>{label}</div>
      {edit ? (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || label}
          style={{ width:'100%', background:'#181818', border:'1px solid rgba(255,255,255,0.06)', borderRadius:8, padding:'9px 12px', fontSize:13, color:'#E8DDD4', fontFamily:'inherit', outline:'none' }} />
      ) : (
        <div style={{ fontSize:14, color: value ? '#E8DDD4' : '#5A5550', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>{value || '-'}</div>
      )}
    </div>
  )
}