// Felder, die die Seite von Dienstleister-Profilen lesen darf.
// Kalender-Link (ics_url) und Stripe-Daten sind absichtlich NICHT dabei: Die Datenbank gibt sie nur dem Server heraus.
export const PROFIL_FELDER =
  'id, user_id, name, gewerk, ort, postleitzahl, beschreibung, preis, telefon, website, qualifikationen, profilbild, logo, fotos, email, umkreis, verfuegbar_ab, lat, lng, abo_aktiv, erstellt_am, created_at'
