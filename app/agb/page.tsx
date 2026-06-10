'use client'

import { useRouter } from 'next/navigation'

export default function AGB() {
  const router = useRouter()

  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', color:'#E8DDD4', fontFamily:'system-ui' }}>
      <div style={{ display:'flex', alignItems:'center', padding:'0 32px', height:56, background:'#111', borderBottom:'1px solid rgba(200,149,108,0.18)', position:'sticky', top:0, zIndex:100 }}>
        <button onClick={() => router.back()} style={{ fontSize:12, color:'#c8956c', background:'none', border:'1px solid rgba(200,149,108,0.3)', borderRadius:8, padding:'6px 14px', cursor:'pointer', fontFamily:'inherit', marginRight:16 }}>
          ← Zurück
        </button>
        <div style={{ fontFamily:'Georgia,serif', fontSize:20, fontWeight:700, cursor:'pointer' }} onClick={() => router.push('/')}>
          Mi-<span style={{ color:'#c8956c' }}>Werk</span>
        </div>
      </div>
      <div style={{ maxWidth:800, margin:'0 auto', padding:'48px 24px 80px' }}>
        <h1 style={{ fontFamily:'Georgia,serif', fontSize:36, fontWeight:700, marginBottom:8 }}>Allgemeine Geschäftsbedingungen</h1>
        <p style={{ fontSize:13, color:'#5A5550', marginBottom:48 }}>Stand: Juni 2026</p>
        <section style={{ marginBottom:40 }}>
          <h2 style={{ fontSize:18, fontWeight:600, color:'#c8956c', marginBottom:12 }}>1. Geltungsbereich</h2>
          <p style={{ fontSize:14, color:'#9A8878', lineHeight:1.8 }}>Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der Plattform Mi-Werk, erreichbar unter mi-werk.de, betrieben von Ursula Middeldorf (nachfolgend „Betreiber"). Mit der Registrierung oder Nutzung der Plattform akzeptiert der Nutzer diese AGB in ihrer jeweils gültigen Fassung.</p>
        </section>
        <section style={{ marginBottom:40 }}>
          <h2 style={{ fontSize:18, fontWeight:600, color:'#c8956c', marginBottom:12 }}>2. Leistungsbeschreibung</h2>
          <p style={{ fontSize:14, color:'#9A8878', lineHeight:1.8 }}>Mi-Werk ist eine Vermittlungsplattform, die Dienstleister und Suchende zusammenbringt. Der Betreiber ist nicht Partei der zwischen Dienstleistern und Suchenden geschlossenen Verträge. Mi-Werk übernimmt keine Haftung für die Qualität, Zuverlässigkeit oder Rechtmäßigkeit der angebotenen Dienstleistungen.</p>
        </section>
        <section style={{ marginBottom:40 }}>
          <h2 style={{ fontSize:18, fontWeight:600, color:'#c8956c', marginBottom:12 }}>3. Registrierung & Profil</h2>
          <p style={{ fontSize:14, color:'#9A8878', lineHeight:1.8 }}>Die Registrierung als Dienstleister ist kostenlos. Der Nutzer verpflichtet sich, wahrheitsgemäße Angaben zu machen und sein Profil aktuell zu halten. Pro Person ist nur ein Konto erlaubt. Der Betreiber behält sich vor, Konten bei Verstößen gegen diese AGB zu sperren oder zu löschen.</p>
        </section>
        <section style={{ marginBottom:40 }}>
          <h2 style={{ fontSize:18, fontWeight:600, color:'#c8956c', marginBottom:12 }}>4. Kostenlose Phase & Abo-Modell</h2>
          <p style={{ fontSize:14, color:'#9A8878', lineHeight:1.8, marginBottom:12 }}>Nach der Registrierung ist das Profil für die ersten 6 Monate kostenlos und öffentlich sichtbar. Im 5. Monat erhält der Dienstleister eine automatische E-Mail mit einem Hinweis auf das bevorstehende Ende der kostenlosen Phase.</p>
          <ul style={{ fontSize:14, color:'#9A8878', lineHeight:2, paddingLeft:20 }}>
            <li>Monat 7–8: Einführungspreis (je nach Kategorie)</li>
            <li>Ab Monat 9: regulärer Preis (je nach Kategorie)</li>
            <li>Ohne aktives Abo wird das Profil automatisch ausgeblendet</li>
          </ul>
        </section>
        <section style={{ marginBottom:40 }}>
          <h2 style={{ fontSize:18, fontWeight:600, color:'#c8956c', marginBottom:12 }}>5. Zahlung</h2>
          <p style={{ fontSize:14, color:'#9A8878', lineHeight:1.8 }}>Die Zahlungsabwicklung erfolgt über den Zahlungsdienstleister Stripe. Das Abo wird monatlich abgerechnet und verlängert sich automatisch, sofern es nicht rechtzeitig gekündigt wird. Eine Kündigung ist jederzeit zum Ende des laufenden Abrechnungszeitraums möglich.</p>
        </section>
        <section style={{ marginBottom:40 }}>
          <h2 style={{ fontSize:18, fontWeight:600, color:'#c8956c', marginBottom:12 }}>6. Widerrufsrecht</h2>
          <p style={{ fontSize:14, color:'#9A8878', lineHeight:1.8 }}>Verbrauchern steht grundsätzlich ein 14-tägiges Widerrufsrecht zu. Das Widerrufsrecht erlischt vorzeitig, wenn der Nutzer ausdrücklich zustimmt, dass mit der Ausführung der Dienstleistung vor Ablauf der Widerrufsfrist begonnen wird.</p>
        </section>
        <section style={{ marginBottom:40 }}>
          <h2 style={{ fontSize:18, fontWeight:600, color:'#c8956c', marginBottom:12 }}>7. Pflichten der Nutzer</h2>
          <ul style={{ fontSize:14, color:'#9A8878', lineHeight:2, paddingLeft:20 }}>
            <li>Keine falschen oder irreführenden Angaben zu machen</li>
            <li>Keine rechtswidrigen oder diskriminierenden Inhalte einzustellen</li>
            <li>Die Plattform nicht für Spam zu nutzen</li>
            <li>Zugangsdaten vertraulich zu behandeln</li>
          </ul>
        </section>
        <section style={{ marginBottom:40 }}>
          <h2 style={{ fontSize:18, fontWeight:600, color:'#c8956c', marginBottom:12 }}>8. Haftung</h2>
          <p style={{ fontSize:14, color:'#9A8878', lineHeight:1.8 }}>Der Betreiber haftet nicht für Schäden, die durch die Nutzung der Plattform entstehen, sofern diese nicht auf Vorsatz oder grober Fahrlässigkeit beruhen.</p>
        </section>
        <section style={{ marginBottom:40 }}>
          <h2 style={{ fontSize:18, fontWeight:600, color:'#c8956c', marginBottom:12 }}>9. Datenschutz</h2>
          <p style={{ fontSize:14, color:'#9A8878', lineHeight:1.8 }}>Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer <a href="/datenschutz" style={{ color:'#c8956c' }}>Datenschutzerklärung</a>.</p>
        </section>
        <section style={{ marginBottom:40 }}>
          <h2 style={{ fontSize:18, fontWeight:600, color:'#c8956c', marginBottom:12 }}>10. Änderungen der AGB</h2>
          <p style={{ fontSize:14, color:'#9A8878', lineHeight:1.8 }}>Der Betreiber behält sich vor, diese AGB jederzeit zu ändern. Registrierte Nutzer werden über wesentliche Änderungen per E-Mail informiert.</p>
        </section>
        <section style={{ marginBottom:40 }}>
          <h2 style={{ fontSize:18, fontWeight:600, color:'#c8956c', marginBottom:12 }}>11. Anwendbares Recht</h2>
          <p style={{ fontSize:14, color:'#9A8878', lineHeight:1.8 }}>Es gilt das Recht der Bundesrepublik Deutschland.</p>
        </section>
        <section style={{ marginBottom:40 }}>
          <h2 style={{ fontSize:18, fontWeight:600, color:'#c8956c', marginBottom:12 }}>12. Kontakt</h2>
          <p style={{ fontSize:14, color:'#9A8878', lineHeight:1.8 }}>Bei Fragen: <a href="/kontakt" style={{ color:'#c8956c' }}>mi-werk.de/kontakt</a></p>
        </section>
      </div>
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', padding:'32px', textAlign:'center' }}>
        <div style={{ fontFamily:'Georgia,serif', fontSize:16, fontWeight:700, marginBottom:8 }}>Mi-<span style={{ color:'#c8956c' }}>Werk</span></div>
        <div style={{ fontSize:11, color:'#5A5550' }}>Dienstleister in deiner Region · © 2026</div>
        <div style={{ marginTop:16, display:'flex', gap:20, justifyContent:'center' }}>
          <button onClick={() => router.push('/impressum')} style={{ fontSize:12, color:'#5A5550', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>Impressum</button>
          <button onClick={() => router.push('/datenschutz')} style={{ fontSize:12, color:'#5A5550', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>Datenschutz</button>
          <button onClick={() => router.push('/kontakt')} style={{ fontSize:12, color:'#5A5550', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>Kontakt</button>
        </div>
      </div>
    </div>
  )
}
