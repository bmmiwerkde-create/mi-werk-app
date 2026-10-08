"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../Lib/supabase";
import { KATEGORIEN } from "../Lib/kategorien";
import { IconBadge, iconNameFuerKategorie } from "../components/Icons";
import Kopfzeile from "@/components/Kopfzeile";

export default function AboPage() {
  const router = useRouter();
  const [pruefeLogin, setPruefeLogin] = useState(true);
  const [loading, setLoading] = useState(null);
  const [user, setUser] = useState(null);
  const [userKategorie, setUserKategorie] = useState(null);
  const [auswahl, setAuswahl] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);
      const { data: profil } = await supabase
        .from("dienstleister")
        .select("gewerk")
        .eq("user_id", data.user.id)
        .single();
      if (profil?.gewerk) setUserKategorie(profil.gewerk.toLowerCase());
      setPruefeLogin(false);
    });
  }, [router]);

  if (pruefeLogin) {
    return <div><Kopfzeile aktiv="dashboard" /><div className="mw-laden">Laden…</div></div>;
  }

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

  const euro = (n) => n.toFixed(2).replace(".", ",") + " €";
  const gewaehlt = KATEGORIEN.find((k) => k.key === auswahl);

  const waehlen = (key) => {
    setAuswahl(key);
    setTimeout(() => document.getElementById("abo-auswahl")?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
  };

  return (
    <div>
      <Kopfzeile aktiv="dashboard" />
      <main className="mw-wrap" style={{ maxWidth: 960, padding: "40px 20px 72px" }}>
        <h1 className="mw-h1" style={{ fontSize: 32, marginBottom: 6 }}>Abo wählen</h1>
        <p className="mw-muted" style={{ margin: "0 0 24px" }}>Die ersten 12 Monate sind kostenlos. Danach bleibt dein Profil mit einem Abo sichtbar. Tippe auf deine Branche, um den Preis zu sehen.</p>

        <div className="mw-abo-kacheln">
          {KATEGORIEN.map((kat) => (
            <button
              key={kat.key}
              className={"mw-abo-kachel" + (auswahl === kat.key ? " an" : "")}
              onClick={() => waehlen(kat.key)}
              aria-pressed={auswahl === kat.key}
            >
              <IconBadge name={iconNameFuerKategorie(kat.label)} size={48} />
              <span>{kat.label}</span>
              {userKategorie === kat.key && <small className="mw-badge mw-frei">Deine Branche</small>}
            </button>
          ))}
        </div>

        {gewaehlt && (
          <div id="abo-auswahl" className="mw-karte" style={{ padding: 24, marginTop: 20, borderColor: "var(--mw-ink)", scrollMarginBottom: 20 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 6 }}>
              <IconBadge name={iconNameFuerKategorie(gewaehlt.label)} size={44} />
              <h2 className="mw-h2" style={{ fontSize: 24 }}>{gewaehlt.label}</h2>
            </div>
            <p className="mw-muted" style={{ margin: "0 0 18px" }}>{gewaehlt.beschreibung}</p>
            <div className="mw-zwei-spalten">
              <div className="mw-karte" style={{ padding: 18, background: "var(--mw-soft)" }}>
                <div className="mw-muted" style={{ fontSize: 14 }}>Einführungspreis</div>
                <div className="mw-serif" style={{ fontSize: 30, fontWeight: 700, color: "var(--mw-ink)", margin: "4px 0 12px" }}>{euro(gewaehlt.einfuehrung)}<span className="mw-muted" style={{ fontSize: 15, fontWeight: 400 }}> / Monat</span></div>
                <button className="mw-btn zwei voll" onClick={() => handleCheckout(gewaehlt.key, "einfuehrung")} disabled={!!loading}>
                  {loading === `${gewaehlt.key}-einfuehrung` ? "…" : "Einführung wählen"}
                </button>
              </div>
              <div className="mw-karte" style={{ padding: 18 }}>
                <div className="mw-muted" style={{ fontSize: 14 }}>Regulärer Preis</div>
                <div className="mw-serif" style={{ fontSize: 30, fontWeight: 700, color: "var(--mw-ink)", margin: "4px 0 12px" }}>{euro(gewaehlt.regulaer)}<span className="mw-muted" style={{ fontSize: 15, fontWeight: 400 }}> / Monat</span></div>
                <button className="mw-btn voll" onClick={() => handleCheckout(gewaehlt.key, "regulaer")} disabled={!!loading}>
                  {loading === `${gewaehlt.key}-regulaer` ? "…" : "Regulär wählen"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
