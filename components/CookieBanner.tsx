"use client";
// components/CookieBanner.tsx
// Einbinden in app/layout.tsx: import CookieBanner from '@/components/CookieBanner'

import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie-Einstellungen"
      className="mw-karte"
      style={{
        position: "fixed",
        bottom: "1rem",
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 2rem)",
        maxWidth: "560px",
        padding: "1.1rem 1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.9rem",
        zIndex: 9999,
        boxShadow: "0 10px 32px rgba(20,50,74,0.18)",
      }}
    >
      <p style={{ color: "var(--mw-text)", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
        Diese Website verwendet Cookies, um die Nutzererfahrung zu verbessern.
        Weitere Infos in unserer{" "}
        <a href="/datenschutz" style={{ color: "var(--mw-cta)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
          Datenschutzerklärung
        </a>
        .
      </p>
      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", flexWrap: "wrap" }}>
        <button onClick={decline} className="mw-btn zwei klein">Ablehnen</button>
        <button onClick={accept} className="mw-btn klein">Akzeptieren</button>
      </div>
    </div>
  );
}
