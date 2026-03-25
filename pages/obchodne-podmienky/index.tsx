import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'

export default function ObchodnePodmienky() {
  return (
    <>
      <SEO title="Obchodné podmienky" description="Obchodné podmienky spoločnosti Brandrise s.r.o. — Monetico agentúra." canonical="https://www.monetico.sk/obchodne-podmienky/" />
      <Nav />
      <div style={{ padding: '140px 48px 100px', maxWidth: '860px' }}>
        <div className="section-label">Právne informácie</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(40px,6vw,80px)', letterSpacing: '-3px', lineHeight: '0.95', marginBottom: '60px' }}>
          OBCHODNÉ<br />PODMIENKY
        </h1>
        <div className="article-body">
          <h2>1. Základné ustanovenia</h2>
          <p>Tieto všeobecné obchodné podmienky (ďalej len „VOP") upravujú zmluvné vzťahy medzi spoločnosťou <strong>Brandrise s.r.o.</strong>, so sídlom Sokolovská 178/10, 040 11 Košice, IČO: 53196449 (ďalej len „poskytovateľ") a klientom.</p>
          <p>Poskytovateľ je platiteľom DPH (IČ DPH: SK2121313865).</p>

          <h2>2. Predmet zmluvy</h2>
          <p>Predmetom zmluvy je poskytovanie digitálnych marketingových služieb, najmä: cold email kampane, SEO optimalizácia, správa sociálnych sietí, email marketing, tvorba webových stránok a e-shopov, správa PPC reklamy.</p>

          <h2>3. Uzatvorenie zmluvy</h2>
          <p>Zmluva medzi poskytovateľom a klientom sa považuje za uzatvorenú momentom potvrdenia objednávky e-mailom alebo podpisom zmluvy o spolupráci. Pred uzatvorením zmluvy je klientovi poskytnutý cenník a rozsah služieb.</p>

          <h2>4. Platobné podmienky</h2>
          <p>Ceny sú uvedené bez DPH, ak nie je uvedené inak. Faktúry sú splatné do 14 dní od vystavenia. Pri mesačných službách je platba splatná vopred na začiatku každého mesiaca. Jednorazové platby (nastavenie, audit) sú splatné pred začatím práce.</p>
          <p>V prípade omeškania platby má poskytovateľ právo pozastaviť poskytovanie služieb.</p>

          <h2>5. Práva a povinnosti poskytovateľa</h2>
          <p>Poskytovateľ sa zaväzuje poskytovať dohodnuté služby s odbornou starostlivosťou, v dohodnutom rozsahu a termínoch. Poskytovateľ negarantuje konkrétne výsledky (napr. počet konverzií, pozície vo vyhľadávačoch), nakoľko tieto závisia od externých faktorov.</p>

          <h2>6. Práva a povinnosti klienta</h2>
          <p>Klient sa zaväzuje poskytnúť potrebnú súčinnosť, podklady a prístupy potrebné na výkon dohodnutých služieb, a to v dohodnutých termínoch. Klient je zodpovedný za pravdivosť a správnosť poskytnutých podkladov.</p>

          <h2>7. Ochrana dôverných informácií</h2>
          <p>Obe zmluvné strany sa zaväzujú zachovávať mlčanlivosť o všetkých dôverných informáciách získaných v súvislosti so spoluprácou. Táto povinnosť trvá aj po ukončení zmluvného vzťahu.</p>

          <h2>8. Zodpovednosť za škody</h2>
          <p>Poskytovateľ nezodpovedá za škody spôsobené vyššou mocou, nedostatočnou súčinnosťou klienta alebo zásahmi tretích strán (napr. zmeny algoritmov vyhľadávačov, výpadky platforiem).</p>

          <h2>9. Ukončenie zmluvy</h2>
          <p>Klient môže ukončiť mesačné služby výpoveďou s 30-dňovou výpovednou lehotou, a to písomne na e-mail info@monetico.sk. Jednorazové platby za nastavenie a analýzy sú nevratné.</p>

          <h2>10. Záverečné ustanovenia</h2>
          <p>Tieto VOP sa riadia právnym poriadkom Slovenskej republiky. Prípadné spory budú riešené dohodou, prípadne príslušným súdom v SR. Poskytovateľ si vyhradzuje právo tieto VOP meniť — aktuálna verzia je vždy na tejto stránke.</p>
          <p>Posledná aktualizácia: január 2025.</p>
        </div>
      </div>
      <Footer />
    </>
  )
}
