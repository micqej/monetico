import Link from 'next/link'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'

type Plan = { name: string; price: string; setup?: string; highlight?: boolean; features: string[] }
type Service = {
  slug: string; icon: string; title: string; desc: string
  metaDesc: string; plans: Plan[]
  includes: string[]; process: string[]
}

const SERVICES: Service[] = [
  {
    slug: 'cold-email',
    icon: '✉',
    title: 'Cold Email Kampane',
    desc: 'Cold emailing je cielené oslovovanie potenciálnych zákazníkov prostredníctvom e-mailu — firiem alebo jednotlivcov, s ktorými ste doposiaľ neboli v kontakte. Oslovujete priamo ľudí s rozhodovacou právomocou, bez závislosti od algoritmov.',
    metaDesc: 'Cold email kampane pre B2B firmy na Slovensku. Oslovia tisíce potenciálnych zákazníkov mesačne. Balíky od 100 €/mes.',
    plans: [
      { name: 'MINI', price: '100 € / mes.', setup: 'Nastavenie: 300 €', features: ['1 doména, 3 email účty', '~1 500 oslovených / mes.', '1 emailová sekvencia', 'Overenie do 2 000 emailov', 'Základný report', 'Vlastné servery'] },
      { name: 'OPTIMAL', price: '200 € / mes.', setup: 'Nastavenie: 600 €', highlight: true, features: ['5 domén, 15 email účtov', '~7 500 oslovených / mes.', '2 emailové sekvencie', '1 segment databázy', 'Overenie do 10 000 emailov', 'Priebežná optimalizácia', 'Rozšírený report'] },
      { name: 'POWER', price: '300 € / mes.', setup: 'Nastavenie: 800 €', features: ['10 domén, 30 email účtov', '~15 000 oslovených / mes.', '4 emailové sekvencie', '2 segmenty databázy', 'A/B testovanie', 'Overenie do 20 000 emailov', 'Rozšírený report'] },
    ],
    includes: ['Nákup domén a emailových schránok', 'Postupné zohriatie emailov (warm-up)', 'Vytvorenie emailových sekvencií', 'Databáza kontaktov na mieru', 'Overenie emailových adries', 'Odosielanie cez vlastné servery', 'Mesačný report'],
    process: ['Audit a príprava stratégie', 'Nákup domén a zohriatie (2–3 týždne)', 'Tvorba databázy a sekvencií', 'Spustenie kampane', 'Optimalizácia a reporting'],
  },
  {
    slug: 'seo',
    icon: '◎',
    title: 'SEO & Linkbuilding',
    desc: 'SEO optimalizácia vám pomôže získať organickú návštevnosť bez platených reklám. Analyzujeme váš web, odhalíme chyby a systematicky zlepšujeme viditeľnosť vo vyhľadávaní.',
    metaDesc: 'SEO optimalizácia a linkbuilding pre slovenské weby. Technické SEO, analýza kľúčových slov, spätné odkazy. Od 200 €/mes.',
    plans: [
      { name: 'SEO Optimalizácia', price: '200 € / mes.', features: ['Základná SEO analýza', 'Odhalenie SEO chýb', 'Návrhy na vylepšenie', 'Zlepšovanie viditeľnosti', 'Mesačný report'] },
      { name: 'SEO + Linkbuilding', price: '250 € / mes.', highlight: true, features: ['Všetko zo SEO Optimalizácie', 'Linkbuilding (5 odkazov/mes.)', 'Analýza súčasného stavu', 'Návrh stratégie odkazov', 'Zľava 50 € oproti samostatným'] },
      { name: 'Ročný balík', price: '2 750 € / rok', features: ['12 mesiacov SEO + Linkbuilding', 'Mesiac zdarma (úspora 250 €)', 'Analýza kľúčových slov', 'Analýza konkurencie', 'GA4 + Search Console setup'] },
    ],
    includes: ['Technická SEO analýza', 'Analýza kľúčových slov (450 € jednorazovo)', 'Analýza konkurencie (150 € jednorazovo)', 'Linkbuilding — 5 kvalitných spätných odkazov', 'GA4, Search Console, Tag Manager', 'Mesačný report'],
    process: ['Audit webu a analýza', 'Stratégia kľúčových slov', 'Technické opravy', 'Tvorba obsahu a linky', 'Monitoring a optimalizácia'],
  },
  {
    slug: 'socialne-media',
    icon: '◈',
    title: 'Správa Sociálnych Médií',
    desc: 'Profesionálna správa Facebook, Instagram a LinkedIn profilov. Pravidelný obsah, reelsy, správa komunity a mesačné reporty. Vy sa venujete biznisu, my vašim sociálnym sieťam.',
    metaDesc: 'Správa sociálnych sietí — Facebook, Instagram, LinkedIn. Posty, reelsy, stories, komunita. Balíky od 200 €/mes.',
    plans: [
      { name: 'ZÁKLAD', price: '200 € / mes.', features: ['12 postov + 4 stories', '30-dňový plán vopred', 'Sledovanie trendov', 'Mesačný report'] },
      { name: 'ROZBEH', price: '300 € / mes.', highlight: true, features: ['16 postov + 8 stories + 4 reelsy', '30-dňový plán vopred', 'Sledovanie komentárov + trendov', 'Mesačný report'] },
      { name: 'EXPANZIA', price: '500 € / mes.', features: ['30 postov + 16 stories + 4 reelsy', 'Odpovedanie na správy', 'Komentáre + trendy', 'Súťaže + rast followerov', 'Mesačný report'] },
    ],
    includes: ['Tvorba grafiky a textov', '30-dňový obsahový plán', 'Plánovanie a publikovanie', 'Sledovanie trendov a hashtagov', 'Správa komentárov (vyššie balíky)', 'Mesačný report s výsledkami'],
    process: ['Úvodná konzultácia', 'Tvorba obsahovej stratégie', 'Príprava 30-dňového plánu', 'Publikovanie a interakcia', 'Mesačný report a optimalizácia'],
  },
  {
    slug: 'email-marketing',
    icon: '⊛',
    title: 'Email Marketing',
    desc: 'Emailing patrí medzi najefektívnejšie nástroje digitálneho marketingu. Budujte vlastné publikum, automatizujte komunikáciu a získavajte zákazníkov späť — bez závislosti od algoritmov.',
    metaDesc: 'Email marketing pre e-shopy a weby. Newslettery, automatizácie, segmentácia. Balíky od 70 €/mes.',
    plans: [
      { name: 'MINI', price: '70 € / mes.', setup: 'Nastavenie: 200 €', features: ['1 newsletter / mes.', '1 základná automatizácia', 'Import do 1 000 kontaktov', 'Segmentácia databázy', 'Základný report'] },
      { name: 'STANDARD', price: '150 € / mes.', setup: 'Nastavenie: 400 €', highlight: true, features: ['Do 3 newsletterov / mes.', 'Do 3 automatizácií', 'Import do 10 000 kontaktov', 'Pokročilé tagovanie', 'Rozšírený report'] },
      { name: 'PRO', price: '250 € / mes.', setup: 'Nastavenie: 500 €', features: ['Do 6 newsletterov / mes.', '5+ automatizácií', 'Neobmedzený import', 'Full servis + A/B testy', 'Rozšírený report + analýza'] },
    ],
    includes: ['Konfigurácia emailového systému', 'Prepojenie s webom a formulármi', 'Tvorba emailových šablón', 'Automatizácie (uvítací, opustený košík...)', 'Segmentácia a tagovanie kontaktov', 'GDPR funkčnosť', 'Mesačný report'],
    process: ['Nastavenie systému', 'Import a segmentácia databázy', 'Tvorba šablón a automatizácií', 'Spustenie kampaní', 'Optimalizácia podľa výsledkov'],
  },
  {
    slug: 'tvorba-webov',
    icon: '⬡',
    title: 'Tvorba Webov & E-shopov',
    desc: 'Tvoríme moderné, rýchle a konverzné weby na WordPress a e-shopy na Shoptet. Od návrhu dizajnu po spustenie a SEO. Máme za sebou desiatky úspešných projektov na slovenskom trhu.',
    metaDesc: 'Tvorba webov WordPress a Shoptet e-shopov na Slovensku. Moderný dizajn, SEO, rýchlosť. Pýtajte sa na cenu.',
    plans: [
      { name: 'Prezentačný web', price: 'od 800 €', features: ['WordPress na mieru', 'Responzívny dizajn', 'Základné SEO nastavenie', 'Kontaktný formulár', 'Napojenie na GA4'] },
      { name: 'E-shop Shoptet', price: 'od 600 €', highlight: true, features: ['Shoptet na mieru', 'Dizajn a konfigurácia', 'Nastavenie platobných brán', 'SEO a analytika', 'Školenie administrácie'] },
      { name: 'WordPress E-shop', price: 'od 1 200 €', features: ['WooCommerce riešenie', 'Vlastný dizajn', 'Pokročilé funkcie', 'Napojenie na sklady / ERP', 'Kompletná SEO optimalizácia'] },
    ],
    includes: ['Návrh a dizajn na mieru', 'Responzívna verzia (mobil, tablet)', 'Základné SEO nastavenie', 'Napojenie na GA4 a Search Console', 'Zabezpečenie SSL certifikátu', 'Školenie pre správu webu', 'Podpora po spustení'],
    process: ['Brief a analýza požiadaviek', 'Návrh dizajnu a schválenie', 'Vývoj a programovanie', 'Testovanie a korekcie', 'Spustenie a odovzdanie'],
  },
  {
    slug: 'reklama',
    icon: '◬',
    title: 'Google & Facebook Ads',
    desc: 'Reklama na Google a sociálnych sieťach, ktorá prináša reálne výsledky. Správne nastavené kampane, cielenie a priebežná optimalizácia. Pracujeme transparentne — vždy viete, za čo platíte.',
    metaDesc: 'Google Ads a Facebook/Instagram reklama na Slovensku. Balíky od 150 €/mes. + jednorazové nastavenie.',
    plans: [
      { name: 'Google ŠTART', price: '150 € / mes.', setup: 'Nastavenie: 150 €', features: ['1 kampaň mesačne', 'Search / Shopping / Display', 'Základné kľúčové slová', 'GA4 prepojenie', 'Mesačný report'] },
      { name: 'Facebook ŠTART', price: '200 € / mes.', setup: 'Nastavenie: 200 €', features: ['1 reklama mesačne', 'Základné cielenie', 'Vizuál + text', 'Mesačný report', 'Konzultácia 15 min.'] },
      { name: 'Kombinovaný RAST', price: 'od 400 € / mes.', highlight: true, features: ['Google + Facebook kampane', 'Pokročilé cielenie', 'Remarketing', 'Podrobný report', 'Mesačný hovor'] },
    ],
    includes: ['Nastavenie reklamných účtov', 'Výber kľúčových slov / cieľových skupín', 'Tvorba textov a vizuálov', 'Napojenie na GA4 a konverzie', 'Priebežná optimalizácia', 'Mesačný report s odporúčaniami', 'Konzultácia'],
    process: ['Audit a stratégia', 'Nastavenie kampaní', 'Schválenie a spustenie', 'Priebežná optimalizácia', 'Mesačný report a plán'],
  },
]

export default function ServicePage({ service }: { service: Service }) {
  return (
    <>
      <SEO
        title={service.title}
        description={service.metaDesc}
        canonical={`https://www.monetico.sk/sluzby/${service.slug}/`}
      />
      <Nav />

      {/* HERO */}
      <section style={{ padding: '140px 48px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 50% 60% at 70% 20%, rgba(212,245,60,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div className="breadcrumb" style={{ padding: '0 0 40px' }}>
          <Link href="/">Domov</Link>
          <span className="sep">·</span>
          <Link href="/sluzby/">Služby</Link>
          <span className="sep">·</span>
          <span className="current">{service.title}</span>
        </div>
        <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>{service.icon}</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(48px,7vw,100px)', letterSpacing: '-4px', lineHeight: '0.92', marginBottom: '32px' }}>
          {service.title.toUpperCase()}
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--muted)', maxWidth: '640px', lineHeight: '1.75' }}>{service.desc}</p>
      </section>

      {/* PRICING */}
      <section style={{ padding: '0 48px 80px' }}>
        <div className="section-label">Cenník</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2px', background: 'rgba(255,255,255,0.04)' }}>
          {service.plans.map(plan => (
            <div key={plan.name} style={{ background: plan.highlight ? 'var(--grey)' : 'var(--black)', padding: '40px', position: 'relative', borderTop: plan.highlight ? '3px solid var(--acid)' : '3px solid transparent' }}>
              {plan.highlight && (
                <div style={{ position: 'absolute', top: '-1px', left: '40px', background: 'var(--acid)', color: 'var(--black)', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', padding: '4px 12px', textTransform: 'uppercase', fontWeight: 700 }}>
                  Najobľúbenejší
                </div>
              )}
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', letterSpacing: '-0.5px', marginBottom: '8px' }}>{plan.name}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '32px', color: 'var(--acid)', letterSpacing: '-1px', marginBottom: '4px' }}>{plan.price}</div>
              {plan.setup && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', letterSpacing: '1px', marginBottom: '24px' }}>{plan.setup}</div>}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', gap: '10px', fontSize: '13px', color: 'rgba(244,240,232,0.8)', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--acid)', flexShrink: 0, marginTop: '2px' }}>✓</span>
                    {f}
                  </div>
                ))}
              </div>
              <Link href="/kontakt/" style={{ display: 'block', marginTop: '28px', background: plan.highlight ? 'var(--acid)' : 'transparent', border: `1px solid ${plan.highlight ? 'var(--acid)' : 'rgba(255,255,255,0.15)'}`, color: plan.highlight ? 'var(--black)' : 'var(--white)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', padding: '14px', textAlign: 'center', textDecoration: 'none', transition: 'all 0.2s' }}>
                Mám záujem →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* INCLUDES + PROCESS */}
      <section style={{ padding: '0 48px 100px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px' }}>
        <div>
          <div className="section-label">Čo zahŕňa</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {service.includes.map(item => (
              <div key={item} style={{ display: 'flex', gap: '16px', padding: '16px 0', borderBottom: '1px solid var(--border)', fontSize: '15px', color: 'rgba(244,240,232,0.8)', alignItems: 'center' }}>
                <span style={{ color: 'var(--acid)', fontSize: '18px', flexShrink: 0 }}>✦</span>
                {item}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="section-label">Ako prebieha spolupráca</div>
          <div>
            {service.process.map((step, i) => (
              <div key={step} className="process-item">
                <div className="process-step">0{i + 1}</div>
                <div className="process-title" style={{ fontSize: '18px' }}>{step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="cta-strip">
        <h2 className="cta-headline">Začneme<br />hneď?</h2>
        <Link href="/kontakt/" className="cta-btn">Dohodnúť konzultáciu →</Link>
      </div>

      <Footer />
    </>
  )
}

export async function getStaticPaths() {
  return {
    paths: SERVICES.map(s => ({ params: { slug: s.slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const service = SERVICES.find(s => s.slug === params.slug)
  if (!service) return { notFound: true }
  return { props: { service } }
}
