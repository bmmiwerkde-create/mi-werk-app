'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../Lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profil, setProfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({})
  const [message, setMessage] = useState('')

  useEffect(() => { checkUser() }, [])

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }
    setUser(session.user)
    await loadProfil(session.user.id)
    setLoading(false)
  }

  async function loadProfil(userId) {
    const { data } = await supabase
      .from('dienstleister')
      .select('*')
      .eq('user_id', userId)
      .single()
    if (data) { setProfil(data); setForm(data) }
  }

  async function saveProfil() {
    if (!user) return
    setSaving(true)
    setMessage('')
    const payload = { ...form, user_id: user.id }
    const { error } = profil?.id
      ? await supabase.from('dienstleister').update(payload).eq('id', profil.id)
      : await supabase.from('dienstleister').insert(payload)
    if (error) {
      setMessage('Fehler: ' + error.message)
    } else {
      setMessage('Gespeichert ✓')
      setEditMode(false)
      await loadProfil(user.id)
    }
    setSaving(false)
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const firstName = profil?.name?.split(' ')[0] || user?.email?.split('@')[0] || ''

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <span style={{ color:'#c8956c' }}>Laden…</span>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', color:'#E8DDD4', fontFamily:'system-ui' }}>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', height:52, background:'#111', borderBottom:'1px solid rgba(200,149,108,0.2)', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ fontFamily:'Georgia,serif', fontSize:19, fontWeight:700 }}>Mi-<span style={{ color:'#c8956c' }}>Werk</span></div>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <span style={{ fontSize:12, color:'#9A8878' }}>{user?.email}</span>
          <button onClick={logout} style={{ fontSize:11, color:'#5A5550', cursor:'pointer', padding:'5px 12px', borderRadius:6, border:'1px solid rgba(255,255,255,0.06)', background:'none' }}>Abmelden</button>
        </div>
      </div>

      <div style={{ maxWidth:660, margin:'0 auto', padding:'28px 20px', display:'flex', flexDirection:'column', gap:14 }}>

        <div style={{ marginBottom:4 }}>
          <div style={{ fontSize:22, fontWeight:500, marginBottom:4 }}>Willkommen, <span style={{ color:'#c8956c' }}>{firstName}</span></div>
          <div style={{ fontSize:12, color:'#5A5550' }}>{profil ? 'Hier kannst du dein Profil verwalten.' : 'Leg dein Profil an — so finden dich Kunden auf mi-werk.de.'}</div>
        </div>

        <div style={{ background:'#111', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <div style={{ fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:1, color:'#5A5550', marginBottom:2 }}>Öffentliches Profil</div>
              <div style={{ fontSize:12, color:'#5A5550' }}>So sehen dich Kunden auf mi-werk.de</div>
            </div>
            {!editMode && (
              <button onClick={() => setEditMode(true)} style={{ fontSize:12, padding:'7px 16px', borderRadius:7, border:'1px solid rgba(255,255,255,0.06)', background:'transparent', color:'#9A8878', cursor:'pointer' }}>Bearbeiten</button>
            )}
          </div>

          <div style={{ padding:'20px', display:'flex', flexDirection:'column', gap:14 }}>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <Field label="Name" value={form.name || ''} edit={editMode} onChange={v => setForm(f => ({ ...f, name: v }))} />
              <Field label="Gewerk / Kategorie" value={form.gewerk || ''} edit={editMode} onChange={v => setForm(f => ({ ...f, gewerk: v }))} />
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <Field label="Ort" value={form.ort || ''} edit={editMode} onChange={v => setForm(f => ({ ...f, ort: v }))} />
              <div>
                <div style={{ fontSize:10, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.8px', color:'#5A5550', marginBottom:5 }}>Umkreis</div>
                {editMode ? (
                  <select value={form.umkreis || ''} onChange={e => setForm(f => ({ ...f, umkreis: e.target.value }))}
                    style={{ width:'100%', background:'#181818', border:'1px solid rgba(255,255,255,0.06)', borderRadius:8, padding:'9px 12px', fontSize:13, color:'#E8DDD4', fontFamily:'inherit', outline:'none' }}>
                    <option value="">Bitte wählen</option>
                    <option value="10km">10 km</option>
                    <option value="25km">25 km</option>
                    <option value="50km">50 km</option>
                    <option value="100km">100 km</option>
                  </select>
                ) : (
                  <div style={{ fontSize:14, color: form.umkreis ? '#E8DDD4' : '#5A5550', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>{form.umkreis || '—'}</div>
                )}
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <Field label="Preis" value={form.preis || ''} edit={editMode} onChange={v => setForm(f => ({ ...f, preis: v }))} placeholder="z.B. ab 50 €/Std." />
              <div>
                <div style={{ fontSize:10, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.8px', color:'#5A5550', marginBottom:5 }}>Verfügbar ab</div>
                {editMode ? (
                  <input type="date" value={form.verfuegbar_ab || ''} onChange={e => setForm(f => ({ ...f, verfuegbar_ab: e.target.value }))}
                    style={{ width:'100%', background:'#181818', border:'1px solid rgba(255,255,255,0.06)', borderRadius:8, padding:'9px 12px', fontSize:13, color:'#E8DDD4', fontFamily:'inherit', outline:'none' }} />
                ) : (
                  <div style={{ fontSize:14, color: form.verfuegbar_ab ? '#E8DDD4' : '#5A5550', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                    {form.verfuegbar_ab ? new Date(form.verfuegbar_ab).toLocaleDateString('de-DE') : '—'}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div style={{ fontSize:10, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.8px', color:'#5A5550', marginBottom:5 }}>Beschreibung</div>
              {editMode ? (
                <textarea value={form.beschreibung || ''} onChange={e => setForm(f => ({ ...f, beschreibung: e.target.value }))} placeholder="Was bietest du an?"
                  style={{ width:'100%', background:'#181818', border:'1px solid rgba(255,255,255,0.06)', borderRadius:8, padding:'9px 12px', fontSize:13, color:'#E8DDD4', fontFamily:'inherit', outline:'none', resize:'vertical', minHeight:90 }} />
              ) : (
                <div style={{ fontSize:13, color: form.beschreibung ? '#E8DDD4' : '#5A5550', lineHeight:1.7 }}>{form.beschreibung || 'Noch keine Beschreibung'}</div>
              )}
            </div>

            {!editMode && profil && (
              <div style={{ marginTop:6, paddingTop:16, borderTop:'1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize:10, fontWeight:500, textTransform:'uppercase', letterSpacing:1, color:'#5A5550', marginBottom:10 }}>Vorschau — Kunden-Karte</div>
                <div style={{ display:'flex', alignItems:'center', gap:14, background:'#181818', border:'1px solid rgba(200,149,108,0.2)', borderRadius:10, padding:'14px 16px' }}>
                  <div style={{ fontSize:30 }}>{profil.emoji || '🔧'}</div>
                  <div>
                    <div style={{ fontSize:15, fontWeight:500, marginBottom:3 }}>{profil.name}</div>
                    <div style={{ fontSize:12, color:'#9A8878', marginBottom:2 }}>{profil.gewerk} · {profil.ort} {profil.umkreis ? '(+' + profil.umkreis + ')' : ''}</div>
                    <div style={{ fontSize:12, color:'#c8956c' }}>{profil.preis}</div>
                    {profil.verfuegbar_ab && <div style={{ fontSize:11, color:'#5A5550', marginTop:2 }}>Verfügbar ab {new Date(profil.verfuegbar_ab).toLocaleDateString('de-DE')}</div>}
                  </div>
                </div>
              </div>
            )}

            {editMode && (
              <div style={{ display:'flex', gap:10, marginTop:6 }}>
                <button onClick={saveProfil} disabled={saving} style={{ padding:'10px 22px', borderRadius:8, background:'#c8956c', color:'#fff', fontSize:13, fontWeight:500, border:'none', cursor:'pointer', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Speichern…' : 'Speichern →'}
                </button>
                <button onClick={() => { setEditMode(false); setForm(profil || {}) }} style={{ padding:'10px 16px', borderRadius:8, background:'transparent', color:'#9A8878', fontSize:13, border:'1px solid rgba(255,255,255,0.06)', cursor:'pointer' }}>
                  Abbrechen
                </button>
              </div>
            )}

            {message && (
              <div style={{ fontSize:13, padding:'8px 12px', borderRadius:7, background:'rgba(255,255,255,0.04)', color: message.startsWith('Fehler') ? '#C0392B' : '#27AE60' }}>
                {message}
              </div>
            )}
          </div>
        </div>

        <div style={{ background:'#111', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:20 }}>
          <div style={{ fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:1, color:'#5A5550', marginBottom:14 }}>Konto</div>
          {[['E-Mail', user?.email], ['Mitglied seit', user?.created_at ? new Date(user.created_at).toLocaleDateString('de-DE') : '—']].map(([k, v]) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:13 }}>
              <span style={{ color:'#5A5550', fontSize:12 }}>{k}</span>
              <span>{v}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

function Field({ label, value, edit, onChange, placeholder }) {
  return (
    <div>
      <div style={{ fontSize:10, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.8px', color:'#5A5550', marginBottom:5 }}>{label}</div>
      {edit ? (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || label}
          style={{ width:'100%', background:'#181818', border:'1px solid rgba(255,255,255,0.06)', borderRadius:8, padding:'9px 12px', fontSize:13, color:'#E8DDD4', fontFamily:'inherit', outline:'none' }} />
      ) : (
        <div style={{ fontSize:14, color: value ? '#E8DDD4' : '#5A5550', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>{value || '—'}</div>
      )}
    </div>
  )
}
