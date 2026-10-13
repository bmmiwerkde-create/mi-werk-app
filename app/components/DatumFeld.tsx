'use client'
// Datumsfeld zum Tippen (TT.MM.JJJJ, Punkte kommen automatisch) mit Kalender-Knopf.
// Ersetzt <input type="date">: Safari springt dort nach kurzer Pause ins nächste Segment,
// wer langsam tippt, bekommt ein falsches Datum.

import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icons'

function isoZuText(iso: string) {
  const [j, m, t] = iso.split('-')
  return iso ? `${t}.${m}.${j}` : ''
}

function textZuIso(text: string) {
  const m = text.match(/^(\d{2})\.(\d{2})\.(\d{4})$/)
  if (!m) return ''
  const [, t, mo, j] = m
  const d = new Date(Number(j), Number(mo) - 1, Number(t))
  // Ungültige Tage wie 31.02. ablehnen
  if (d.getFullYear() !== Number(j) || d.getMonth() !== Number(mo) - 1 || d.getDate() !== Number(t)) return ''
  return `${j}-${mo}-${t}`
}

function formatieren(eingabe: string) {
  const z = eingabe.replace(/\D/g, '').slice(0, 8)
  if (z.length <= 2) return z
  if (z.length <= 4) return `${z.slice(0, 2)}.${z.slice(2)}`
  return `${z.slice(0, 2)}.${z.slice(2, 4)}.${z.slice(4)}`
}

export default function DatumFeld({ id, value, onChange, onKeyDown }: {
  id?: string
  value: string
  onChange: (iso: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}) {
  const [text, setText] = useState(isoZuText(value))
  const kalender = useRef<HTMLInputElement>(null)

  // Von außen zurückgesetzt (z. B. „Filter zurücksetzen“) oder per URL vorbelegt
  useEffect(() => {
    if (value !== textZuIso(text)) setText(isoZuText(value))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  function tippen(e: React.ChangeEvent<HTMLInputElement>) {
    const neu = formatieren(e.target.value)
    setText(neu)
    onChange(textZuIso(neu))
  }

  const unvollstaendig = text.length > 0 && !textZuIso(text)

  return (
    <div className="mw-datum">
      <input
        id={id}
        className={'mw-feld' + (unvollstaendig && text.length === 10 ? ' fehler' : '')}
        value={text}
        onChange={tippen}
        onKeyDown={onKeyDown}
        placeholder="TT.MM.JJJJ"
        inputMode="numeric"
        autoComplete="off"
        maxLength={10}
      />
      <button type="button" aria-label="Kalender öffnen" onClick={() => kalender.current?.showPicker?.()}>
        <Icon name="calendar" size={18} />
      </button>
      <input
        ref={kalender}
        type="date"
        tabIndex={-1}
        aria-hidden="true"
        value={value}
        onChange={e => { setText(isoZuText(e.target.value)); onChange(e.target.value) }}
      />
    </div>
  )
}
