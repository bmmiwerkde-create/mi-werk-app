import { NextResponse } from "next/server"
import { createAboCheckoutSession } from "../../Lib/stripeCheckout"

export async function POST(req: Request) {
  const { kategorie, typ, userId, email } = await req.json()

  if (!kategorie || !typ || !userId) {
    return NextResponse.json({ error: "kategorie, typ und userId sind erforderlich" }, { status: 400 })
  }

  try {
    const session = await createAboCheckoutSession({ kategorie, typ, userId, email })
    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error("Checkout-Fehler:", err)
    return NextResponse.json({ error: err.message || "Checkout fehlgeschlagen" }, { status: 500 })
  }
}
