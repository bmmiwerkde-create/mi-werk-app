// Verfügbarkeit eines Tages aus Arbeitszeiten und Kalenderterminen.
// Wer keine Arbeitszeiten eingetragen hat, arbeitet laut Standard Mo–Fr 8–18 Uhr.

export type Arbeitszeiten = { tage: number[]; von: string; bis: string } // tage: 1 = Mo … 7 = So
export type TagStatus = 'geschlossen' | 'frei' | 'teilweise' | 'belegt'
type Termin = { start_zeit: string; end_zeit: string }

export const STANDARD_ARBEITSZEITEN: Arbeitszeiten = { tage: [1, 2, 3, 4, 5], von: '08:00', bis: '18:00' }
export const WOCHENTAGE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

// Kürzere Lücken zählen nicht als „noch frei“
const MIN_LUECKE_MIN = 30

export function arbeitszeitenVon(roh: unknown): Arbeitszeiten {
  const a = roh as Partial<Arbeitszeiten> | null
  if (!a || !Array.isArray(a.tage) || !/^\d{2}:\d{2}$/.test(a.von || '') || !/^\d{2}:\d{2}$/.test(a.bis || '')) return STANDARD_ARBEITSZEITEN
  return { tage: a.tage, von: a.von as string, bis: a.bis as string }
}

function wochentag(tag: Date) {
  return tag.getDay() === 0 ? 7 : tag.getDay()
}

function zeitAm(tag: Date, hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number)
  const d = new Date(tag)
  d.setHours(h, m, 0, 0)
  return d
}

function uhrzeit(d: Date) {
  return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

// Freie Zeitfenster eines Tages innerhalb der Arbeitszeit
export function freieZeiten(tag: Date, termine: Termin[], az: Arbeitszeiten): { von: string; bis: string }[] {
  if (!az.tage.includes(wochentag(tag))) return []
  const ende = zeitAm(tag, az.bis).getTime()
  // Heute zählt nur die restliche Zeit, auf die nächste Viertelstunde aufgerundet
  const viertel = 15 * 60000
  const start = Math.max(zeitAm(tag, az.von).getTime(), Math.ceil(Date.now() / viertel) * viertel)
  if (ende <= start) return []

  const belegt = termine
    .map(t => [Math.max(new Date(t.start_zeit).getTime(), start), Math.min(new Date(t.end_zeit).getTime(), ende)])
    .filter(([s, e]) => e > s)
    .sort((a, b) => a[0] - b[0])

  const frei: { von: string; bis: string }[] = []
  let ab = start
  for (const [s, e] of belegt) {
    if (s - ab >= MIN_LUECKE_MIN * 60000) frei.push({ von: uhrzeit(new Date(ab)), bis: uhrzeit(new Date(s)) })
    ab = Math.max(ab, e)
  }
  if (ende - ab >= MIN_LUECKE_MIN * 60000) frei.push({ von: uhrzeit(new Date(ab)), bis: uhrzeit(new Date(ende)) })
  return frei
}

export function tagStatus(tag: Date, termine: Termin[], az: Arbeitszeiten): TagStatus {
  if (!az.tage.includes(wochentag(tag))) return 'geschlossen'
  // Heute nach Feierabend: nicht „belegt“, sondern vorbei
  if (Date.now() >= zeitAm(tag, az.bis).getTime()) return 'geschlossen'
  const frei = freieZeiten(tag, termine, az)
  if (frei.length === 0) return 'belegt'
  const tagStart = zeitAm(tag, az.von).getTime(), tagEnde = zeitAm(tag, az.bis).getTime()
  const hatTermin = termine.some(t => new Date(t.start_zeit).getTime() < tagEnde && new Date(t.end_zeit).getTime() > tagStart)
  return hatTermin ? 'teilweise' : 'frei'
}

// Ist der Dienstleister zu genau diesem Zeitpunkt verfügbar?
export function zeitpunktFrei(zeitpunkt: Date, termine: Termin[], az: Arbeitszeiten) {
  if (!az.tage.includes(wochentag(zeitpunkt))) return false
  const hhmm = zeitpunkt.toTimeString().slice(0, 5)
  if (hhmm < az.von || hhmm >= az.bis) return false
  const t = zeitpunkt.getTime()
  return !termine.some(e => t >= new Date(e.start_zeit).getTime() && t < new Date(e.end_zeit).getTime())
}

export const STATUS_TEXT: Record<TagStatus, string> = {
  geschlossen: 'geschlossen', frei: 'frei', teilweise: 'teilweise frei', belegt: 'belegt',
}

// „Mo–Fr, 08:00–18:00 Uhr“ – aufeinanderfolgende Tage werden zusammengefasst
export function arbeitszeitenText(az: Arbeitszeiten) {
  const tage = [...az.tage].sort((a, b) => a - b)
  if (tage.length === 0) return 'keine Arbeitstage eingetragen'
  const teile: string[] = []
  let start = tage[0], vor = tage[0]
  for (const t of [...tage.slice(1), 99]) {
    if (t === vor + 1) { vor = t; continue }
    teile.push(start === vor ? WOCHENTAGE[start - 1] : `${WOCHENTAGE[start - 1]}–${WOCHENTAGE[vor - 1]}`)
    start = vor = t
  }
  return `${tage.length === 7 ? 'täglich' : teile.join(', ')}, ${az.von}–${az.bis} Uhr`
}
