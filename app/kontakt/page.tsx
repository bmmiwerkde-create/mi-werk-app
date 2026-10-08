import Kopfzeile from '@/components/Kopfzeile'
export default function Kontakt() {
  return (
    <div>
      <Kopfzeile />
      <main className="mw-text-seite">
      <div>
                <h1 className="mw-h1" style={{ marginBottom: 24 }}>Kontakt</h1>
        <p>Bei Fragen erreichst du uns per E-Mail:</p>
        <a href="mailto:bm.miwerk.de@gmail.com">bm.miwerk.de@gmail.com</a>
        <div style={{ marginTop: 28 }}>
          <h2>Adresse</h2>
          <p>Mi-Werk UG (haftungsbeschränkt)<br />Ben Middeldorf<br />Forstring 24<br />44869 Bochum</p>
        </div>
      </div>
    </main>
    </div>
  );
}
