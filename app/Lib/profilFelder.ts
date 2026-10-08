// Felder, die die Seite von Dienstleister-Profilen lesen darf.
// Kalender-Link (ics_url) und Stripe-Daten sind absichtlich NICHT dabei: Die Datenbank gibt sie nur dem Server heraus.
export const PROFIL_FELDER =
  'id, user_id, name, gewerk, ort, postleitzahl, beschreibung, preis, telefon, website, qualifikationen, profilbild, logo, fotos, email, umkreis, verfuegbar_ab, lat, lng, abo_aktiv, erstellt_am, created_at'

// Felder, die ein Dienstleister im Profilformular selbst ändern darf.
// Alles andere (z. B. abo_aktiv, Stripe-Daten, Koordinaten) setzt nur der Server.
export const BEARBEITBAR = [
  'name', 'gewerk', 'ort', 'postleitzahl', 'beschreibung', 'preis',
  'telefon', 'website', 'qualifikationen', 'email', 'umkreis', 'verfuegbar_ab',
] as const

export function nurBearbeitbare(obj: Record<string, any>) {
  const out: Record<string, any> = {}
  for (const k of BEARBEITBAR) if (k in obj && obj[k] !== undefined) out[k] = obj[k]
  return out
}
