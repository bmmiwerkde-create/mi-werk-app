"use client"
// components/Footer.tsx
// Einbinden in app/layout.tsx: import Footer from '@/components/Footer'

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid #2a2a2a",
        backgroundColor: "#0a0a0a",
        padding: "2rem 1.5rem",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Logo / Name */}
        <span
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "#b87333", // Kupfer
            textTransform: "uppercase",
          }}
        >
          Mi-Werk
        </span>

        {/* Links */}
        <nav
          style={{
            display: "flex",
            gap: "2rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            { label: "Impressum", href: "/impressum" },
            { label: "Datenschutz", href: "/datenschutz" },
            { label: "Kontakt", href: "/kontakt" },
          ].map(({ label, href }) => (
            <a
              key={href}
              href={href}
              style={{
                color: "#888",
                textDecoration: "none",
                fontSize: "0.85rem",
                letterSpacing: "0.03em",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLAnchorElement).style.color = "#b87333")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLAnchorElement).style.color = "#888")
              }
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Copyright */}
        <p
          style={{
            color: "#444",
            fontSize: "0.75rem",
            margin: 0,
          }}
        >
          © {new Date().getFullYear()} Mi-Werk. Alle Rechte vorbehalten.
        </p>
      </div>
    </footer>
  );
}
