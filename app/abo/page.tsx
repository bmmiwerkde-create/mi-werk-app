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

  return (
    <div>
      <Kopfzeile aktiv="dashboard" />
      <main className="mw-wrap" style={{ maxWidth: 900, padding: "40px 20px 72px" }}>
        <h1 className="mw-h1" style={{ fontSize: 32, marginBottom: 6 }}>Abo wählen</h1>
        <p className="mw-muted" style={{ margin: "0 0 28px" }}>Die ersten 12 Monate sind kostenlos. Danach bleibt dein Profil mit einem Abo sichtbar.</p>
        <div style={{ display: "grid", gap: 12 }}>
          {KATEGORIEN.map((kat) => (
            <div key={kat.key} className="mw-karte" style={{ padding: 20, borderColor: userKategorie === kat.key ? "var(--mw-cta)" : undefined }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", flex: "1 1 280px", minWidth: 0 }}>
                  <IconBadge name={iconNameFuerKategorie(kat.label)} size={40} />
                  <div style={{ minWidth: 0 }}>
                    <h2 className="mw-h3" style={{ fontSize: 18 }}>
                      {kat.label}
                      {userKategorie === kat.key && <span className="mw-badge mw-frei" style={{ marginLeft: 10, verticalAlign: 2 }}>Deine Kategorie</span>}
                    </h2>
                    <p className="mw-muted" style={{ fontSize: 13, margin: 0 }}>{kat.beschreibung}</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button className="mw-btn zwei klein" onClick={() => handleCheckout(kat.key, "einfuehrung")} disabled={!!loading}>
                    {loading === `${kat.key}-einfuehrung` ? "…" : `Einführung ${euro(kat.einfuehrung)}/Monat`}
                  </button>
                  <button className="mw-btn klein" onClick={() => handleCheckout(kat.key, "regulaer")} disabled={!!loading}>
                    {loading === `${kat.key}-regulaer` ? "…" : `Regulär ${euro(kat.regulaer)}/Monat`}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
