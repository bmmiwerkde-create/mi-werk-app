"use client";

import { useState, useEffect } from "react";
import { supabase } from "../Lib/supabase";

const KATEGORIEN = [
  { key: "beauty", label: "Beauty & Pflege", emoji: "💇", beschreibung: "Friseure, Kosmetiker, Nagelstudios, Massagen, Tattoo & Piercing", einfuehrung: 9.99, regulaer: 19.99 },
  { key: "tiere", label: "Tiere", emoji: "🐾", beschreibung: "Tierärzte, Hundetrainer, Tierbetreuung, Tierpflege", einfuehrung: 14.99, regulaer: 24.99 },
  { key: "fitness", label: "Fitness", emoji: "🏋️", beschreibung: "Personal Trainer, Fitnessstudios, Yoga, Ernährungsberatung", einfuehrung: 14.99, regulaer: 24.99 },
  { key: "handwerk", label: "Handwerk", emoji: "🔨", beschreibung: "Elektriker, Klempner, Maler, Schreiner, Reinigung", einfuehrung: 19.99, regulaer: 34.99 },
  { key: "auto", label: "Auto", emoji: "🚗", beschreibung: "KFZ-Werkstätten, Pannenhilfe, Umzugshelfer, Fahrdienste", einfuehrung: 19.99, regulaer: 34.99 },
  { key: "gesundheit", label: "Gesundheit", emoji: "🏥", beschreibung: "Ärzte, Zahnärzte, Physiotherapeuten, Psychologen, Heilpraktiker", einfuehrung: 29.99, regulaer: 44.99 },
];

export default function AboPage() {
  const [loading, setLoading] = useState(null);
  const [user, setUser] = useState(null);
  const [userKategorie, setUserKategorie] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setUser(data.user);
        const { data: profil } = await supabase
          .from("dienstleister")
          .select("gewerk")
          .eq("user_id", data.user.id)
          .single();
        if (profil?.gewerk) setUserKategorie(profil.gewerk.toLowerCase());
      }
    });
  }, []);

  const handleCheckout = async (kategorie, typ) => {
    setLoading(`${kategorie}-${typ}`);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kategorie, typ, userId: user?.id, email: user?.email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      console.error(error);
    }
    setLoading(null);
  };

  return (
    <main style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", padding: "4rem 1.5rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#b87333", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
          Abo wählen
        </h1>
        <p style={{ color: "#888", marginBottom: "3rem", fontSize: "0.95rem" }}>
          Die ersten 6 Monate sind kostenlos. Danach bleibt dein Profil mit einem Abo sichtbar.
        </p>
        <div style={{ display: "grid", gap: "1.5rem" }}>
          {KATEGORIEN.map((kat) => (
            <div key={kat.key} style={{ backgroundColor: "#111", border: userKategorie === kat.key ? "1px solid #b87333" : "1px solid #222", borderRadius: "8px", padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h2 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                    {kat.emoji} {kat.label}
                    {userKategorie === kat.key && <span style={{ marginLeft: "0.75rem", fontSize: "0.75rem", color: "#b87333", fontWeight: 400 }}>Deine Kategorie</span>}
                  </h2>
                  <p style={{ color: "#666", fontSize: "0.85rem", margin: 0 }}>{kat.beschreibung}</p>
                </div>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <button onClick={() => handleCheckout(kat.key, "einfuehrung")} disabled={!!loading} style={{ background: "transparent", border: "1px solid #b87333", color: "#b87333", padding: "0.5rem 1rem", borderRadius: "4px", fontSize: "0.85rem", cursor: "pointer" }}>
                    {loading === `${kat.key}-einfuehrung` ? "..." : `Einführung ${kat.einfuehrung}€/Monat`}
                  </button>
                  <button onClick={() => handleCheckout(kat.key, "regulaer")} disabled={!!loading} style={{ background: "#b87333", border: "none", color: "#0a0a0a", padding: "0.5rem 1rem", borderRadius: "4px", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" }}>
                    {loading === `${kat.key}-regulaer` ? "..." : `Regulär ${kat.regulaer}€/Monat`}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
