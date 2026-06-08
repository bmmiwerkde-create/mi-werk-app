'use client'
import { useEffect, useState } from 'react'
import { supabase } from './Lib/supabase'

export default function Home() {
  const [dienstleister, setDienstleister] = useState<any[]>([])
  const [fehler, setFehler] = useState('')

  useEffect(() => {
    async function laden() {
      const { data, error } = await supabase.from('dienstleister').select('*')
      if (error) {
        setFehler('Fehler: ' + error.message)
        console.error(error)
      }
      if (data) setDienstleister(data)
    }
    laden()
  }, [])

  return (
    <main style={{padding: '40px', fontFamily: 'sans-serif'}}>
      <h1>Mi-Werk</h1>
      <p>Dienstleister in deiner Region</p>
      {fehler && <p style={{color: 'red'}}>{fehler}</p>}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '40px'}}>
        {dienstleister.map((d: any) => (
          <div key={d.id} style={{border: '1px solid #ccc', padding: '20px', borderRadius: '8px'}}>
            <div style={{fontSize: '40px'}}>{d.emoji}</div>
            <h2>{d.name}</h2>
            <p>{d.gewerk} · {d.ort}</p>
            <p>{d.beschreibung}</p>
            <p><strong>{d.preis}€/h</strong></p>
          </div>
        ))}
      </div>
    </main>
  )
}