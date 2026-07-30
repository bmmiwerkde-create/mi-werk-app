import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "../../Lib/stripe"
import { supabaseAdmin } from "../../Lib/supabaseAdmin"
import { KONTAKT_PAKETE, PaketKey } from "../../Lib/kontaktPakete"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature") as string

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET as string)
  } catch (err) {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const { dienstleisterId, käuferEmail, paket } = session.metadata || {}

    if (dienstleisterId && käuferEmail && paket && paket in KONTAKT_PAKETE) {
      const gekauftesGuthaben = KONTAKT_PAKETE[paket as PaketKey].guthaben
      const { error } = await supabaseAdmin.from("freischaltungen").insert({
        käufer_email: käuferEmail,
        dienstleister_id: Number(dienstleisterId),
        guthaben: gekauftesGuthaben - 1,
      })
      if (error) console.error(`Webhook: freischaltungen-Insert fehlgeschlagen (session=${session.id}):`, error)
    } else {
      console.error("Webhook: checkout.session.completed ohne vollständige Kontakt-Metadata", session.id, session.metadata)
    }
  }

  return NextResponse.json({ received: true })
}
