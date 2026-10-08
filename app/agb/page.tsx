import Kopfzeile from '@/components/Kopfzeile'

export default function AGB() {
  return (
    <div>
      <Kopfzeile />
      <div className="mw-text-seite">
        <h1 className="mw-h1" style={{ marginBottom: 8 }}>Allgemeine Geschäftsbedingungen</h1>
        <p className="mw-muted">Stand: Juni 2026</p>
        <section>
          <h2>1. Geltungsbereich</h2>
          <p>Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der Plattform Mi-Werk, erreichbar unter mi-werk.de, betrieben von Ursula Middeldorf (nachfolgend „Betreiber"). Mit der Registrierung oder Nutzung der Plattform akzeptiert der Nutzer diese AGB in ihrer jeweils gültigen Fassung.</p>
        </section>
        <section>
          <h2>2. Leistungsbeschreibung</h2>
          <p>Mi-Werk ist eine Vermittlungsplattform, die Dienstleister und Suchende zusammenbringt. Der Betreiber ist nicht Partei der zwischen Dienstleistern und Suchenden geschlossenen Verträge. Mi-Werk übernimmt keine Haftung für die Qualität, Zuverlässigkeit oder Rechtmäßigkeit der angebotenen Dienstleistungen.</p>
        </section>
        <section>
          <h2>3. Registrierung & Profil</h2>
          <p>Die Registrierung als Dienstleister ist kostenlos. Der Nutzer verpflichtet sich, wahrheitsgemäße Angaben zu machen und sein Profil aktuell zu halten. Pro Person ist nur ein Konto erlaubt. Der Betreiber behält sich vor, Konten bei Verstößen gegen diese AGB zu sperren oder zu löschen.</p>
        </section>
        <section>
          <h2>4. Kostenlose Phase & Abo-Modell</h2>
          <p>Nach der Registrierung ist das Profil für die ersten 12 Monate kostenlos und öffentlich sichtbar. Im 11. Monat erhält der Dienstleister eine automatische E-Mail mit einem Hinweis auf das bevorstehende Ende der kostenlosen Phase.</p>
          <ul>
            <li>Monat 13–14: Einführungspreis (je nach Kategorie)</li>
            <li>Ab Monat 15: regulärer Preis (je nach Kategorie)</li>
            <li>Ohne aktives Abo wird das Profil automatisch ausgeblendet</li>
          </ul>
        </section>
        <section>
          <h2>5. Zahlung</h2>
          <p>Die Zahlungsabwicklung erfolgt über den Zahlungsdienstleister Stripe. Das Abo wird monatlich abgerechnet und verlängert sich automatisch, sofern es nicht rechtzeitig gekündigt wird. Eine Kündigung ist jederzeit zum Ende des laufenden Abrechnungszeitraums möglich.</p>
        </section>
        <section>
          <h2>6. Widerrufsrecht</h2>
          <p>Verbrauchern steht grundsätzlich ein 14-tägiges Widerrufsrecht zu. Das Widerrufsrecht erlischt vorzeitig, wenn der Nutzer ausdrücklich zustimmt, dass mit der Ausführung der Dienstleistung vor Ablauf der Widerrufsfrist begonnen wird.</p>
        </section>
        <section>
          <h2>7. Pflichten der Nutzer</h2>
          <ul>
            <li>Keine falschen oder irreführenden Angaben zu machen</li>
            <li>Keine rechtswidrigen oder diskriminierenden Inhalte einzustellen</li>
            <li>Die Plattform nicht für Spam zu nutzen</li>
            <li>Zugangsdaten vertraulich zu behandeln</li>
          </ul>
        </section>
        <section>
          <h2>8. Haftung</h2>
          <p>Der Betreiber haftet nicht für Schäden, die durch die Nutzung der Plattform entstehen, sofern diese nicht auf Vorsatz oder grober Fahrlässigkeit beruhen.</p>
        </section>
        <section>
          <h2>9. Datenschutz</h2>
          <p>Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer <a href="/datenschutz">Datenschutzerklärung</a>.</p>
        </section>
        <section>
          <h2>10. Änderungen der AGB</h2>
          <p>Der Betreiber behält sich vor, diese AGB jederzeit zu ändern. Registrierte Nutzer werden über wesentliche Änderungen per E-Mail informiert.</p>
        </section>
        <section>
          <h2>11. Anwendbares Recht</h2>
          <p>Es gilt das Recht der Bundesrepublik Deutschland.</p>
        </section>
        <section>
          <h2>12. Kontakt</h2>
          <p>Bei Fragen: <a href="/kontakt">mi-werk.de/kontakt</a></p>
        </section>
      </div>
    </div>
  )
}
