import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  // Dienstleister die vor genau 5 Monaten registriert haben
  const fuenfMonateAgo = new Date();
  fuenfMonateAgo.setMonth(fuenfMonateAgo.getMonth() - 5);
  
  const vonDatum = new Date(fuenfMonateAgo);
  vonDatum.setHours(0, 0, 0, 0);
  
  const bisDatum = new Date(fuenfMonateAgo);
  bisDatum.setHours(23, 59, 59, 999);

  const { data: dienstleister } = await supabase
    .from("dienstleister")
    .select("email, name, gewerk")
    .gte("erstellt_am", vonDatum.toISOString())
    .lte("erstellt_am", bisDatum.toISOString())
    .eq("abo_aktiv", false);

  if (!dienstleister || dienstleister.length === 0) {
    return NextResponse.json({ message: "Keine Emails heute" });
  }

  // Email an jeden senden
  for (const d of dienstleister) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Mi-Werk <noreply@mi-werk.de>",
        to: d.email,
        subject: "Deine Probezeit endet bald — jetzt Abo wählen",
        html: `
          <h2>Hallo ${d.name},</h2>
          <p>deine kostenlose Probezeit bei Mi-Werk endet in 30 Tagen.</p>
          <p>Damit dein Profil sichtbar bleibt, wähle jetzt dein Abo:</p>
          <a href="https://mi-werk.de/abo" style="background:#b87333;color:#000;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:bold;">
            Jetzt Abo wählen
          </a>
          <p>Deine Kategorie: <strong>${d.gewerk}</strong></p>
        `,
      }),
    });
  }

  return NextResponse.json({ message: `${dienstleister.length} Emails gesendet` });
}