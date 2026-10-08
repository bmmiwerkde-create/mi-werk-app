import Kopfzeile from '@/components/Kopfzeile'
const ABSCHNITTE: { titel: string; text: string[] }[] = [
  {
    titel: '1. Verantwortlicher',
    text: ['Mi-Werk UG (haftungsbeschränkt)\nBen Middeldorf\nForstring 24, 44869 Bochum\nE-Mail: bm.miwerk.de@gmail.com'],
  },
  {
    titel: '2. Kurzüberblick: Welche Daten wir verarbeiten',
    text: [
      'Suchende (Kundinnen und Kunden): Du brauchst kein Konto, um Dienstleister zu finden. Wir verlangen von dir keine Angaben und legen kein Profil über dich an. Wenn du einen Dienstleister kontaktierst, geschieht das über dein E-Mail-Programm direkt an den Dienstleister. Diese Nachrichten laufen nicht über mi-werk und werden von uns nicht gespeichert.',
      'Dienstleister: Für Registrierung, Profil, optionale Kalenderanbindung und Abo verarbeiten wir die unten beschriebenen Daten.',
    ],
  },
  {
    titel: '3. Hosting und Server-Logdaten',
    text: ['Diese Website wird bei Vercel Inc. gehostet. Beim Aufruf der Seite fallen technisch bedingt Server-Logdaten an (z. B. IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Browsertyp). Grundlage ist unser berechtigtes Interesse an einem sicheren und stabilen Betrieb (Art. 6 Abs. 1 lit. f DSGVO).'],
  },
  {
    titel: '4. Registrierung, Konto und Profil (Dienstleister)',
    text: [
      'Wir nutzen Supabase für Authentifizierung, Datenbank und Dateispeicherung. Bei der Registrierung speichern wir deine E-Mail-Adresse und dein Passwort (das Passwort wird nicht im Klartext gespeichert). Für dein Profil speichern wir die Angaben, die du selbst machst, z. B. Name, Tätigkeitsbereich, Ort, Postleitzahl, Beschreibung, Qualifikationen, Preis, Telefonnummer, Website und Profilbild.',
      'Achtung: Die Profilangaben sind öffentlich sichtbar. Gib nur Daten an, die du veröffentlichen möchtest. Grundlage ist die Durchführung des Nutzungsvertrags (Art. 6 Abs. 1 lit. b DSGVO). Wir speichern diese Daten, bis du dein Konto löschen lässt.',
    ],
  },
  {
    titel: '5. Kalenderanbindung (freiwillig)',
    text: [
      'Dienstleister können ihren Kalender freiwillig verbinden, damit Kundinnen und Kunden sehen, wann sie Zeit haben. Das geht über Google Kalender, Outlook (Microsoft) oder per Kalender-Link (z. B. iPhone/Apple-Kalender).',
      'Bei Google und Outlook erhalten wir lesenden Zugriff auf deinen Kalender. Beim Kalender-Link speichern wir den von dir eingefügten Link in deinem Profil und rufen darüber deine Termine ab. In allen Fällen speichern wir ausschließlich die Zeiträume deiner Termine als „belegt“. Titel, Orte, Teilnehmer oder Beschreibungen deiner Termine speichern wir nicht und zeigen sie nicht an. Öffentlich sichtbar ist nur, ob du an einem Tag frei oder belegt bist.',
      'Grundlage ist deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Du kannst sie jederzeit widerrufen, indem du den Zugriff bei Google bzw. Microsoft entziehst oder den Kalender-Link änderst bzw. entfernen lässt. Auf Wunsch löschen wir die gespeicherten Zeiträume (E-Mail genügt).',
    ],
  },
  {
    titel: '6. Bewertungen',
    text: [
      'Jede Besucherin und jeder Besucher kann auf Dienstleister-Profilen eine Bewertung abgeben, ohne Konto. Dabei speichern wir den von dir eingegebenen Namen, die Sterne, einen optionalen Kommentar und den Zeitpunkt. Die Bewertung ist öffentlich auf dem Profil sichtbar. Wähle deshalb einen Namen, unter dem du öffentlich erscheinen möchtest (z. B. nur den Vornamen).',
      'Grundlage sind dein Absenden der Bewertung (Art. 6 Abs. 1 lit. a DSGVO) und unser berechtigtes Interesse am Betrieb der Bewertungsfunktion (lit. f). Auf Anfrage löschen wir Bewertungen.',
    ],
  },
  {
    titel: '7. Zahlungsabwicklung',
    text: ['Zahlungen für das Abo werden über Stripe Inc. abgewickelt. Zahlungsdaten (z. B. Kartennummer) gibst du direkt bei Stripe ein; wir erhalten sie nicht. Grundlage ist die Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO). Abrechnungsdaten bewahren wir im Rahmen gesetzlicher Aufbewahrungspflichten auf (Art. 6 Abs. 1 lit. c DSGVO).'],
  },
  {
    titel: '8. E-Mail-Versand',
    text: ['Für Willkommens-, Erinnerungs- und Abo-Mails an Dienstleister sowie für interne Benachrichtigungen (z. B. wenn sich ein neuer Dienstleister registriert hat, mit Name, Tätigkeitsbereich, Ort und Beschreibung) nutzen wir den E-Mail-Dienst Resend. Dabei werden E-Mail-Adresse und Mail-Inhalt an Resend übermittelt. Grundlage ist die Vertragserfüllung bzw. unser berechtigtes Interesse (Art. 6 Abs. 1 lit. b und f DSGVO).'],
  },
  {
    titel: '9. Kartenansicht und Ortssuche',
    text: [
      'Für die Kartenansicht werden Kartenkacheln direkt von den Servern von OpenStreetMap geladen, die Kartensymbole von unpkg.com. Dabei wird deine IP-Adresse an diese Anbieter übermittelt.',
      'Um die Orte von Dienstleistern auf der Karte darzustellen, übermitteln wir den im Profil angegebenen Ort bzw. die Postleitzahl an den Geodienst Nominatim (OpenStreetMap). Daten von Suchenden werden dabei nicht übermittelt. Grundlage ist unser berechtigtes Interesse an einer funktionierenden Kartenansicht (Art. 6 Abs. 1 lit. f DSGVO).',
    ],
  },
  {
    titel: '10. Reichweitenmessung (Google Analytics und Vercel Web Analytics)',
    text: [
      'Nur mit deiner Zustimmung über das Cookie-Banner nutzen wir Google Analytics zur Reichweitenmessung. Dabei können Daten an Google übermittelt werden. Grundlage ist deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Du kannst sie jederzeit mit Wirkung für die Zukunft widerrufen, z. B. indem du die Cookies in deinem Browser löschst und die Abfrage erneut ablehnst.',
      'Außerdem nutzen wir Vercel Web Analytics, um zu zählen, wie oft unsere Seiten aufgerufen werden. Dabei werden keine Cookies gesetzt. Erfasst werden u. a. die aufgerufene Seite, die verweisende Seite, Land, Browser, Betriebssystem und Gerätetyp. Besuche werden nicht über mehrere Tage hinweg einer Person zugeordnet. Grundlage ist unser berechtigtes Interesse an einer datensparsamen Reichweitenmessung (Art. 6 Abs. 1 lit. f DSGVO).',
    ],
  },
  {
    titel: '11. Cookies',
    text: ['Wir verwenden technisch notwendige Cookies (z. B. für Anmeldung und Sitzung) sowie Analyse-Cookies nur mit deiner Zustimmung.'],
  },
  {
    titel: '12. Speicherdauer',
    text: ['Wir speichern personenbezogene Daten nur so lange, wie es für den jeweiligen Zweck erforderlich ist. Kontodaten und Profil bleiben bis zur Löschung deines Kontos gespeichert, danach löschen wir sie, soweit keine gesetzlichen Aufbewahrungspflichten entgegenstehen.'],
  },
  {
    titel: '13. Deine Rechte',
    text: ['Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Eine erteilte Einwilligung kannst du jederzeit widerrufen. Schreibe dazu an: bm.miwerk.de@gmail.com'],
  },
  {
    titel: '14. Beschwerderecht',
    text: ['Du kannst dich bei einer Datenschutzaufsichtsbehörde beschweren. Zuständig ist die Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen (LDI NRW).'],
  },
]

export default function Datenschutz() {
  return (
    <div>
      <Kopfzeile />
      <main className="mw-text-seite">
      <div>
                <h1 className="mw-h1" style={{ marginBottom: 24 }}>Datenschutzerklärung</h1>
        <p className="mw-muted" style={{ marginTop: -16 }}>Stand: Oktober 2026</p>
        {ABSCHNITTE.map((a) => (
          <section key={a.titel}>
            <h2>{a.titel}</h2>
            {a.text.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </section>
        ))}
      </div>
    </main>
    </div>
  );
}
