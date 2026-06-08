'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../Lib/supabase'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        window.location.href = '/login'
      } else {
        setUser(session.user)
      }
    }
    checkUser()
  }, [])

  async function ausloggen() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (!user) return <p style={{color: 'white', padding: '40px'}}>Laden...</p>

  return (
    <main style={{background: '#0a0a0a', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif', color: 'white'}}>
      <div style={{maxWidth: '600px', margin: '0 auto'}}>
        <h1 style={{color: '#c8956c', fontSize: '32px'}}>Mi-Werk</h1>
        <h2 style={{marginTop: '40px'}}>Willkommen! 👋</h2>
        <p style={{color: '#999'}}>{user.email}</p>
        <div style={{background: '#1a1a1a', borderRadius: '12px', padding: '30px', marginTop: '30px', border: '1px solid #333'}}>
          <h3 style={{color: '#c8956c'}}>Dein Profil</h3>
          <p>Hier kannst du bald deine Daten bearbeiten.</p>
        </div>
        <button onClick={ausloggen} style={{marginTop: '30px', padding: '12px 24px', background: 'transparent', color: '#c8956c', border: '1px solid #c8956c', borderRadius: '8px', cursor: 'pointer', fontSize: '16px'}}>
          Ausloggen
        </button>
      </div>
    </main>
  )
}