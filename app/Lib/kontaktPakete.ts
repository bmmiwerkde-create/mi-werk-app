export const KONTAKT_PAKETE = {
  "1er": { label: "1x Kontakt freischalten", preis: 4.99, guthaben: 1 },
  "5er": { label: "5er-Paket", preis: 14.99, guthaben: 5 },
  "10er": { label: "10er-Paket", preis: 24.99, guthaben: 10 },
} as const

export type PaketKey = keyof typeof KONTAKT_PAKETE
