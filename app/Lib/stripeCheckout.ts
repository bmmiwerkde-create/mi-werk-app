import Stripe from "stripe"
import { findKategorie, findPreis, AboTyp } from "./kategorien"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function createAboCheckoutSession(params: {
  kategorie: string
  typ: AboTyp
  userId: string
  email?: string
}) {
  const { kategorie, typ, userId, email } = params
  const kat = findKategorie(kategorie)
  const preis = findPreis(kategorie, typ)
  if (!kat || preis === undefined) {
    throw new Error(`Unbekannte Kategorie oder Tarif: ${kategorie}/${typ}`)
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: Math.round(preis * 100),
          recurring: { interval: "month" },
          product_data: {
            name: `mi-werk Abo – ${kat.label} (${typ === "regulaer" ? "Regulär" : "Einführung"})`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: { userId, kategorie, typ },
    success_url: `${baseUrl}/dashboard?abo=success`,
    cancel_url: `${baseUrl}/abo?abo=canceled`,
  })

  return session
}
