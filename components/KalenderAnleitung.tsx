// Aufklappbare Anleitungen: Wo finde ich den Link meines Kalenders?

const ANLEITUNGEN: [string, string, string][] = [
  ['iPhone / iCloud', 'Ein Link für iPhone- bzw. iCloud-Kalender',
    'Kalender-App öffnen → unten auf das Kalender-Symbol → beim iCloud-Kalender auf ⓘ → „Öffentlicher Kalender“ einschalten → „Link teilen …“ → „Kopieren“.'],
  ['Google Kalender', 'Am Computer im Browser',
    'calendar.google.com öffnen → oben rechts auf das Zahnrad → „Einstellungen“ → links unter „Einstellungen für meine Kalender“ deinen Kalender wählen → „Kalender integrieren“ → „Privatadresse im iCal-Format“ kopieren.'],
  ['Outlook', 'Am Computer auf outlook.com',
    'Zahnrad → „Kalender“ → „Freigegebene Kalender“ → unter „Kalender veröffentlichen“ deinen Kalender wählen und „Kann sehen, wann ich beschäftigt bin“ einstellen → „Veröffentlichen“ → den ICS-Link kopieren.'],
]

export default function KalenderAnleitung() {
  return (
    <div style={{ marginTop: 18 }}>
      <div className="mw-label" style={{ marginBottom: 8 }}>Wo finde ich meinen Link?</div>
      {ANLEITUNGEN.map(([titel, unter, text]) => (
        <details key={titel} className="mw-aufklapp">
          <summary><b>{titel}</b><span className="mw-muted">{unter}</span></summary>
          <p>{text}</p>
        </details>
      ))}
      <p className="mw-muted" style={{ fontSize: 13, margin: '10px 0 0' }}>
        Tipp: Bei Outlook kannst du einstellen, dass nur „beschäftigt“ sichtbar ist. Dann enthält nicht einmal der Link selbst Details deiner Termine.
      </p>
    </div>
  )
}
