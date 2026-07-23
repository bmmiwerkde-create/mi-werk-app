'use client'

import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()

  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', color:'#E8DDD4', fontFamily:'system-ui', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px' }}>
      <div style={{ fontFamily:'Georgia,serif', fontSize:64, fontWeight:700, letterSpacing:-1, marginBottom:56, textAlign:'center' }}>
        Mi-<span style={{ color:'#c8956c' }}>Werk</span>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:20, width:'100%', maxWidth:420 }}>
        <button
          onClick={() => router.push('/suche')}
          style={{ padding:'22px 28px', borderRadius:14, background:'#c8956c', color:'#0A0A0A', border:'none', fontSize:17, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}
        >
          Ich suche einen Dienstleister
        </button>
        <button
          onClick={() => router.push('/login')}
          style={{ padding:'22px 28px', borderRadius:14, background:'transparent', color:'#c8956c', border:'1px solid #c8956c', fontSize:17, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}
        >
          Ich bin Dienstleister
        </button>
      </div>
    </div>
  )
}
