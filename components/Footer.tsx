// components/Footer.tsx

export default function Footer() {
  return (
    <footer className="mw-footer">
      <div className="mw-wrap">
        <div>
          <a className="mw-logo" href="/" style={{ fontSize: 19 }}>Mi-<span>Werk</span></a>
          <div style={{ marginTop: 4 }}>Dienstleister in deiner Region · © {new Date().getFullYear()}</div>
        </div>
        <nav aria-label="Rechtliches">
          <a href="/impressum">Impressum</a>
          <a href="/datenschutz">Datenschutz</a>
          <a href="/kontakt">Kontakt</a>
          <a href="/agb">AGB</a>
        </nav>
      </div>
    </footer>
  )
}
