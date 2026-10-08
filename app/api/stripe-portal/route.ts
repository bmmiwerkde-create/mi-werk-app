import { NextResponse } from "next/server"
import { stripe } from "../../Lib/stripeCheckout"
import { supabaseAdmin as supabase, nutzerAusAnfrage } from "../../Lib/supabaseAdmin"

export async function POST(req: Request) {
  // Nur der angemeldete Inhaber darf sein eigenes Abo verwalten
  const user = await nutzerAusAnfrage(req)
  if (!user) {
    return NextResponse.json({ error: "Bitte melde dich erneut an." }, { status: 401 })
  }
  const userId = user.id

  const { data: profil, error } = await supabase
    .from("dienstleister")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .single()

  if (error || !profil?.stripe_customer_id) {
    return NextResponse.json({ error: "Kein Stripe-Kunde gefunden. Bitte zuerst ein Abo abschließen." }, { status: 404 })
  }

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: profil.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    })
    return NextResponse.json({ url: portalSession.url })
  } catch (err: any) {
    console.error("Stripe-Portal-Fehler:", err)
    return NextResponse.json({ error: err.message || "Portal konnte nicht erstellt werden" }, { status: 500 })
  }
}
