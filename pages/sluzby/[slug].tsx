import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import { ArrowRightIcon, CheckIcon, ServiceIcon, type ServiceIconName } from '../../components/Icons';
import { SITE_URL } from '../../lib/site';

type ServiceData = {
  slug: string;
  title: string;
  subtitle: string;
  color: string;
  icon: ServiceIconName;
  heroText: string;
  forWhom: string[];
  whatYouGet: string[];
  pricing: { name: string; price: string; items: string[] }[];
  faq?: { q: string; a: string }[];
};

const servicesData: Record<string, ServiceData> = {
  'cold-email': {
    slug: 'cold-email',
    title: 'Cold Email kampane',
    subtitle: 'B2B outreach na autopilote',
    color: '#7c9cff',
    icon: 'mail',
    heroText: 'Oslovíme správnych decision makerov skôr, ako to urobia vaši konkurenti. Komplexné nastavenie, kvalifikované leady, merateľné výsledky.',
    forWhom: [
      'B2B firmy hľadajúce nových klientov',
      'SaaS produkty a IT spoločnosti',
      'Agentúry a konzultanti',
      'Recruiting firmy',
      'Výrobné firmy so B2B predajom',
    ],
    whatYouGet: [
      'Nákup a nastavenie domén a emailových schránok',
      '"Zahrievanie" emailov (warm-up)',
      'Výskum a budovanie zoznamu kontaktov',
      'Copywriting emailových sekvencií (A/B testovanie)',
      'Nastavenie v nástroji (ReachInbox, Instantly, Lemlist...)',
      'Mesačný report s metrikami: open rate, reply rate, booked calls',
      'Optimalizácia kampane každý mesiac',
    ],
    pricing: [
      {
        name: 'MINI',
        price: '300 €',
        items: [
          'Nastavenie infraštruktúry',
          '1 kampaň, 1 sekvencia',
          'až 500 emailov/mesiac',
          'Mesačný report',
        ],
      },
      {
        name: 'BASIC',
        price: '500 €',
        items: [
          'Kompletná infraštruktúra',
          '2 kampane, A/B sekvencie',
          'až 1 500 emailov/mesiac',
          'Bi-týždenný report',
          'Správa odpovedí',
        ],
      },
      {
        name: 'OPTIMAL',
        price: '800 €',
        items: [
          'Multi-domain infraštruktúra',
          '3–5 kampaní súbežne',
          'až 4 000 emailov/mesiac',
          'Týždenný report',
          'Správa odpovedí + kvalifikácia',
          'LinkedIn doplnok',
        ],
      },
      {
        name: 'PREMIUM',
        price: '1 200 €',
        items: [
          'Neobmedzená infraštruktúra',
          'Neobmedzené kampane',
          '10 000+ emailov/mesiac',
          'Dedikovaný account manager',
          'Full outreach funnel',
          'LinkedIn + telefón',
          'CRM integrácia',
        ],
      },
    ],
  },
  'seo': {
    slug: 'seo',
    title: 'SEO obsah & Link building',
    subtitle: 'Organická viditeľnosť, ktorá rastie',
    color: '#53b8d9',
    icon: 'seo',
    heroText: 'Dlhodobo udržateľná viditeľnosť vo vyhľadávačoch. Kombinujeme technické SEO, hodnotný obsah a kvalitné spätné odkazy.',
    forWhom: [
      'E-shopy chcúce rásť organicky',
      'Firmy, ktoré nevyhovuje platiť za každý klik',
      'Weby s existujúcou návštevnosťou, ktorú chcú zdvojnásobiť',
      'Firmy vstupujúce na nové trhy',
    ],
    whatYouGet: [
      'Kompletná SEO analýza webu (technická aj obsahová)',
      'Analýza kľúčových slov a konkurencie',
      'On-page optimalizácia (meta tagy, headings, štruktúra)',
      'Pravidelná tvorba SEO článkov a landing pages',
      'Link building — kvalitné slovenské a české weby',
      'Sledovanie pozícií a mesačný report',
      'Google Search Console a Analytics monitoring',
    ],
    pricing: [
      { name: 'SEO Audit', price: '350 €', items: ['Technická analýza', 'Kľúčové slová', 'Konkurencia', 'Akčný plán', 'Jednorazovo'] },
      { name: 'Štart', price: '400 €/mes', items: ['4 SEO články/mesiac', 'On-page optimalizácia', '2 spätné odkazy', 'Mesačný report'] },
      { name: 'Rast', price: '700 €/mes', items: ['8 SEO článkov/mesiac', 'Technické SEO', '5 spätných odkazov', 'Bi-týždenný report'] },
      { name: 'Dominancia', price: '1 200 €/mes', items: ['16 SEO článkov/mesiac', 'Kompletné technické SEO', '10+ spätných odkazov', 'Týždenný report', 'Konzultácia 2x/mes'] },
    ],
  },
  'texty-a-clanky': {
    slug: 'texty-a-clanky',
    title: 'SEO texty & copywriting',
    subtitle: 'Obsah, ktorý predáva aj rankuje',
    color: '#63b98f',
    icon: 'copy',
    heroText: 'Píšeme texty, ktoré vyhľadávače milujú a zákazníci čítajú. Od produktových popisov cez SEO články až po kompletný obsah webu.',
    forWhom: [
      'E-shopy bez času na písanie popisov produktov',
      'Firmy budujúce blog a SEO obsah',
      'Weby, ktoré potrebujú nové texty',
      'Agentúry, ktoré outsourgujú copywriting',
    ],
    whatYouGet: [
      'SEO optimalizované texty (kľúčové slová, štruktúra, meta)',
      'Popisy produktov pre e-shopy',
      'Texty kategórií a landing pages',
      'Pravidelné SEO blogy a články',
      'Texty na web (O nás, Služby, Kontakt...)',
      'Preklady do AJ, DE, PL, HU',
      'Nahodenie textov priamo na web',
    ],
    pricing: [
      { name: 'Popis produktu', price: 'od 10 €', items: ['Jeden produkt', 'SEO optimalizovaný', 'CTA', 'Odovzdanie do 3 dní'] },
      { name: 'SEO článok', price: 'od 60 €', items: ['1 000–2 000 slov', 'Kľúčové slová', 'Interné prepojenia', 'Meta title + description'] },
      { name: 'Balík 20 produktov', price: '160 €', items: ['20 popisov produktov', 'Jednotný tone of voice', 'Odovzdanie do 7 dní'] },
      { name: 'Mesačný blog', price: 'od 250 €/mes', items: ['4 články/mesiac', 'Plán téiem', 'SEO optimalizácia', 'Nahodenie na web'] },
    ],
    faq: [
      { q: 'Ako rýchlo dostanem texty?', a: 'Štandardná dodacia lehota je 3–7 pracovných dní. Pri väčších zákazkách sa dohodne harmonogram.' },
      { q: 'Píšete texty aj v cudzom jazyku?', a: 'Áno, pracujeme aj v angličtine, nemčine, poľštine a maďarčine. Cena sa individuálne dohodne.' },
      { q: 'Môžete nahodiť texty priamo na web?', a: 'Áno, vieme nahodiť texty aj produkty priamo na WordPress, Shoptet alebo iný CMS.' },
    ],
  },
  'socialne-media': {
    slug: 'socialne-media',
    title: 'Sociálne médiá',
    subtitle: 'Komunita, ktorá kupuje',
    color: '#c78a62',
    icon: 'social',
    heroText: 'Pravidelný, hodnotný obsah, ktorý buduje dôveru a premieňa sledovateľov na zákazníkov.',
    forWhom: [
      'Firmy, ktoré chcú byť viditeľné na Instagrame a Facebooku',
      'E-shopy budujúce komunitu',
      'Lokálne podniky a reštaurácie',
      'Odborníci a osobné značky',
    ],
    whatYouGet: [
      'Tvorba vizuálneho obsahu (grafiky, reels, stories)',
      'Copywriting popisov a hashtagov',
      'Plánovanie a publikovanie príspevkov',
      'Sledovanie trendov a algoritmu',
      'Mesačný report s dosahom a angažovanosťou',
      'Komunikácia s komunitou (odpovede na komentáre)',
    ],
    pricing: [
      { name: 'Štart', price: '250 €/mes', items: ['12 príspevkov/mes', '4 stories/mes', 'Mesačný report', '1 sociálna sieť'] },
      { name: 'Rast', price: '450 €/mes', items: ['20 príspevkov/mes', '8 stories + reels', 'Bi-týždenný report', '2 sociálne siete'] },
      { name: 'Dominancia', price: '750 €/mes', items: ['30+ príspevkov/mes', 'Reels, stories, carousel', 'Týždenný report', '3 siete', 'Community management'] },
    ],
  },
  'email-marketing': {
    slug: 'email-marketing',
    title: 'Email marketing',
    subtitle: 'Retenčný kanál s najvyšším ROI',
    color: '#b18ae0',
    icon: 'email',
    heroText: 'Email marketing má stále najvyšší ROI zo všetkých kanálov — až 42 € na každé 1 € investované. My ho nastavíme, zautomatizujeme a spravujeme.',
    forWhom: [
      'E-shopy s existujúcou databázou zákazníkov',
      'B2B firmy s dlhým predajným cyklom',
      'Kurzy a digitálne produkty',
      'Firmy, ktoré chcú viac z existujúcich kontaktov',
    ],
    whatYouGet: [
      'Nastavenie emailovej platformy (Mailchimp, Klaviyo, MailerLite...)',
      'Tvorba automatizácií (welcome séria, abandoned cart, win-back)',
      'Segmentácia databázy',
      'Copywriting a dizajn newsletterov',
      'A/B testovanie predmetov emailov',
      'Mesačný report: open rate, CTR, konverzie',
    ],
    pricing: [
      { name: 'Štart', price: '300 €/mes', items: ['Nastavenie platformy', '2 kampane/mes', 'Základné automatizácie', 'Mesačný report'] },
      { name: 'Rast', price: '500 €/mes', items: ['4 kampane/mes', 'Pokročilé automatizácie', 'Segmentácia', 'A/B testy'] },
      { name: 'Pro', price: '900 €/mes', items: ['Neobmedzené kampane', 'Kompletné automatizácie', 'Pokročilá segmentácia', 'CRM integrácia', 'Týždenný report'] },
    ],
  },
  'tvorba-webov': {
    slug: 'tvorba-webov',
    title: 'Tvorba webov & e-shopov',
    subtitle: 'Weby, ktoré konvertujú',
    color: '#7dd3c8',
    icon: 'web',
    heroText: 'Vytvárame weby a e-shopy, ktoré vyzerajú dobre, načítavajú sa rýchlo a premieňajú návštevníkov na zákazníkov.',
    forWhom: [
      'Firmy bez webu alebo so zastaraným webom',
      'E-shopy hľadajúce lepšiu platformu',
      'Startupy potrebujúce rýchly launch',
      'Firmy, ktoré chcú web s dobrým SEO základom',
    ],
    whatYouGet: [
      'Dizajn na mieru podľa vašej identity',
      'Responzívny web (mobil, tablet, desktop)',
      'SEO optimalizácia od základov',
      'Rýchlosť — Core Web Vitals',
      'Základné GDPR a cookie riešenie',
      'Integrácia analytiky (GA4, Hotjar)',
      '3 mesiace bezplatná podpora po spustení',
    ],
    pricing: [
      { name: 'Prezentačný web', price: 'od 800 €', items: ['Šablóna / WordPress', '5–10 podstránok', 'SEO základ', 'Kontaktný formulár', 'Mobilná verzia'] },
      { name: 'Web na mieru', price: 'od 2 000 €', items: ['Dizajn na mieru', 'Neobmedzené podstránky', 'Pokročilé SEO', 'Rýchlostná optimalizácia', 'Analytika'] },
      { name: 'Shoptet e-shop', price: 'od 800 €', items: ['Nastavenie Shoptetu', 'Dizajn témy', 'Import produktov', 'Platobné metódy', 'SEO nastavenie'] },
      { name: 'WordPress e-shop', price: 'od 2 500 €', items: ['WooCommerce', 'Dizajn na mieru', 'Produktový katalóg', 'Platobná brána', 'SEO & analytika'] },
    ],
  },
  'komplexny-growth': {
    slug: 'komplexny-growth',
    title: 'Komplexný Growth',
    subtitle: 'Jedna stratégia, viac kanálov',
    color: '#7dd3c8',
    icon: 'copy',
    heroText: 'Pre firmy, ktoré nechcú riešiť marketing po častiach. Poskladáme cold email, SEO, obsah, sociálne siete, email marketing aj web do jedného funkčného rastového systému.',
    forWhom: [
      'Firmy, ktoré chcú jedného partnera namiesto piatich dodávateľov',
      'Značky vo fáze rastu, ktoré potrebujú koordináciu naprieč kanálmi',
      'E-shopy a služby, ktoré chcú zvýšiť dopyt aj retenciu súčasne',
      'Majitelia, ktorí chcú mať jasný plán, priority a reporting',
    ],
    whatYouGet: [
      'Rastový audit a prioritizáciu kanálov podľa potenciálu',
      'Mesačný plán kampaní, obsahu a výkonových aktivít',
      'Prepojenie cold emailu, SEO, sociálnych sietí a email marketingu',
      'Landing pages, lead magnety a konverzné úpravy webu',
      'Jednotný reporting a pravidelné strategické konzultácie',
      'Priebežnú optimalizáciu podľa dát a obchodných cieľov',
    ],
    pricing: [
      { name: 'Sprint', price: 'od 900 €/mes', items: ['Audit + roadmapa', '2 hlavné kanály', 'Mesačný reporting', '1 strategický call'] },
      { name: 'Scale', price: 'od 1 500 €/mes', items: ['3–4 prepojené kanály', 'Obsah + distribúcia', 'Lead gen funnel', 'Bi-týždenné konzultácie'] },
      { name: 'Partner', price: 'od 2 500 €/mes', items: ['Kompletný growth stack', 'Priebežné experimenty', 'Týždenné vyhodnocovanie', 'Dedikovaná spolupráca'] },
    ],
    faq: [
      { q: 'Je to vhodné aj pre menšie firmy?', a: 'Áno, ak už máte funkčný produkt alebo službu a chcete systematicky rásť. Growth spolupráca dáva najväčší zmysel tam, kde je priestor prepájať viac kanálov naraz.' },
      { q: 'Musím využívať všetky kanály?', a: 'Nie. Stratégiu skladáme podľa cieľov a kapacít. Niekedy majú zmysel dva silné kanály, inokedy širší mix.' },
      { q: 'Ako rýchlo uvidím výsledky?', a: 'Niektoré kanály prinesú reakcie v priebehu týždňov, iné sa rozbiehajú dlhšie. Dôležité je, že všetko riadime v jednom pláne a vieme presne, čo funguje.' },
    ],
  },
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: Object.keys(servicesData).map(slug => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  return { props: { service: servicesData[slug] || null } };
};

export default function ServicePage({ service }: { service: ServiceData }) {
  if (!service) return null;

  return (
    <>
      <SEO
        title={service.title}
        description={service.heroText}
        canonical={`${SITE_URL}/sluzby/${service.slug}/`}
      />
      <Nav />
      <main style={{ background: 'transparent', minHeight: '100vh', paddingTop: 100 }}>
        {/* Hero */}
        <section style={{
          padding: '80px 40px 80px',
          maxWidth: 1400,
          margin: '0 auto',
          borderBottom: '1px solid #1a1a1a',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, marginBottom: 32 }}>
            <span style={{ color: service.color, display: 'inline-flex' }}>
              <ServiceIcon name={service.icon} size={44} />
            </span>
            <div>
              <span style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: 11,
                letterSpacing: '0.2em',
                color: service.color,
                textTransform: 'uppercase',
              }}>
                — {service.subtitle}
              </span>
              <h1 style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(40px, 6vw, 80px)',
                color: '#fff',
                margin: '8px 0 0',
                lineHeight: 1,
              }}>
                {service.title}
              </h1>
            </div>
          </div>
          <p style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 20,
            color: '#888',
            maxWidth: 700,
            lineHeight: 1.6,
          }}>
            {service.heroText}
          </p>
          <div style={{ marginTop: 40, display: 'flex', gap: 16 }}>
            <Link href="/kontakt/" style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: 12,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '16px 32px',
              background: service.color,
              color: '#0a0a0a',
              textDecoration: 'none',
              fontWeight: 700,
            }}>
              Chcem konzultáciu
            </Link>
          </div>
        </section>

        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 40px' }}>
          {/* For whom + What you get */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
            marginTop: 2,
          }}>
            <div style={{ background: 'var(--panel)', padding: '48px 40px' }}>
              <h2 style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: 28,
                color: '#fff',
                margin: '0 0 32px',
              }}>
                Pre koho je táto služba
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {service.forWhom.map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ color: service.color, marginTop: 2, flexShrink: 0, display: 'inline-flex' }}><ArrowRightIcon size={14} /></span>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: '#aaa', lineHeight: 1.5 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ background: 'var(--panel)', padding: '48px 40px' }}>
              <h2 style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: 28,
                color: '#fff',
                margin: '0 0 32px',
              }}>
                Čo dostanete
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {service.whatYouGet.map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ color: service.color, marginTop: 2, flexShrink: 0, display: 'inline-flex' }}><CheckIcon size={14} /></span>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: '#aaa', lineHeight: 1.5 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pricing */}
          <section style={{ padding: '80px 0' }}>
            <h2 style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: 48,
              color: '#fff',
              margin: '0 0 48px',
            }}>
              Cenník
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.min(service.pricing.length, 4)}, 1fr)`,
              gap: 2,
            }}>
              {service.pricing.map((plan, i) => (
                <div key={i} style={{
                  background: 'var(--panel)',
                  padding: '40px 32px',
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: i === Math.floor(service.pricing.length / 2) ? service.color : '#1a1a1a',
                  }} />
                  <span style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: 10,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#555',
                  }}>
                    {plan.name}
                  </span>
                  <div style={{
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 800,
                    fontSize: 36,
                    color: '#fff',
                    margin: '12px 0 24px',
                  }}>
                    {plan.price}
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {plan.items.map((item, j) => (
                      <li key={j} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span style={{ color: service.color, flexShrink: 0, display: 'inline-flex' }}><CheckIcon size={13} /></span>
                        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#777', lineHeight: 1.4 }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/kontakt/" style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: 11,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    padding: '12px 24px',
                    border: `1px solid ${service.color}`,
                    color: service.color,
                    textDecoration: 'none',
                    display: 'inline-block',
                    transition: 'all 0.2s',
                  }}>
                    Mám záujem
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          {service.faq && (
            <section style={{ padding: '0 0 80px' }}>
              <h2 style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: 48,
                color: '#fff',
                margin: '0 0 48px',
              }}>
                Časté otázky
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {service.faq.map((item, i) => (
                  <div key={i} style={{ background: 'var(--panel)', padding: '32px 40px' }}>
                    <h3 style={{
                      fontFamily: 'Syne, sans-serif',
                      fontWeight: 700,
                      fontSize: 20,
                      color: '#fff',
                      margin: '0 0 12px',
                    }}>
                      {item.q}
                    </h3>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: '#777', margin: 0, lineHeight: 1.6 }}>
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <section style={{
            background: '#111417',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '64px 60px',
            marginBottom: 80,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 40,
            flexWrap: 'wrap',
          }}>
            <div>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 36, color: '#fff', margin: '0 0 8px' }}>
                Zaujalo vás to?
              </h2>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: '#8b9198', margin: 0 }}>
                Nezáväzná konzultácia zdarma. Odpovieme do 24 hodín.
              </p>
            </div>
            <Link href="/kontakt/" style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: 12,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '18px 40px',
              background: service.color,
              color: '#0a0a0a',
              textDecoration: 'none',
              fontWeight: 700,
              flexShrink: 0,
            }}>
              Dohodnúť konzultáciu
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
