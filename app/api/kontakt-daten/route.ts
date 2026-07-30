import { NextResponse } from "next/server"
import { supabaseAdmin } from "../../Lib/supabaseAdmin"

export async function POST(req: Request) {
  const { dienstleisterId, käuferEmail } = await req.json()

  if (!dienstleisterId || !käuferEmail) {
    return NextResponse.json({ error: "dienstleisterId und käuferEmail sind erforderlich" }, { status: 400 })
  }

  const { data: freischaltung, error: freischaltungError } = await supabaseAdmin
    .from("freischaltungen")
    .select("id")
    .eq("dienstleister_id", dienstleisterId)
    .eq("käufer_email", käuferEmail)
    .limit(1)

  if (freischaltungError) {
    console.error("kontakt-daten Fehler:", freischaltungError)
    return NextResponse.json({ error: freischaltungError.message }, { status: 500 })
  }

  if (!freischaltung || freischaltung.length === 0) {
    return NextResponse.json({ error: "Nicht freigeschaltet" }, { status: 403 })
  }

  const { data: profil, error: profilError } = await supabaseAdmin
    .from("dienstleister")
    .select("email, telefon")
    .eq("id", dienstleisterId)
    .single()

  if (profilError) {
    console.error("kontakt-daten Profil-Fehler:", profilError)
    return NextResponse.json({ error: profilError.message }, { status: 500 })
  }

  return NextResponse.json({ email: profil?.email || null, telefon: profil?.telefon || null })
}
