import Link from 'next/link'
import { Icon, IconBadge, iconNameFuerKategorie } from '../components/Icons'

const KATEGORIEN = [
  'Beauty & Pflege', 'Bildung & Coaching', 'Catering & Essen', 'Fitness & Sport', 'Garten & Außen',
  'Haus & Handwerk', 'IT & Digital', 'Büro & Verwaltung', 'Events & Veranstaltung', 'Fahrzeuge & Mobilität',
  'Familie & Soziales', 'Tiere', 'Transport & Logistik', 'Personal', 'Gesundheit',
]

const BELEGT = [3, 4, 10, 11, 12, 17, 18, 24, 25, 31]

const CSS = `
  .lp { background:#0A0A0A; color:#E8DDD4; font-family:system-ui,-apple-system,sans-serif; overflow-x:hidden; }
  .lp a { text-decoration:none; }
  .lp .lp-h { color:inherit; }
  .lp-wrap { max-width:1120px; margin:0 auto; padding:0 24px; }
  .lp-h { font-family:Georgia,serif; font-weight:700; letter-spacing:-0.5px; }
  .lp-kicker { font-size:12px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:#c8956c; margin-bottom:14px; }
  .lp-nav { position:sticky; top:0; z-index:50; background:rgba(10,10,10,0.8); backdrop-filter:blur(14px); border-bottom:1px solid rgba(255,255,255,0.06); }
  .lp-nav-in { display:flex; align-items:center; justify-content:space-between; height:64px; }
  .lp-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:15px 28px; border-radius:12px; font-size:15px; font-weight:600; transition:transform .15s, box-shadow .15s, background .15s; cursor:pointer; }
  .lp-btn:hover { transform:translateY(-2px); }
  .lp-btn-p { background:linear-gradient(135deg,#d9a479,#b87b4d); color:#0A0A0A; box-shadow:0 10px 30px rgba(200,149,108,0.25); }
  .lp-btn-p:hover { box-shadow:0 14px 38px rgba(200,149,108,0.38); }
  .lp-btn-s { border:1px solid rgba(200,149,108,0.5); color:#e0b48c; background:rgba(200,149,108,0.05); }
  .lp-btn-s:hover { background:rgba(200,149,108,0.12); }
  .lp-hero { position:relative; padding:96px 0 88px; text-align:center; background:radial-gradient(ellipse 900px 480px at 50% -80px, rgba(200,149,108,0.2), transparent 70%); }
  .lp-hero h1 { font-size:clamp(36px,6vw,68px); line-height:1.08; margin:0 auto 22px; max-width:880px; }
  .lp-hero p { font-size:clamp(16px,2vw,20px); line-height:1.6; color:#9A8878; max-width:640px; margin:0 auto 38px; }
  .lp-chips { display:flex; flex-wrap:wrap; gap:10px; justify-content:center; margin-top:34px; }
  .lp-chip { display:inline-flex; align-items:center; gap:8px; font-size:13px; color:#c9b9a8; padding:8px 16px; border-radius:999px; border:1px solid rgba(255,255,255,0.09); background:rgba(255,255,255,0.03); }
  .lp-sec { padding:96px 0; }
  .lp-sec-alt { background:linear-gradient(180deg,#0f0e0d,#0A0A0A); border-top:1px solid rgba(255,255,255,0.05); border-bottom:1px solid rgba(255,255,255,0.05); }
  .lp-title { font-size:clamp(28px,4vw,42px); line-height:1.15; margin:0 0 18px; }
  .lp-lead { font-size:17px; line-height:1.7; color:#9A8878; margin:0 0 28px; }
  .lp-two { display:grid; grid-template-columns:1fr 1fr; gap:56px; align-items:center; }
  .lp-card { background:linear-gradient(160deg,rgba(255,255,255,0.045),rgba(255,255,255,0.015)); border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:28px; transition:transform .2s, border-color .2s; }
  .lp-card:hover { transform:translateY(-4px); border-color:rgba(200,149,108,0.4); }
  .lp-grid3 { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
  .lp-grid4 { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
  .lp-grid5 { display:grid; grid-template-columns:repeat(5,1fr); gap:14px; }
  .lp-check { display:flex; gap:12px; align-items:flex-start; font-size:15px; line-height:1.6; color:#c9b9a8; margin-bottom:14px; }
  .lp-check span.ic { color:#c8956c; margin-top:2px; }
  .lp-cal { background:#111; border:1px solid rgba(200,149,108,0.25); border-radius:22px; padding:26px; box-shadow:0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03); }
  .lp-cal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:6px; }
  .lp-day { text-align:center; padding:9px 0; border-radius:8px; font-size:13px; }
  .lp-kat { display:flex; flex-direction:column; align-items:center; gap:12px; padding:22px 12px; text-align:center; font-size:13px; font-weight:500; color:#c9b9a8; }
  .lp-cta { text-align:center; padding:84px 24px; border-radius:28px; background:radial-gradient(ellipse 700px 300px at 50% 0, rgba(200,149,108,0.22), transparent 70%), #111; border:1px solid rgba(200,149,108,0.25); }
  .lp-foot a { font-size:13px; color:#5A5550; }
  .lp-foot a:hover { color:#c8956c; }
  @media (max-width:860px) {
    .lp-two { grid-template-columns:1fr; gap:36px; }
    .lp-grid3, .lp-grid4 { grid-template-columns:1fr 1fr; }
    .lp-grid5 { grid-template-columns:repeat(3,1fr); }
    .lp-sec { padding:64px 0; }
    .lp-hero { padding:64px 0 56px; }
    .lp-hide-m { display:none; }
  }
  .lp-nav .lp-btn { white-space:nowrap; }
  .lp-nav-logo { white-space:nowrap; }
  @media (max-width:560px) {
    .lp-grid3, .lp-grid4 { grid-template-columns:1fr; }
    .lp-grid5 { grid-template-columns:repeat(2,1fr); }
    .lp-btn { width:100%; }
    .lp-hide-s { display:none; }
    .lp-nav .lp-btn { width:auto; padding:9px 14px !important; font-size:13px !important; }
  }
`

export default function LandingPage() {
  const tage = Array.from({ length: 31 }, (_, i) => i + 1)
  return (
    <div className="lp">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <nav className="lp-nav">
        <div className="lp-wrap lp-nav-in">
          <Link href="/" className="lp-h lp-nav-logo" style={{ fontSize: 24 }}>
            Mi-<span style={{ color: '#c8956c' }}>Werk</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <Link href="/suche" className="lp-hide-m" style={{ fontSize: 14, color: '#9A8878' }}>Dienstleister finden</Link>
            <Link href="/login" className="lp-hide-s" style={{ fontSize: 14, color: '#9A8878' }}>Anmelden</Link>
            <Link href="/login" className="lp-btn lp-btn-p" style={{ padding: '10px 20px', fontSize: 14 }}>Kostenlos eintragen</Link>
          </div>
        </div>
      </nav>

      <header className="lp-hero">
        <div className="lp-wrap">
          <div className="lp-kicker">Dienstleister in deiner Region</div>
          <h1 className="lp-h">Finde Dienstleister, die <span style={{ color: '#c8956c' }}>wirklich Zeit</span> haben.</h1>
          <p>Dienstleister verbinden ihren Kalender mit mi-werk. Du siehst sofort, wann sie frei sind – kein Hin und Her, keine endlosen Telefonate.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/suche" className="lp-btn lp-btn-p"><Icon name="search" size={18} /> Dienstleister finden</Link>
            <Link href="/login" className="lp-btn lp-btn-s">Als Dienstleister eintragen <Icon name="arrow" size={18} /></Link>
          </div>
          <div className="lp-chips">
            <span className="lp-chip"><Icon name="calendar" size={15} /> Verfügbarkeit auf einen Blick</span>
            <span className="lp-chip"><Icon name="euro" size={15} /> Für Kunden kostenlos</span>
            <span className="lp-chip"><Icon name="check" size={15} /> 12 Monate kostenlos testen</span>
            <span className="lp-chip"><Icon name="lock" size={15} /> Nur frei/besetzt sichtbar</span>
          </div>
        </div>
      </header>

      <section className="lp-sec lp-sec-alt">
        <div className="lp-wrap lp-two">
          <div>
            <div className="lp-kicker">Der Mehrwert</div>
            <h2 className="lp-h lp-title">Der Kalender macht den Unterschied.</h2>
            <p className="lp-lead">Dienstleister tragen ihre Verfügbarkeit einfach über ihren bestehenden Kalender ein. Für Kundinnen und Kunden heißt das: sofort sehen, wer wann Zeit hat – und nur Anfragen, die wirklich passen.</p>
            <div className="lp-check"><span className="ic"><Icon name="check" size={20} /></span><span><strong style={{ color: '#E8DDD4' }}>Einmal verbinden, fertig.</strong> Google-Kalender, Outlook oder iPhone-Kalender per Link – ohne technisches Vorwissen.</span></div>
            <div className="lp-check"><span className="ic"><Icon name="check" size={20} /></span><span><strong style={{ color: '#E8DDD4' }}>Keine 5 Anrufe für einen Termin.</strong> Kundinnen und Kunden sehen vorab, ob ein Termin überhaupt möglich ist.</span></div>
            <div className="lp-check"><span className="ic"><Icon name="lock" size={20} /></span><span><strong style={{ color: '#E8DDD4' }}>Privat bleibt privat.</strong> Sichtbar ist nur „frei“ oder „besetzt“ – nie Titel, Ort oder Details deiner Termine.</span></div>
          </div>
          <div className="lp-cal" aria-hidden="true">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <span style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#5A5550' }}>Verfügbarkeit</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Beispiel-Profil</span>
            </div>
            <div className="lp-cal-grid" style={{ marginBottom: 8 }}>
              {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(w => <div key={w} style={{ textAlign: 'center', fontSize: 11, color: '#5A5550' }}>{w}</div>)}
            </div>
            <div className="lp-cal-grid">
              {[0, 1].map(i => <div key={'e' + i} />)}
              {tage.map(t => {
                const belegt = BELEGT.includes(t)
                return (
                  <div key={t} className="lp-day" style={{ background: belegt ? 'rgba(192,57,43,0.16)' : 'rgba(39,174,96,0.12)', color: belegt ? '#d9604f' : '#3fbf74' }}>{t}</div>
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: 18, marginTop: 18, fontSize: 12, color: '#9A8878' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><i style={{ width: 10, height: 10, borderRadius: 3, background: 'rgba(39,174,96,0.5)', display: 'inline-block' }} /> Frei</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><i style={{ width: 10, height: 10, borderRadius: 3, background: 'rgba(192,57,43,0.5)', display: 'inline-block' }} /> Belegt</span>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-sec">
        <div className="lp-wrap">
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 52px' }}>
            <div className="lp-kicker">Für beide Seiten</div>
            <h2 className="lp-h lp-title">Weniger Aufwand. Mehr passende Anfragen.</h2>
          </div>
          <div className="lp-two" style={{ alignItems: 'stretch' }}>
            <div className="lp-card">
              <IconBadge name="search" size={52} style={{ marginBottom: 18 }} />
              <h3 className="lp-h" style={{ fontSize: 24, margin: '0 0 16px' }}>Für Kundinnen und Kunden</h3>
              <div className="lp-check"><span className="ic"><Icon name="check" size={18} /></span>Dienstleister nach Ort, Gewerk oder Name finden</div>
              <div className="lp-check"><span className="ic"><Icon name="check" size={18} /></span>Verfügbarkeit direkt im Profil sehen</div>
              <div className="lp-check"><span className="ic"><Icon name="check" size={18} /></span>Bewertungen und Profile vergleichen</div>
              <div className="lp-check"><span className="ic"><Icon name="check" size={18} /></span>Direkt Kontakt aufnehmen – kostenlos und ohne Konto</div>
              <Link href="/suche" className="lp-btn lp-btn-s" style={{ marginTop: 10 }}>Jetzt suchen <Icon name="arrow" size={18} /></Link>
            </div>
            <div className="lp-card" style={{ borderColor: 'rgba(200,149,108,0.35)' }}>
              <IconBadge name="trend" size={52} style={{ marginBottom: 18 }} />
              <h3 className="lp-h" style={{ fontSize: 24, margin: '0 0 16px' }}>Für Dienstleister</h3>
              <div className="lp-check"><span className="ic"><Icon name="check" size={18} /></span>12 Monate kostenlos testen, ohne Risiko</div>
              <div className="lp-check"><span className="ic"><Icon name="check" size={18} /></span>Sichtbar werden, ohne selbst Marketing zu betreiben</div>
              <div className="lp-check"><span className="ic"><Icon name="check" size={18} /></span>Kalender verbinden – es kommen nur Anfragen, wenn du Zeit hast</div>
              <div className="lp-check"><span className="ic"><Icon name="check" size={18} /></span>Profil in wenigen Minuten angelegt</div>
              <Link href="/login" className="lp-btn lp-btn-p" style={{ marginTop: 10 }}>Kostenlos eintragen <Icon name="arrow" size={18} /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-sec lp-sec-alt">
        <div className="lp-wrap">
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 52px' }}>
            <div className="lp-kicker">Warum mi-werk</div>
            <h2 className="lp-h lp-title">Reichweite, die für dich arbeitet.</h2>
            <p className="lp-lead" style={{ margin: 0 }}>mi-werk macht sich über Social Media bekannt. Je bekannter die Plattform wird, desto mehr profitieren alle gelisteten Dienstleister – ohne dass du selbst etwas posten musst.</p>
          </div>
          <div className="lp-grid4">
            {[
              ['pin', 'Direkt auffindbar', 'Kundinnen und Kunden suchen gezielt nach Ort, Gewerk oder Name.'],
              ['trend', 'Wachsende Reichweite', 'Wir bauen die Bekanntheit der Plattform auf – du profitierst automatisch.'],
              ['clock', 'In Minuten startklar', 'Name, Bereich und Ort angeben – dein Profil ist sofort sichtbar.'],
              ['sparkle', '12 Monate kostenlos', 'Risikofrei testen, danach ein günstiges Abo je Branche.'],
            ].map(([icon, titel, text]) => (
              <div key={titel} className="lp-card">
                <IconBadge name={icon} size={48} style={{ marginBottom: 16 }} />
                <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>{titel}</div>
                <div style={{ fontSize: 14, lineHeight: 1.65, color: '#9A8878' }}>{text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-sec">
        <div className="lp-wrap">
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 52px' }}>
            <div className="lp-kicker">So funktioniert es</div>
            <h2 className="lp-h lp-title">In 3 Schritten zum Dienstleister.</h2>
          </div>
          <div className="lp-grid3">
            {[
              ['1', 'Registrieren', 'Kostenloses Konto per E-Mail anlegen.'],
              ['2', 'Profil anlegen & Kalender verbinden', 'Name, Bereich und Ort angeben, Kalender mit einem Klick verbinden.'],
              ['3', 'Gefunden werden', 'Kundinnen und Kunden sehen dein Profil und deine Verfügbarkeit.'],
            ].map(([n, titel, text]) => (
              <div key={n} className="lp-card">
                <div className="lp-h" style={{ fontSize: 44, color: '#c8956c', lineHeight: 1, marginBottom: 14 }}>{n}</div>
                <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>{titel}</div>
                <div style={{ fontSize: 14, lineHeight: 1.65, color: '#9A8878' }}>{text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-sec lp-sec-alt">
        <div className="lp-wrap">
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 48px' }}>
            <div className="lp-kicker">Kategorien</div>
            <h2 className="lp-h lp-title">Für jede Branche das passende Angebot.</h2>
          </div>
          <div className="lp-grid5">
            {KATEGORIEN.map(k => (
              <Link key={k} href="/suche" className="lp-card lp-kat">
                <IconBadge name={iconNameFuerKategorie(k)} size={52} />
                {k}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-sec">
        <div className="lp-wrap">
          <div className="lp-card" style={{ display: 'flex', gap: 22, alignItems: 'center', flexWrap: 'wrap' }}>
            <IconBadge name="shield" size={60} />
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>Transparent mit deinen Daten</div>
              <div style={{ fontSize: 14, lineHeight: 1.7, color: '#9A8878' }}>Aus deinem Kalender übernehmen wir ausschließlich, ob du frei oder beschäftigt bist. Kundinnen und Kunden brauchen kein Konto, um Dienstleister zu finden. Mehr dazu in der <Link href="/datenschutz" style={{ color: '#c8956c', textDecoration: 'underline' }}>Datenschutzerklärung</Link>.</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 24px 96px' }}>
        <div className="lp-wrap lp-cta">
          <h2 className="lp-h lp-title" style={{ marginBottom: 14 }}>Bereit, gefunden zu werden?</h2>
          <p className="lp-lead" style={{ maxWidth: 520, margin: '0 auto 30px' }}>Lege jetzt dein Profil an – 12 Monate kostenlos und in wenigen Minuten startklar.</p>
          <Link href="/login" className="lp-btn lp-btn-p" style={{ fontSize: 17, padding: '17px 36px' }}>Jetzt kostenlos eintragen <Icon name="arrow" size={18} /></Link>
        </div>
      </section>

      <footer className="lp-foot" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '36px 24px', textAlign: 'center' }}>
        <div className="lp-h" style={{ fontSize: 18, marginBottom: 14 }}>Mi-<span style={{ color: '#c8956c' }}>Werk</span></div>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/suche">Dienstleister finden</Link>
          <Link href="/impressum">Impressum</Link>
          <Link href="/datenschutz">Datenschutz</Link>
          <Link href="/kontakt">Kontakt</Link>
          <Link href="/agb">AGB</Link>
        </div>
        <div style={{ fontSize: 12, color: '#3f3b37', marginTop: 16 }}>© 2026 Mi-Werk. Alle Rechte vorbehalten.</div>
      </footer>
    </div>
  )
}
