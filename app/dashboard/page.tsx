'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../Lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      setUser(session.user)
      setLoading(false)
    })
  }, [])

  async function logout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <span style={{ color:'#c8956c' }}>Laden…</span>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', color:'#E8DDD4', fontFamily:'system-ui' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', height:52, background:'#111', borderBottom:'1px solid rgba(200,149,108,0.2)' }}>
        <div style={{ fontFamily:'Georgia,serif', fontSize:19, fontWeight:700 }}>
          Mi-<span style={{ color:'#c8956c' }}>Werk</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <span style={{ fontSize:12, color:'#9A8878' }}>{user?.email}</span>
          <button onClick={logout} style={{ fontSize:11, color:'#5A5550', cursor:'pointer', padding:'5px 12px', borderRadius:6, border:'1px solid rgba(255,255,255,0.06)', background:'none' }}>
            Abmelden
          </button>
        </div>
      </div>
      <div style={{ maxWidth:660, margin:'0 auto', padding:'28px 20px' }}>
        <div style={{ fontSize:22, fontWeight:500, marginBottom:4 }}>
          Willkommen, <span style={{ color:'#c8956c' }}>{user?.email?.split('@')[0]}</span>
        </div>
        <div style={{ fontSize:12, color:'#5A5550', marginTop:4 }}>Dein Dashboard auf mi-werk.de</div>
      </div>
    </div>
  )
}
