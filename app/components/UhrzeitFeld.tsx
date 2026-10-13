'use client'
// Uhrzeitfeld zum Tippen (HH:MM, Doppelpunkt kommt automatisch) mit Uhr-Knopf.
// Ersetzt <input type="time">, das in Safari wie das Datumsfeld nach kurzer Pause weiterspringt.

import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icons'

function textZuZeit(text: string) {
  const m = text.match(/^(\d{2}):(\d{2})$/)
  if (!m || Number(m[1]) > 23 || Number(m[2]) > 59) return ''
  return text
}

function formatieren(eingabe: string) {
  const z = eingabe.replace(/\D/g, '').slice(0, 4)
  return z.length <= 2 ? z : `${z.slice(0, 2)}:${z.slice(2)}`
}

export default function UhrzeitFeld({ id, value, onChange, onKeyDown }: {
  id?: string
  value: string
  onChange: (zeit: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}) {
  const [text, setText] = useState(value)
  const uhr = useRef<HTMLInputElement>(null)

  // Von außen zurückgesetzt oder per URL vorbelegt
  useEffect(() => {
    if (value !== textZuZeit(text)) setText(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  function tippen(e: React.ChangeEvent<HTMLInputElement>) {
    const neu = formatieren(e.target.value)
    setText(neu)
    onChange(textZuZeit(neu))
  }

  return (
    <div className="mw-datum">
      <input
        id={id}
        className={'mw-feld' + (text.length === 5 && !textZuZeit(text) ? ' fehler' : '')}
        value={text}
        onChange={tippen}
        onKeyDown={onKeyDown}
        placeholder="HH:MM"
        inputMode="numeric"
        autoComplete="off"
        maxLength={5}
      />
      <button type="button" aria-label="Uhrzeit auswählen" onClick={() => uhr.current?.showPicker?.()}>
        <Icon name="clock" size={18} />
      </button>
      <input
        ref={uhr}
        type="time"
        tabIndex={-1}
        aria-hidden="true"
        value={value}
        onChange={e => { setText(e.target.value); onChange(e.target.value) }}
      />
    </div>
  )
}
