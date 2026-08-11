import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)

export async function POST(req: Request) {
  const { dienstleisterId, ort, postleitzahl } = await req.json()

  if (!dienstleisterId || !ort) {
    return NextResponse.json({ error: "dienstleisterId und ort sind erforderlich" }, { status: 400 })
  }

  const query = [postleitzahl, ort, "Deutschland"].filter(Boolean).join(", ")

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=de&q=${encodeURIComponent(query)}`,
      { headers: { "User-Agent": "mi-werk.de Geocoding (kontakt@mi-werk.de)" } }
    )
    const results = await res.json()

    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json({ error: "Kein Ort gefunden" }, { status: 404 })
    }

    const lat = parseFloat(results[0].lat)
    const lng = parseFloat(results[0].lon)

    const { error } = await supabase.from("dienstleister").update({ lat, lng }).eq("id", dienstleisterId)
    if (error) {
      console.error("Geocode: DB-Update fehlgeschlagen", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ lat, lng })
  } catch (err: any) {
    console.error("Geocode-Fehler:", err)
    return NextResponse.json({ error: err.message || "Geocoding fehlgeschlagen" }, { status: 500 })
  }
}
