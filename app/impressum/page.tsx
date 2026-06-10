export default function Impressum() {
  return (
    <main style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", padding: "4rem 1.5rem", color: "#e0e0e0" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <a href="/" style={{ color: "#b87333", display: "block", marginBottom: "2rem", textDecoration: "none" }}>← Zurück zur Startseite</a>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#b87333", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "2.5rem" }}>Impressum</h1>
        <section style={{ marginBottom: "2rem" }}><h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", marginBottom: "0.5rem" }}>Angaben gemäß § 5 TMG</h2><p style={{ color: "#aaa", fontSize: "0.95rem", lineHeight: 1.8, margin: 0 }}>Mi-Werk UG (haftungsbeschränkt)<br />Ben Middeldorf<br />Forstring 24<br />44869 Bochum</p></section>
        <section style={{ marginBottom: "2rem" }}><h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", marginBottom: "0.5rem" }}>Kontakt</h2><p style={{ color: "#aaa", fontSize: "0.95rem", lineHeight: 1.8, margin: 0 }}>E-Mail: <a href="mailto:bm.miwerk.de@gmail.com" style={{ color: "#b87333" }}>bm.miwerk.de@gmail.com</a></p></section>
        <section style={{ marginBottom: "2rem" }}><h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", marginBottom: "0.5rem" }}>Handelsregister</h2><p style={{ color: "#aaa", fontSize: "0.95rem", lineHeight: 1.8, margin: 0 }}>Registergericht: wird nach Eintragung ergänzt<br />Registernummer: wird nach Eintragung ergänzt</p></section>
        <section style={{ marginBottom: "2rem" }}><h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", marginBottom: "0.5rem" }}>Umsatzsteuer-ID</h2><p style={{ color: "#aaa", fontSize: "0.95rem", lineHeight: 1.8, margin: 0 }}>wird nach Erteilung durch das Finanzamt ergänzt</p></section>
        <section style={{ marginBottom: "2rem" }}><h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", marginBottom: "0.5rem" }}>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2><p style={{ color: "#aaa", fontSize: "0.95rem", lineHeight: 1.8, margin: 0 }}>Ben Middeldorf<br />Forstring 24<br />44869 Bochum</p></section>
        <section><h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", marginBottom: "0.5rem" }}>Streitschlichtung</h2><p style={{ color: "#aaa", fontSize: "0.95rem", lineHeight: 1.8, margin: 0 }}>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" style={{ color: "#b87333" }}>https://ec.europa.eu/consumers/odr</a>. Wir nehmen nicht an Streitbeilegungsverfahren teil.</p></section>
      </div>
    </main>
  );
}
