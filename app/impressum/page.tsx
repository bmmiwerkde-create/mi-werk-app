import Kopfzeile from '@/components/Kopfzeile'
export default function Impressum() {
  return (
    <div>
      <Kopfzeile />
      <main className="mw-text-seite">
      <div>
                <h1 className="mw-h1" style={{ marginBottom: 24 }}>Impressum</h1>
        <section><h2>Angaben gemäß § 5 TMG</h2><p>Mi-Werk UG (haftungsbeschränkt)<br />Ben Middeldorf<br />Forstring 24<br />44869 Bochum</p></section>
        <section><h2>Kontakt</h2><p>E-Mail: <a href="mailto:bm.miwerk.de@gmail.com">bm.miwerk.de@gmail.com</a></p></section>
        <section><h2>Handelsregister</h2><p>Registergericht: wird nach Eintragung ergänzt<br />Registernummer: wird nach Eintragung ergänzt</p></section>
        <section><h2>Umsatzsteuer-ID</h2><p>wird nach Erteilung durch das Finanzamt ergänzt</p></section>
        <section><h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2><p>Ben Middeldorf<br />Forstring 24<br />44869 Bochum</p></section>
        <section><h2>Streitschlichtung</h2><p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>. Wir nehmen nicht an Streitbeilegungsverfahren teil.</p></section>
      </div>
    </main>
    </div>
  );
}
