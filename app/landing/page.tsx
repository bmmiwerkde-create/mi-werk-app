'use client'

export default function LandingPage() {
  return (
    <main className="mw-eingang">
      <div className="mw-logo">Mi-<span>Werk</span></div>
      <p>Dienstleister in deiner Region, und du siehst sofort, wer Zeit hat.</p>
      <div className="mw-eingang-wege">
        <a className="mw-btn" href="/suche">Ich suche einen Dienstleister</a>
        <a className="mw-btn zwei" href="/fuer-dienstleister">Ich bin Dienstleister</a>
      </div>
    </main>
  )
}
