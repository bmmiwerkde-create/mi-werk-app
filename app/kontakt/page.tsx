export default function Kontakt() {
  return (
    <main style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", padding: "4rem 1.5rem" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#b87333", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "2.5rem" }}>
          Kontakt
        </h1>
        <p style={{ color: "#aaa", fontSize: "0.95rem", lineHeight: 1.8 }}>
          Bei Fragen erreichst du uns per E-Mail:
        </p>
        <a href="mailto:bm.miwerk.de@gmail.com" style={{ color: "#b87333", fontSize: "1rem", display: "inline-block", marginTop: "0.75rem" }}>
          bm.miwerk.de@gmail.com
        </a>
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", marginBottom: "0.5rem" }}>Adresse</h2>
          <p style={{ color: "#aaa", fontSize: "0.95rem", lineHeight: 1.8, margin: 0 }}>
            Mi-Werk UG (haftungsbeschränkt)<br />
            Ben Middeldorf<br />
            Forstring 24<br />
            44869 Bochum
          </p>
        </div>
      </div>
    </main>
  );
}