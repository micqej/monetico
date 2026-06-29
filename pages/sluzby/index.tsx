import Link from 'next/link';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import { ArrowUpRightIcon, ServiceIcon, type ServiceIconName } from '../../components/Icons';
import { SITE_URL } from '../../lib/site';

const services = [
  {
    slug: 'cold-email',
    title: 'Cold Email kampane',
    subtitle: 'B2B outreach na autopilote',
    description: 'Oslovíme správnych ľudí v správnom čase. Nastavíme kompletnú cold email infraštruktúru, napíšeme sekvencie a spravujeme kampane.',
    price: 'od 100 €',
    priceNote: 'mesačne + setup',
    icon: 'mail' as ServiceIconName,
  },
  {
    slug: 'seo',
    title: 'SEO obsah & Link building',
    subtitle: 'Organická viditeľnosť, ktorá rastie',
    description: 'Komplexná SEO stratégia: analýza kľúčových slov, optimalizácia stránok, budovanie odkazov a pravidelný reporting.',
    price: 'od 100 €',
    priceNote: 'mesačne',
    icon: 'seo' as ServiceIconName,
  },
  {
    slug: 'texty-a-clanky',
    title: 'SEO texty & copywriting',
    subtitle: 'Obsah, ktorý predáva aj rankuje',
    description: 'Píšeme SEO články, texty na web, popisy produktov, kategórie pre e-shopy a pravidelný blog. Obsah optimalizovaný pre vyhľadávače aj zákazníkov.',
    price: 'od 1,5 €',
    priceNote: 'za produkt / text individuálne',
    icon: 'copy' as ServiceIconName,
  },
  {
    slug: 'socialne-media',
    title: 'Sociálne médiá',
    subtitle: 'Komunita, ktorá kupuje',
    description: 'Správa Instagramu, Facebooku a LinkedInu. Tvorba obsahu, stories, reels, mesačný report a sledovanie trendov.',
    price: 'od 200 €',
    priceNote: 'mesačne',
    icon: 'social' as ServiceIconName,
  },
  {
    slug: 'email-marketing',
    title: 'Email marketing',
    subtitle: 'Retenčný kanál s najvyšším ROI',
    description: 'Nastavíme a spravujeme email marketing: automatizácie, newslettery, segmentácia databázy a A/B testovanie.',
    price: 'od 70 €',
    priceNote: 'mesačne + setup',
    icon: 'email' as ServiceIconName,
  },
  {
    slug: 'tvorba-webov',
    title: 'Tvorba webov & e-shopov',
    subtitle: 'Weby, ktoré konvertujú',
    description: 'Prezentačné weby, e-shopy na Shoptete aj WordPresse. Dizajn na mieru, rýchlosť, SEO a správa doménového ekosystému.',
    price: 'od 800 €',
    priceNote: 'jednorazovo',
    icon: 'web' as ServiceIconName,
  },
];

export default function SluzbyPage() {
  return (
    <>
      <SEO
        title="Služby"
        description="Cold emailing, SEO, sociálne médiá, email marketing, tvorba webov a copywriting. Komplexný digitálny marketing pre vaše podnikanie."
        canonical={`${SITE_URL}/sluzby/`}
      />
      <Nav />

      {/* Hero */}
      <div className="archive-hero">
        <div>
          <div className="section-label">Čo robíme</div>
          <h1 className="archive-title">NAŠE<br /><span className="outline">SLUŽBY</span></h1>
        </div>
        <p className="archive-desc">
          Od cold emailu až po kompletné weby. Jeden partner pre celý váš digitálny rast — bez chaosu a bez prázdnych sľubov.
        </p>
      </div>

      {/* Services grid */}
      <section className="services-overview-shell">
        <div className="services-overview-grid">
          {services.map((s) => (
            <Link key={s.slug} href={`/sluzby/${s.slug}/`} style={{ textDecoration: 'none', display: 'block' }}>
              <div className="services-overview-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="service-overview-icon" style={{ color: 'var(--purple)' }}>
                    <ServiceIcon name={s.icon} size={28} />
                  </span>
                  <span style={{ color: 'var(--ink)', display: 'inline-flex' }}>
                    <ArrowUpRightIcon size={18} />
                  </span>
                </div>

                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--purple)' }}>
                    {s.subtitle}
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: 'var(--ink)', margin: '8px 0 0', lineHeight: 1.1, letterSpacing: '-0.5px' }}>
                    {s.title}
                  </h3>
                </div>

                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14.5, color: 'var(--muted)', lineHeight: 1.65, flex: 1 }}>
                  {s.description}
                </p>

                <div style={{ borderTop: '2px solid var(--ink)', paddingTop: 18, display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 26, color: 'var(--ink)', letterSpacing: '-1px' }}>
                    {s.price}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>
                    {s.priceNote}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
