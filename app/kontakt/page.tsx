export default function Kontakt() {
  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', color:'#E8DDD4', fontFamily:'system-ui', padding:'60px 24px' }}>
      <div style={{ maxWidth:480, margin:'0 auto' }}>
        <a href="/" style={{ fontSize:12, color:'#c8956c', textDecoration:'none', display:'block', marginBottom:32 }}>← Zurück</a>
        <h1 style={{ fontFamily:'Georgia,serif', fontSize:32, fontWeight:700, marginBottom:8 }}>Mi-<span style={{ color:'#c8956c' }}>Werk</span></h1>
        <h2 style={{ fontSize:14, fontWeight:500, color:'#5A5550', textTransform:'uppercase', letterSpacing:1, marginBottom:32 }}>Kontakt</h2>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ background:'#111', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'20px' }}>
            <div style={{ fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:1, color:'#5A5550', marginBottom:12 }}>Schreib uns</div>
            <a href="mailto:bm.miwerk.de@gmail.com" style={{ fontSize:15, color:'#c8956c', textDecoration:'none', display:'block', marginBottom:6 }}>bm.miwerk.de@gmail.com</a>
            <div style={{ fontSize:13, color:'#5A5550' }}>Wir antworten innerhalb von 24 Stunden.</div>
          </div>
          <div style={{ background:'#111', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'20px' }}>
            <div style={{ fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:1, color:'#5A5550', marginBottom:12 }}>Telefon</div>
            <a href="tel:015780609887" style={{ fontSize:15, color:'#c8956c', textDecoration:'none', display:'block', marginBottom:6 }}>0157 80609887</a>
            <div style={{ fontSize:13, color:'#5A5550' }}>Mo–Fr, 9–18 Uhr</div>
          </div>
          <div style={{ background:'#111', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'20px' }}>
            <div style={{ fontSize:11, fontWeight:500, textTransform:'uppercase', letterSpacing:1, color:'#5A5550', marginBottom:12 }}>Adresse</div>
            <div style={{ fontSize:14, color:'#9A8878', lineHeight:1.7 }}>Mi-Werk UG<br/>Forstring 24</div>
          </div>
        </div>
      </div>
    </div>
  )
}
