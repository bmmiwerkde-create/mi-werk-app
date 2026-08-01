export const KATEGORIEN = [
  { key: "beauty", label: "Beauty & Pflege", emoji: "💇", beschreibung: "Friseure, Kosmetiker, Nagelstudios, Massagen, Tattoo & Piercing", einfuehrung: 9.99, regulaer: 19.99 },
  { key: "tiere", label: "Tiere", emoji: "🐾", beschreibung: "Tierärzte, Hundetrainer, Tierbetreuung, Tierpflege", einfuehrung: 14.99, regulaer: 24.99 },
  { key: "fitness", label: "Fitness", emoji: "🏋️", beschreibung: "Personal Trainer, Fitnessstudios, Yoga, Ernährungsberatung", einfuehrung: 14.99, regulaer: 24.99 },
  { key: "handwerk", label: "Handwerk", emoji: "🔨", beschreibung: "Elektriker, Klempner, Maler, Schreiner, Reinigung", einfuehrung: 19.99, regulaer: 34.99 },
  { key: "auto", label: "Auto", emoji: "🚗", beschreibung: "KFZ-Werkstätten, Pannenhilfe, Umzugshelfer, Fahrdienste", einfuehrung: 19.99, regulaer: 34.99 },
  { key: "gesundheit", label: "Gesundheit", emoji: "🏥", beschreibung: "Ärzte, Zahnärzte, Physiotherapeuten, Psychologen, Heilpraktiker", einfuehrung: 29.99, regulaer: 44.99 },
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
