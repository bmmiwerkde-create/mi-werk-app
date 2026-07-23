import { NextResponse } from "next/server"
import { stripe } from "../../Lib/stripeCheckout"
import { supabase } from "../../Lib/supabase"

export async function POST(req: Request) {
  const { userId } = await req.json()

  if (!userId) {
    return NextResponse.json({ error: "userId ist erforderlich" }, { status: 400 })
  }

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
