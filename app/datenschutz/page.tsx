export default function Datenschutz() {
  return (
    <main style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", padding: "4rem 1.5rem", color: "#e0e0e0" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#b87333", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "2.5rem" }}>
          Datenschutzerklärung
        </h1>
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", marginBottom: "0.5rem" }}>1. Verantwortlicher</h2>
          <p style={{ color: "#aaa", fontSize: "0.95rem", lineHeight: 1.8, margin: 0 }}>
            Mi-Werk UG (haftungsbeschränkt)<br />
            Ben Middeldorf<br />
            Forstring 24, 44869 Bochum<br />
            E-Mail: bm.miwerk.de@gmail.com
          </p>
        </section>
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", marginBottom: "0.5rem" }}>2. Hosting</h2>
          <p style={{ color: "#aaa", fontSize: "0.95rem", lineHeight: 1.8, margin: 0 }}>
            Diese Website wird bei Vercel Inc. gehostet. Vercel verarbeitet Verbindungsdaten zur Bereitstellung des Dienstes. Grundlage ist Art. 6 Abs. 1 lit. f DSGVO.
          </p>
        </section>
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", marginBottom: "0.5rem" }}>3. Datenbank & Authentifizierung</h2>
          <p style={{ color: "#aaa", fontSize: "0.95rem", lineHeight: 1.8, margin: 0 }}>
            Wir nutzen Supabase für die Speicherung von Nutzerdaten und Authentifizierung. Dabei werden E-Mail-Adresse und Profildaten verarbeitet. Grundlage ist Art. 6 Abs. 1 lit. b DSGVO.
          </p>
        </section>
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", marginBottom: "0.5rem" }}>4. Zahlungsabwicklung</h2>
          <p style={{ color: "#aaa", fontSize: "0.95rem", lineHeight: 1.8, margin: 0 }}>
            Zahlungen werden über Stripe Inc. abgewickelt. Dabei werden Zahlungsdaten direkt an Stripe übermittelt. Grundlage ist Art. 6 Abs. 1 lit. b DSGVO.
          </p>
        </section>
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", marginBottom: "0.5rem" }}>5. Google Analytics</h2>
          <p style={{ color: "#aaa", fontSize: "0.95rem", lineHeight: 1.8, margin: 0 }}>
            Mit deiner Zustimmung nutzen wir Google Analytics (Google LLC) zur Analyse der Websitenutzung. Dabei werden Cookies gesetzt und Daten an Google in den USA übertragen. Grundlage ist Art. 6 Abs. 1 lit. a DSGVO. Du kannst deine Einwilligung jederzeit widerrufen.
          </p>
        </section>
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", marginBottom: "0.5rem" }}>6. Cookies</h2>
          <p style={{ color: "#aaa", fontSize: "0.95rem", lineHeight: 1.8, margin: 0 }}>
            Wir verwenden technisch notwendige Cookies für die Authentifizierung sowie ein Cookie zur Speicherung deiner Cookie-Einwilligung. Analyse-Cookies nur mit deiner Zustimmung.
          </p>
        </section>
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", marginBottom: "0.5rem" }}>7. Deine Rechte</h2>
          <p style={{ color: "#aaa", fontSize: "0.95rem", lineHeight: 1.8, margin: 0 }}>
            Du hast das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung. Wende dich an: bm.miwerk.de@gmail.com
          </p>
        </section>
        <section>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", marginBottom: "0.5rem" }}>8. Beschwerderecht</h2>
          <p style={{ color: "#aaa", fontSize: "0.95rem", lineHeight: 1.8, margin: 0 }}>
            Du kannst dich bei der Landesbeauftragten für Datenschutz und Informationsfreiheit NRW (LDI NRW) beschweren.
          </p>
        </section>
      </div>
    </main>
  );
}
