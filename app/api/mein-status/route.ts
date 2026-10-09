import { NextResponse } from 'next/server'
import { supabaseAdmin, nutzerAusAnfrage } from '../../Lib/supabaseAdmin'

// Private Angaben zum eigenen Profil (nur für den angemeldeten Inhaber)
export async function GET(req: Request) {
  const user = await nutzerAusAnfrage(req)
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 })

  const { data } = await supabaseAdmin
    .from('dienstleister')
    .select('ics_url, stripe_customer_id, kalender_sync_am')
    .eq('user_id', user.id)
    .maybeSingle()

  return NextResponse.json({ ics_url: data?.ics_url || '', hat_stripe: !!data?.stripe_customer_id, kalender_sync_am: data?.kalender_sync_am || null })
}
