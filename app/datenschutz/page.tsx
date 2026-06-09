export default function Datenschutz() {
  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', color:'#E8DDD4', fontFamily:'system-ui', padding:'60px 24px' }}>
      <div style={{ maxWidth:640, margin:'0 auto' }}>
        <a href="/" style={{ fontSize:12, color:'#c8956c', textDecoration:'none', display:'block', marginBottom:32 }}>← Zurück</a>
        <h1 style={{ fontFamily:'Georgia,serif', fontSize:32, fontWeight:700, marginBottom:8 }}>Mi-<span style={{ color:'#c8956c' }}>Werk</span></h1>
        <h2 style={{ fontSize:14, fontWeight:500, color:'#5A5550', textTransform:'uppercase', letterSpacing:1, marginBottom:32 }}>Datenschutzerklärung</h2>
        <div style={{ display:'flex', flexDirection:'column', gap:24, fontSize:14, lineHeight:1.8, color:'#9A8878' }}>
          <div>
            <div style={{ color:'#E8DDD4', fontWeight:500, marginBottom:8 }}>1. Verantwortlicher</div>
            <div>Mi-Werk UG, Forstring 24, bm.miwerk.de@gmail.com</div>
          </div>
          <div>
            <div style={{ color:'#E8DDD4', fontWeight:500, marginBottom:8 }}>2. Erhobene Daten</div>
            <div>Bei der Registrierung erheben wir E-Mail-Adresse und Profildaten (Name, Gewerk, Ort, Beschreibung, Preis). Diese Daten werden zur Bereitstellung der Plattform verwendet.</div>
          </div>
          <div>
            <div style={{ color:'#E8DDD4', fontWeight:500, marginBottom:8 }}>3. Speicherung</div>
            <div>Daten werden in der Supabase-Datenbank gespeichert (Rechenzentrum in der EU). Es erfolgt keine Weitergabe an Dritte.</div>
          </div>
          <div>
            <div style={{ color:'#E8DDD4', fontWeight:500, marginBottom:8 }}>4. Cookies</div>
            <div>Wir verwenden technisch notwendige Cookies für den Login-Status. Analytische oder Marketing-Cookies werden nicht eingesetzt.</div>
          </div>
          <div>
            <div style={{ color:'#E8DDD4', fontWeight:500, marginBottom:8 }}>5. Ihre Rechte</div>
            <div>Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Widerspruch. Kontakt: bm.miwerk.de@gmail.com</div>
          </div>
          <div>
            <div style={{ color:'#E8DDD4', fontWeight:500, marginBottom:8 }}>6. Hosting</div>
            <div>Diese Website wird bei Vercel Inc., 340 Pine Street, San Francisco, CA 94104, USA gehostet. Vercel verarbeitet dabei Server-Logs gemäß DSGVO-Standardvertragsklauseln.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
