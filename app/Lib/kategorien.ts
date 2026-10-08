export const KATEGORIEN = [
  { key: "beauty", label: "Beauty & Pflege", emoji: "💇", beschreibung: "Friseure, Kosmetiker, Nagelstudios, Massagen, Tattoo & Piercing", einfuehrung: 9.99, regulaer: 19.99 },
  { key: "bildung", label: "Bildung & Coaching", emoji: "🎓", beschreibung: "Bewerbungscoaching, Life Coach, Musikunterricht, Nachhilfe, Sprachkurse", einfuehrung: 14.99, regulaer: 24.99 },
  { key: "familie", label: "Familie & Soziales", emoji: "👶", beschreibung: "Babysitter, Seniorenbetreuung, Kinderbetreuung, Pflegedienst", einfuehrung: 14.99, regulaer: 24.99 },
  { key: "tiere", label: "Tiere", emoji: "🐾", beschreibung: "Tierärzte, Hundetrainer, Tierbetreuung, Tierpflege", einfuehrung: 14.99, regulaer: 24.99 },
  { key: "fitness", label: "Fitness & Sport", emoji: "🏋️", beschreibung: "Personal Trainer, Fitnessstudios, Yoga, Ernährungsberatung", einfuehrung: 14.99, regulaer: 24.99 },
  { key: "catering", label: "Catering & Essen", emoji: "🍽️", beschreibung: "Catering, Foodtruck, Getränkeservice, Grillservice, Kochservice, Meal Prep, Partyservice", einfuehrung: 34.99, regulaer: 49.99 },
  { key: "garten", label: "Garten & Außen", emoji: "🌿", beschreibung: "Baumfällung, Gartenbau, Rasenpflege, Landschaftspflege, Pflasterer, Teichbau, Zaunbau", einfuehrung: 19.99, regulaer: 34.99 },
  { key: "handwerk", label: "Haus & Handwerk", emoji: "🔨", beschreibung: "Elektriker, Klempner, Maler, Schreiner, Reinigung", einfuehrung: 19.99, regulaer: 34.99 },
  { key: "buero", label: "Büro & Verwaltung", emoji: "📋", beschreibung: "Anwälte, Buchhaltung, Steuerberatung, Übersetzung, Virtuelle Assistenz", einfuehrung: 54.99, regulaer: 69.99 },
  { key: "events", label: "Events & Veranstaltung", emoji: "🎉", beschreibung: "DJ/Musik, Eventplanung, Moderation, Zauberer, Hochzeitsfotograf", einfuehrung: 34.99, regulaer: 49.99 },
  { key: "auto", label: "Fahrzeuge & Mobilität", emoji: "🚗", beschreibung: "KFZ-Werkstätten, Pannenhilfe, Umzugshelfer, Fahrdienste", einfuehrung: 19.99, regulaer: 34.99 },
  { key: "transport", label: "Transport & Logistik", emoji: "🚛", beschreibung: "Entrümpelung, Möbelmontage, Schwertransport, Umzugsservice", einfuehrung: 34.99, regulaer: 49.99 },
  { key: "gesundheit", label: "Gesundheit", emoji: "🏥", beschreibung: "Ärzte, Zahnärzte, Physiotherapeuten, Psychologen, Heilpraktiker", einfuehrung: 29.99, regulaer: 44.99 },
  { key: "it", label: "IT & Digital", emoji: "💻", beschreibung: "Webentwicklung, App-Entwicklung, Grafikdesign, SEO/Marketing, Videoproduktion", einfuehrung: 29.99, regulaer: 44.99 },
  { key: "personal", label: "Personal", emoji: "🧑‍💼", beschreibung: "Personaler, Personalvermittlung, Lohnabrechnung, Vergütungsberatung, Fehlzeitenmanagement, Mitarbeiterbenefits", einfuehrung: 19.99, regulaer: 34.99 },
] as const

export type KategorieKey = typeof KATEGORIEN[number]["key"]
export type AboTyp = "einfuehrung" | "regulaer"

export function findKategorie(kategorie: string) {
  return KATEGORIEN.find((k) => k.key === kategorie)
}

export function findPreis(kategorie: string, typ: AboTyp) {
  const kat = findKategorie(kategorie)
  if (!kat) return undefined
  return typ === "regulaer" ? kat.regulaer : kat.einfuehrung
}
