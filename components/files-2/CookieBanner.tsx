"use client";
// components/CookieBanner.tsx

import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const acceptAll = () => {
    localStorage.setItem("cookie-consent", "accepted");
    window.gtag?.("consent", "update", {
      analytics_storage: "granted",
    });
    setVisible(false);
  };

  const declineAll = () => {
    localStorage.setItem("cookie-consent", "declined");
    window.gtag?.("consent", "update", {
      analytics_storage: "denied",
    });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie-Einstellungen"
      style={{
        position: "fixed",
        bottom: "1.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 3rem)",
        maxWidth: "560px",
        backgroundColor: "#111",
        border: "1px solid #2a2a2a",
        borderRadius: "8px",
        padding: "1.25rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        zIndex: 9999,
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
      }}
    >
      <div>
        <p
          style={{
            color: "#e0e0e0",
            fontSize: "0.875rem",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Wir verwenden Cookies. Notwendige Cookies sind immer aktiv.
          Analyse-Cookies (Google Analytics) helfen uns, die Website zu
          verbessern — nur mit deiner Zustimmung. Mehr dazu in unserer{" "}
          <a
            href="/datenschutz"
            style={{
              color: "#b87333",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            Datenschutzerklärung
          </a>
          .
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          justifyContent: "flex-end",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={declineAll}
          style={{
            background: "transparent",
            border: "1px solid #333",
            color: "#888",
            padding: "0.5rem 1.25rem",
            borderRadius: "4px",
            fontSize: "0.825rem",
            cursor: "pointer",
            letterSpacing: "0.03em",
          }}
        >
          Nur notwendige
        </button>

        <button
          onClick={acceptAll}
          style={{
            background: "#b87333",
            border: "none",
            color: "#0a0a0a",
            padding: "0.5rem 1.25rem",
            borderRadius: "4px",
            fontSize: "0.825rem",
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: "0.03em",
          }}
        >
          Alle akzeptieren
        </button>
      </div>
    </div>
  );
}
