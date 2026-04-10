import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import { SITE_URL } from '../../lib/site';

export default function GDPRPage() {
  return (
    <>
      <SEO
        title="GDPR"
        description="Informácie o spracovaní osobných údajov podľa nariadenia GDPR — Monetico digitálna agentúra."
        canonical={`${SITE_URL}/gdpr/`}
      />
      <Nav />
      <main style={{ background: 'transparent', minHeight: '100vh', paddingTop: 120 }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '80px 40px 120px' }}>
          <span style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 11,
            letterSpacing: '0.2em',
            color: 'var(--acid)',
            textTransform: 'uppercase',
          }}>
            — Právne informácie
          </span>
          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(36px, 6vw, 72px)',
            color: '#fff',
            margin: '16px 0 64px',
            lineHeight: 1,
          }}>
            GDPR
          </h1>

          <div style={{ color: '#aaa', fontFamily: 'DM Sans, sans-serif', fontSize: 16, lineHeight: 1.8 }}>

            <h2 style={{ color: '#fff', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 24, margin: '48px 0 16px' }}>
              1. Prevádzkovateľ osobných údajov
            </h2>
            <p>
              Prevádzkovateľom osobných údajov je spoločnosť <strong style={{ color: '#fff' }}>Brandrise s. r. o.</strong>,
              so sídlom Sokolovská 178/10, 040 11 Košice, IČO: 53196449, DIČ: 2121313865, IČ DPH: SK2121313865,
              prevádzkujúca značku <strong style={{ color: '#fff' }}>Monetico</strong>.
            </p>
            <p>Kontaktný e-mail: <a href="mailto:info@monetico.sk" style={{ color: 'var(--acid)' }}>info@monetico.sk</a></p>

            <h2 style={{ color: '#fff', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 24, margin: '48px 0 16px' }}>
              2. Účel a právny základ spracúvania
            </h2>
            <p>Vaše osobné údaje spracúvame na nasledovné účely:</p>
            <ul style={{ paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><strong style={{ color: '#fff' }}>Plnenie zmluvy</strong> — spracovanie objednávok, fakturácia, komunikácia ohľadom poskytovaných služieb (čl. 6 ods. 1 písm. b) GDPR).</li>
              <li><strong style={{ color: '#fff' }}>Oprávnený záujem</strong> — zasielanie relevantných obchodných ponúk existujúcim klientom (čl. 6 ods. 1 písm. f) GDPR).</li>
              <li><strong style={{ color: '#fff' }}>Súhlas</strong> — zasielanie newsletteru a marketingových e-mailov (čl. 6 ods. 1 písm. a) GDPR).</li>
              <li><strong style={{ color: '#fff' }}>Zákonná povinnosť</strong> — vedenie účtovníctva a daňová evidencia (čl. 6 ods. 1 písm. c) GDPR).</li>
            </ul>

            <h2 style={{ color: '#fff', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 24, margin: '48px 0 16px' }}>
              3. Aké osobné údaje spracúvame
            </h2>
            <ul style={{ paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>Identifikačné údaje: meno, priezvisko, názov firmy, IČO, DIČ</li>
              <li>Kontaktné údaje: e-mailová adresa, telefónne číslo, adresa</li>
              <li>Fakturačné a platobné údaje</li>
              <li>Údaje o využívaných službách</li>
              <li>Technické údaje pri návšteve webu (IP adresa, cookies — pozri sekciu Cookies)</li>
            </ul>

            <h2 style={{ color: '#fff', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 24, margin: '48px 0 16px' }}>
              4. Doba uchovávania
            </h2>
            <p>
              Osobné údaje uchovávame len po dobu nevyhnutnú na splnenie účelu spracovania:
            </p>
            <ul style={{ paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>Zmluvné údaje — po dobu trvania zmluvného vzťahu a 3 roky po jeho ukončení</li>
              <li>Účtovné doklady — 10 rokov podľa zákona o účtovníctve</li>
              <li>Marketingový súhlas — do jeho odvolania</li>
            </ul>

            <h2 style={{ color: '#fff', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 24, margin: '48px 0 16px' }}>
              5. Vaše práva
            </h2>
            <p>Podľa GDPR máte nasledovné práva:</p>
            <ul style={{ paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><strong style={{ color: '#fff' }}>Právo na prístup</strong> — zistiť, aké údaje o vás spracúvame</li>
              <li><strong style={{ color: '#fff' }}>Právo na opravu</strong> — opraviť nesprávne alebo neúplné údaje</li>
              <li><strong style={{ color: '#fff' }}>Právo na vymazanie</strong> — „právo byť zabudnutý"</li>
              <li><strong style={{ color: '#fff' }}>Právo na obmedzenie spracúvania</strong></li>
              <li><strong style={{ color: '#fff' }}>Právo na prenosnosť údajov</strong></li>
              <li><strong style={{ color: '#fff' }}>Právo namietať</strong> — najmä voči spracúvaniu na marketingové účely</li>
              <li><strong style={{ color: '#fff' }}>Právo odvolať súhlas</strong> — kedykoľvek bez uvedenia dôvodu</li>
            </ul>
            <p>
              Svoju požiadavku nám môžete zaslať na <a href="mailto:info@monetico.sk" style={{ color: 'var(--acid)' }}>info@monetico.sk</a>.
              Máte tiež právo podať sťažnosť na Úrad na ochranu osobných údajov SR (<a href="https://www.uoou.sk" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--acid)' }}>uoou.sk</a>).
            </p>

            <h2 style={{ color: '#fff', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 24, margin: '48px 0 16px' }}>
              6. Príjemcovia osobných údajov
            </h2>
            <p>
              Vaše osobné údaje nepredávame tretím stranám. Môžeme ich sprístupniť len:
            </p>
            <ul style={{ paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>Účtovníckym a daňovým poradcom (zákonná povinnosť)</li>
              <li>Poskytovateľom IT infraštruktúry (napr. hosting, e-mailové nástroje) — na základe zmlúv o spracovaní údajov</li>
              <li>Orgánom verejnej moci, ak to vyžaduje zákon</li>
            </ul>

            <h2 style={{ color: '#fff', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 24, margin: '48px 0 16px' }}>
              7. Cookies
            </h2>
            <p>
              Naša webová stránka používa súbory cookies. Podrobné informácie nájdete v sekcii
              {' '}<a href="/ochrana-osobnych-udajov/" style={{ color: 'var(--acid)' }}>Ochrana osobných údajov</a>.
              Cookies, ktoré nie sú nevyhnutné, používame len s vaším súhlasom.
            </p>

            <h2 style={{ color: '#fff', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 24, margin: '48px 0 16px' }}>
              8. Zmeny tohto dokumentu
            </h2>
            <p>
              Vyhradzujeme si právo tento dokument aktualizovať. Aktuálna verzia je vždy dostupná na tejto stránke.
              Posledná aktualizácia: <strong style={{ color: '#fff' }}>marec 2025</strong>.
            </p>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
