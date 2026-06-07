'use client'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

export default function Home() {
  const [dienstleister, setDienstleister] = useState<any>([])

  useEffect(() => {
    async function laden() {
      const { data } = await supabase.from('dienstleister').select('*')
      if (data) setDienstleister(data)
    }
    laden()
  }, [])

  return (
    <main style={{padding: '40px', fontFamily: 'sans-serif'}}>
      <h1>Mi-Werk</h1>
      <p>Dienstleister in deiner Region</p>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '40px'}}>
        {dienstleister.map((d: any) => (
          <div key={d.id} style={{border: '1px solid #ccc', padding: '20px', borderRadius: '8px'}}>
            <div style={{fontSize: '40px'}}>{d.emoji}</div>
            <h2>{d.Name}</h2>
            <p>{d.Gewerk} · {d.ort}</p>
            <p>{d.Beschreibung}</p>
            <p><strong>{d.Preis}€/h</strong></p>
          </div>
        ))}
      </div>
    </main>
  )
}