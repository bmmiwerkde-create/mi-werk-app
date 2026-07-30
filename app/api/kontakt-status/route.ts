import { NextResponse } from "next/server"
import { supabaseAdmin } from "../../Lib/supabaseAdmin"

export async function POST(req: Request) {
  const { dienstleisterId, käuferEmail } = await req.json()

  if (!dienstleisterId || !käuferEmail) {
    return NextResponse.json({ error: "dienstleisterId und käuferEmail sind erforderlich" }, { status: 400 })
  }

  const { data: eigene, error: eigeneError } = await supabaseAdmin
    .from("freischaltungen")
    .select("id")
    .eq("dienstleister_id", dienstleisterId)
    .eq("käufer_email", käuferEmail)
    .limit(1)

  if (eigeneError) {
    console.error("kontakt-status Fehler:", eigeneError)
    return NextResponse.json({ error: eigeneError.message }, { status: 500 })
  }

  if (eigene && eigene.length > 0) {
    return NextResponse.json({ freigeschaltet: true, guthaben: 0 })
  }

  const { data: letzte, error: letzteError } = await supabaseAdmin
    .from("freischaltungen")
    .select("guthaben")
    .eq("käufer_email", käuferEmail)
    .order("erstellt_am", { ascending: false })
    .limit(1)

  if (letzteError) {
    console.error("kontakt-status Fehler:", letzteError)
    return NextResponse.json({ error: letzteError.message }, { status: 500 })
  }

  return NextResponse.json({ freigeschaltet: false, guthaben: letzte?.[0]?.guthaben || 0 })
}
