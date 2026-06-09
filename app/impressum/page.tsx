export default function Impressum() {
  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', color:'#E8DDD4', fontFamily:'system-ui', padding:'60px 24px' }}>
      <div style={{ maxWidth:640, margin:'0 auto' }}>
        <a href="/" style={{ fontSize:12, color:'#c8956c', textDecoration:'none', display:'block', marginBottom:32 }}>← Zurück</a>
        <h1 style={{ fontFamily:'Georgia,serif', fontSize:32, fontWeight:700, marginBottom:8 }}>Mi-<span style={{ color:'#c8956c' }}>Werk</span></h1>
        <h2 style={{ fontSize:14, fontWeight:500, color:'#5A5550', textTransform:'uppercase', letterSpacing:1, marginBottom:32 }}>Impressum</h2>
        <div style={{ display:'flex', flexDirection:'column', gap:24, fontSize:14, lineHeight:1.8, color:'#9A8878' }}>
          <div>
            <div style={{ color:'#E8DDD4', fontWeight:500, marginBottom:4 }}>Angaben gemäß § 5 TMG</div>
            <div>Mi-Werk UG</div>
            <div>Forstring 24</div>
          </div>
          <div>
            <div style={{ color:'#E8DDD4', fontWeight:500, marginBottom:4 }}>Kontakt</div>
            <div>Telefon: 0157 80609887</div>
            <div>E-Mail: bm.miwerk.de@gmail.com</div>
          </div>
          <div>
            <div style={{ color:'#E8DDD4', fontWeight:500, marginBottom:4 }}>Verantwortlich für den Inhalt</div>
            <div>Mi-Werk UG, Forstring 24</div>
          </div>
          <div style={{ paddingTop:16, borderTop:'1px solid rgba(255,255,255,0.06)', fontSize:12, color:'#5A5550' }}>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr. Unsere E-Mail-Adresse finden Sie oben im Impressum. Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </div>
        </div>
      </div>
    </div>
  )
}
