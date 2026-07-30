import { NextResponse } from "next/server"
import { stripe } from "../../Lib/stripe"

export async function GET(req: Request) {
  const sessionId = new URL(req.url).searchParams.get("sessionId")

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId ist erforderlich" }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const email = session.customer_details?.email || session.customer_email
    return NextResponse.json({ email })
  } catch (err: any) {
    console.error("checkout-session Fehler:", err)
    return NextResponse.json({ error: err.message || "Session nicht gefunden" }, { status: 500 })
  }
}
