import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { findKategorie, findPreis, AboTyp } from "../../Lib/kategorien";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch (err) {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const kategorie = session.metadata?.kategorie;
    const typ = session.metadata?.typ as AboTyp | undefined;

    if (userId) {
      const { data: updated, error } = await supabase.from("dienstleister").update({
        abo_aktiv: true,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
      }).eq("user_id", userId).select("name, email").single();

      if (error) {
        console.error(`Webhook: dienstleister-Update fehlgeschlagen (checkout.session.completed, userId=${userId}):`, error);
      } else {
        const empfaenger = session.customer_details?.email || updated?.email;
        const kat = kategorie ? findKategorie(kategorie) : undefined;
        const preis = kategorie && typ ? findPreis(kategorie, typ) : undefined;

        if (empfaenger) {
          try {
            await resend.emails.send({
              from: "mi-werk <noreply@mi-werk.de>",
              to: empfaenger,
              subject: "Dein Abo auf mi-werk.de ist aktiv",
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
                  <h2 style="color: #b45309;">Hallo ${updated?.name || ""},</h2>
                  <p>dein Abo auf <strong>mi-werk.de</strong> ist ab sofort aktiv${kat ? ` (${kat.label}${preis !== undefined ? `, ${preis}€/Monat` : ""})` : ""}.</p>
                  <p>Dein Profil bleibt damit dauerhaft sichtbar. Zahlungsmethode und Kündigung kannst du jederzeit im Dashboard unter "Abo verwalten" ändern.</p>
                  <a href="https://mi-werk.de/dashboard"
                     style="display: inline-block; margin-top: 1.5rem; padding: 12px 28px;
                            background: #b45309; color: white; text-decoration: none;
                            border-radius: 8px; font-weight: bold;">
                    Zum Dashboard
                  </a>
                  <p style="margin-top: 2rem; font-size: 13px; color: #666;">
                    Du erhältst diese Mail, weil ein Abo für dein Profil auf mi-werk.de abgeschlossen wurde.<br>
                    <a href="https://mi-werk.de/datenschutz" style="color: #666;">Datenschutz</a>
                  </p>
                </div>
              `,
            });
          } catch (mailError) {
            console.error(`Webhook: Bestätigungsmail fehlgeschlagen (userId=${userId}):`, mailError);
          }
        }
      }
    } else {
      console.error("Webhook: checkout.session.completed ohne userId in metadata", session.id);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const { error } = await supabase.from("dienstleister").update({
      abo_aktiv: false,
      stripe_subscription_id: null,
    }).eq("stripe_subscription_id", subscription.id);
    if (error) console.error(`Webhook: dienstleister-Update fehlgeschlagen (customer.subscription.deleted, subscriptionId=${subscription.id}):`, error);
  }

  return NextResponse.json({ received: true });
}
