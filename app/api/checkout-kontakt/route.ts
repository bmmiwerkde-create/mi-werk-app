import { NextResponse } from "next/server"
import { stripe } from "../../Lib/stripe"
import { KONTAKT_PAKETE, PaketKey } from "../../Lib/kontaktPakete"

export async function POST(req: Request) {
  const { dienstleisterId, käuferEmail, paket } = await req.json()

  if (!dienstleisterId || !paket || !(paket in KONTAKT_PAKETE)) {
    return NextResponse.json({ error: "dienstleisterId und ein gültiges paket sind erforderlich" }, { status: 400 })
  }

  const info = KONTAKT_PAKETE[paket as PaketKey]
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: käuferEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: Math.round(info.preis * 100),
            product_data: { name: `mi-werk Kontakt freischalten – ${info.label}` },
          },
          quantity: 1,
        },
      ],
      metadata: { dienstleisterId: String(dienstleisterId), paket },
      success_url: `${baseUrl}/profil/${dienstleisterId}?freischaltung=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/profil/${dienstleisterId}?freischaltung=canceled`,
    })
    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error("Checkout-Kontakt-Fehler:", err)
    return NextResponse.json({ error: err.message || "Checkout fehlgeschlagen" }, { status: 500 })
  }
}
