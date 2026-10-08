// Nur auf dem Server verwenden (API-Routen, Cronjobs): umgeht die Zugriffsregeln der Datenbank.
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Prüft den mitgeschickten Anmelde-Schlüssel und liefert den angemeldeten Nutzer (oder null)
export async function nutzerAusAnfrage(req: Request) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) return null
  const { data, error } = await supabaseAdmin.auth.getUser(token)
  return error ? null : data.user
}
