import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'

export default function GDPR() {
  return (
    <>
      <SEO title="Ochrana osobných údajov" description="Zásady ochrany osobných údajov spoločnosti Brandrise s.r.o. — Monetico." canonical="https://www.monetico.sk/ochrana-osobnych-udajov/" />
      <Nav />
      <div style={{ padding: '140px 48px 100px', maxWidth: '860px' }}>
        <div className="section-label">Právne informácie</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(40px,6vw,80px)', letterSpacing: '-3px', lineHeight: '0.95', marginBottom: '60px' }}>
          OCHRANA<br />OSOBNÝCH<br />ÚDAJOV
        </h1>
        <div className="article-body">
          <h2>1. Prevádzkovateľ</h2>
          <p>Prevádzkovateľom osobných údajov je spoločnosť <strong>Brandrise s.r.o.</strong>, so sídlom Sokolovská 178/10, 040 11 Košice, IČO: 53196449, DIČ: 2121313865, IČ DPH: SK2121313865 (ďalej len „prevádzkovateľ").</p>
          <p>Kontaktný e-mail: <a href="mailto:info@monetico.sk">info@monetico.sk</a></p>

          <h2>2. Aké osobné údaje spracúvame</h2>
          <p>Spracúvame nasledovné kategórie osobných údajov:</p>
          <ul>
            <li>Identifikačné údaje (meno, priezvisko)</li>
            <li>Kontaktné údaje (e-mailová adresa, telefónne číslo)</li>
            <li>Prevádzkové údaje (IP adresa, súbory cookies, správanie na webe)</li>
            <li>Obchodné údaje (komunikácia, objednávky, záujmy o služby)</li>
          </ul>

          <h2>3. Účel a právny základ spracúvania</h2>
          <p>Vaše osobné údaje spracúvame na nasledovné účely:</p>
          <ul>
            <li>Odpoveď na vaše dopyty a konzultácie — právny základ: oprávnený záujem</li>
            <li>Plnenie zmluvy o poskytovaní služieb — právny základ: plnenie zmluvy</li>
            <li>Zasielanie newslettera — právny základ: súhlas dotknutej osoby</li>
            <li>Analytika a zlepšovanie webu — právny základ: súhlas (cookies)</li>
          </ul>

          <h2>4. Príjemcovia osobných údajov</h2>
          <p>Vaše osobné údaje môžu byť zdieľané s nasledovnými kategóriami príjemcov: poskytovatelia IT služieb a cloudových riešení, poskytovatelia emailových a marketingových nástrojov, účtovní poradcovia a audítori, orgány verejnej správy (na základe zákonnej povinnosti).</p>

          <h2>5. Doba uchovávania</h2>
          <p>Osobné údaje uchovávame po dobu nevyhnutnú na splnenie účelu, na ktorý boli zhromaždené, a to najmenej po dobu trvania zmluvného vzťahu. Po jeho ukončení uchovávame údaje v súlade so zákonom o archívoch a evidencii, spravidla 5–10 rokov.</p>

          <h2>6. Vaše práva</h2>
          <p>Ako dotknutá osoba máte nasledovné práva:</p>
          <ul>
            <li>Právo na prístup k osobným údajom</li>
            <li>Právo na opravu nepresných údajov</li>
            <li>Právo na vymazanie (právo byť zabudnutý)</li>
            <li>Právo na obmedzenie spracúvania</li>
            <li>Právo na prenosnosť údajov</li>
            <li>Právo namietať voči spracúvaniu</li>
            <li>Právo odvolať súhlas</li>
          </ul>
          <p>Svoju žiadosť môžete zaslať na e-mail <a href="mailto:info@monetico.sk">info@monetico.sk</a>. Máte tiež právo podať sťažnosť na Úrad na ochranu osobných údajov SR.</p>

          <h2>7. Cookies</h2>
          <p>Táto webová stránka používa súbory cookies na analýzu návštevnosti a zlepšenie používateľského zážitku. Používame Google Analytics (GA4). Cookies môžete kedykoľvek odmietnuť alebo vymazať v nastaveniach vášho prehliadača.</p>

          <h2>8. Bezpečnosť</h2>
          <p>Prijali sme primerané technické a organizačné opatrenia na ochranu vašich osobných údajov pred neoprávneným prístupom, stratou alebo zničením.</p>

          <h2>9. Zmeny zásad</h2>
          <p>Tieto zásady ochrany osobných údajov môžeme priebežne aktualizovať. Aktuálna verzia je vždy dostupná na tejto stránke. Posledná aktualizácia: január 2025.</p>
        </div>
      </div>
      <Footer />
    </>
  )
}
